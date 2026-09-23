import React, { useState } from "react";
import { Loader2, Plus, RotateCcw, ChevronDown, Sparkles, DollarSign, Package } from "lucide-react";
import AttributeFields from "./AttributeFields";
import VariantImageUpload from "./VariantImageUpload";

const CURRENCY_OPTIONS = [
  { value: "INR", label: "INR (₹) - Indian Rupee" },
  { value: "USD", label: "USD ($) - US Dollar" },
  { value: "JPY", label: "JPY (¥) - Japanese Yen" },
];

const INITIAL_FORM_STATE = {
  priceAmount: "",
  currency: "INR",
  stock: "",
  attributes: [
    { key: "Size", value: "" },
    { key: "Color", value: "" },
  ],
  images: [],
};

const getFormState = (variant) => {
  if (!variant) {
    return {
      ...INITIAL_FORM_STATE,
      attributes: [...INITIAL_FORM_STATE.attributes],
    };
  }

  const attributes = Array.isArray(variant.attributes)
    ? variant.attributes
    : Object.entries(variant.attributes || {}).map(([key, value]) => ({ key, value }));

  return {
    priceAmount: String(variant.price?.amount ?? ""),
    currency: variant.price?.currency || "INR",
    stock: String(variant.stock ?? ""),
    attributes: attributes.length ? attributes : [{ key: "", value: "" }],
    images: Array.isArray(variant.images) ? variant.images : [],
  };
};

const VariantForm = ({
  onSubmit,
  isSubmitting = false,
  onCancel,
  initialVariant = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState(() => getFormState(initialVariant));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const handleAttributesChange = (newAttributes) => {
    setFormData((prev) => ({
      ...prev,
      attributes: newAttributes,
    }));

    if (errors.attributes) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.attributes;
        return next;
      });
    }
  };

  const handleImagesChange = (newImages) => {
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));

    if (errors.images && newImages.length > 0) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.images;
        return next;
      });
    }
  };

  const validateField = (field) => {
    const errs = { ...errors };

    if (field === "priceAmount") {
      if (!formData.priceAmount || String(formData.priceAmount).trim() === "") {
        errs.priceAmount = "Price amount is required";
      } else if (isNaN(Number(formData.priceAmount)) || Number(formData.priceAmount) <= 0) {
        errs.priceAmount = "Price must be a valid number greater than 0";
      } else {
        delete errs.priceAmount;
      }
    }

    if (field === "currency") {
      if (!formData.currency) {
        errs.currency = "Please select a currency";
      } else {
        delete errs.currency;
      }
    }

    if (field === "stock") {
      if (formData.stock === "" || formData.stock === null || formData.stock === undefined) {
        errs.stock = "Stock quantity is required";
      } else if (
        isNaN(Number(formData.stock)) ||
        !Number.isInteger(Number(formData.stock)) ||
        Number(formData.stock) < 0
      ) {
        errs.stock = "Stock must be a non-negative integer (0 or more)";
      } else {
        delete errs.stock;
      }
    }

    if (field === "attributes") {
      const validPairs = formData.attributes.filter(
        (a) => a.key.trim() !== "" && a.value.trim() !== ""
      );
      if (validPairs.length === 0) {
        errs.attributes = "Please add at least one valid key-value attribute";
      } else {
        delete errs.attributes;
      }
    }

    if (field === "images") {
      if (formData.images.length === 0) {
        errs.images = "At least one variant image is required";
      } else {
        delete errs.images;
      }
    }

    setErrors(errs);
    return !errs[field];
  };

  const validateAll = () => {
    const errs = {};

    // 1. Price
    if (!formData.priceAmount || String(formData.priceAmount).trim() === "") {
      errs.priceAmount = "Price amount is required";
    } else if (isNaN(Number(formData.priceAmount)) || Number(formData.priceAmount) <= 0) {
      errs.priceAmount = "Price must be a valid number greater than 0";
    }

    // 2. Currency
    if (!formData.currency) {
      errs.currency = "Please select a currency";
    }

    // 3. Stock
    if (formData.stock === "" || formData.stock === null || formData.stock === undefined) {
      errs.stock = "Stock quantity is required";
    } else if (
      isNaN(Number(formData.stock)) ||
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      errs.stock = "Stock must be a non-negative integer";
    }

    // 4. Attributes
    const validPairs = formData.attributes.filter(
      (a) => a.key.trim() !== "" && a.value.trim() !== ""
    );
    if (validPairs.length === 0) {
      errs.attributes = "Please provide at least one complete attribute (Key & Value)";
    }

    // 5. Images
    if (formData.images.length === 0) {
      errs.images = "Please upload at least one variant image";
    }

    setErrors(errs);
    setTouched({
      priceAmount: true,
      currency: true,
      stock: true,
      attributes: true,
      images: true,
    });

    return Object.keys(errs).length === 0;
  };

  const handleResetForm = () => {
    setFormData(getFormState(null));
    setErrors({});
    setTouched({});
    if (onCancel) {
      onCancel();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    // Filter valid attribute pairs into key-value map
    const attributesMap = {};
    formData.attributes.forEach((attr) => {
      const key = attr.key.trim();
      const val = attr.value.trim();
      if (key && val) {
        attributesMap[key.toLowerCase()] = val;
      }
    });

    const payload = {
      price: {
        amount: Number(formData.priceAmount),
        currency: formData.currency,
      },
      stock: Number(formData.stock),
      attributes: attributesMap,
      rawAttributesList: formData.attributes.filter((a) => a.key.trim() && a.value.trim()),
      images: formData.images,
    };

    const success = await onSubmit(payload);

    if (success) {
      // Clear form on successful submission
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setTouched({});
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E5E5] p-5 sm:p-7 space-y-6">
      {/* Form Card Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold">
            Variant Configuration
          </span>
        </div>
        <h2 className="text-base font-medium text-[#171717] tracking-tight">
          {isEditing ? "Edit Variant" : "Add New Variant"}
        </h2>
        <p className="text-xs text-[#737373] mt-1 leading-relaxed">
          Set up pricing, stock availability, dynamic specification attributes, and imagery for this variant.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Price & Currency Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.16em] font-medium text-[#737373]">
              Pricing & Currency <span className="text-[#D4AF37]">*</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Price Amount */}
            <div className="sm:col-span-7 space-y-1">
              <label
                htmlFor="variant-price"
                className="block text-[10px] uppercase tracking-[0.14em] text-[#737373]"
              >
                Price Amount
              </label>
              <div className="relative">
                <input
                  id="variant-price"
                  type="number"
                  name="priceAmount"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 799"
                  value={formData.priceAmount}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("priceAmount")}
                  className={`w-full h-11 px-3.5 bg-[#FFFFFF] border text-xs text-[#171717] placeholder:text-[#737373]/50 focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/10 transition-colors ${
                    (touched.priceAmount || errors.priceAmount) && errors.priceAmount
                      ? "border-red-400 focus:border-red-500"
                      : "border-[#E5E5E5]"
                  }`}
                />
              </div>
              {errors.priceAmount && (
                <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                  <span className="font-bold">•</span> {errors.priceAmount}
                </p>
              )}
            </div>

            {/* Currency Dropdown */}
            <div className="sm:col-span-5 space-y-1">
              <label
                htmlFor="variant-currency"
                className="block text-[10px] uppercase tracking-[0.14em] text-[#737373]"
              >
                Currency
              </label>
              <div className="relative">
                <select
                  id="variant-currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("currency")}
                  className={`w-full h-11 pl-3.5 pr-9 bg-[#FFFFFF] border text-xs text-[#171717] appearance-none cursor-pointer focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/10 transition-colors ${
                    (touched.currency || errors.currency) && errors.currency
                      ? "border-red-400 focus:border-red-500"
                      : "border-[#E5E5E5]"
                  }`}
                >
                  {CURRENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#737373]">
                  <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                </div>
              </div>
              {errors.currency && (
                <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                  <span className="font-bold">•</span> {errors.currency}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Inventory Stock Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="variant-stock"
              className="block text-[10px] uppercase tracking-[0.16em] font-medium text-[#737373]">
              Inventory Stock <span className="text-[#D4AF37]">*</span>
            </label>
            <span className="text-[10px] text-[#737373]/70">Units in Atelier</span>
          </div>
          <input
            id="variant-stock"
            type="number"
            name="stock"
            min="0"
            step="1"
            placeholder="e.g. 20"
            value={formData.stock}
            onChange={handleInputChange}
            onBlur={() => handleBlur("stock")}
            className={`w-full h-11 px-3.5 bg-[#FFFFFF] border text-xs text-[#171717] placeholder:text-[#737373]/50 focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/10 transition-colors ${
              (touched.stock || errors.stock) && errors.stock
                ? "border-red-400 focus:border-red-500"
                : "border-[#E5E5E5]"
            }`}
          />
          {errors.stock && (
            <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
              <span className="font-bold">•</span> {errors.stock}
            </p>
          )}
        </div>

        {/* Dynamic Attributes Section */}
        <div className="pt-2 border-t border-[#E5E5E5]/60">
          <AttributeFields
            attributes={formData.attributes}
            onChange={handleAttributesChange}
            error={touched.attributes || errors.attributes ? errors.attributes : null}
          />
        </div>

        {/* Variant Images Section */}
        <div className="pt-2 border-t border-[#E5E5E5]/60">
          <VariantImageUpload
            images={formData.images}
            onChange={handleImagesChange}
            error={touched.images || errors.images ? errors.images : null}
            maxImages={5}
            maxFileSizeMb={10}
          />
        </div>

        {/* Form Actions Footer */}
        <div className="pt-4 border-t border-[#E5E5E5]/60 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleResetForm}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 h-11 border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#FAFAF9] text-[#737373] hover:text-[#171717] text-xs font-medium tracking-[0.16em] uppercase transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-7 h-11 bg-[#171717] hover:bg-[#262626] active:bg-[#000000] text-[#FFFFFF] text-xs font-medium tracking-[0.18em] uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" strokeWidth={2} />
                <span>{isEditing ? "Saving Variant..." : "Adding Variant..."}</span>
              </>
            ) : (
              <>
                {!isEditing && (
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={2} />
                )}
                <span>{isEditing ? "Save Variant" : "Add Variant"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VariantForm;
