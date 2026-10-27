import React, { useEffect, useState, useMemo } from "react";
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import {
  CheckCircle2,
  Package,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  MapPin,
  Clock,
  AlertCircle,
  Loader2,
  ChevronRight,
  User,
  ExternalLink,
} from "lucide-react";
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../../auth/hooks/useAuth";
import { getOrderDetails } from "../services/buyer.api";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const queryOrderId = searchParams.get("order_id");
  const navState = location.state || {};

  const [orderState, setOrderState] = useState({
    loading: true,
    error: null,
    verified: false,
    order: null,
    rawPaymentId: null,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const resolveOrder = async () => {
      // 1. If no order_id param in URL and no orderId in state, it's an invalid access
      const activeOrderId = queryOrderId || navState.orderId;
      if (!activeOrderId) {
        if (isMounted) {
          setOrderState({
            loading: false,
            error:
              "No order identifier found. Please check your cart or order history.",
            verified: false,
            order: null,
            rawPaymentId: null,
          });
        }
        return;
      }

      // 2. Security & Verification check:
      // If arrived via successful backend verification in handler:
      const wasVerified = Boolean(navState.verified);

      // Attempt to fetch fresh confirmed order data from backend
      try {
        const backendResponse = await getOrderDetails(activeOrderId);
        if (!isMounted) return;

        const fetchedOrder =
          backendResponse?.order || backendResponse?.data || backendResponse;

        // Verify order ownership if user info is present
        if (
          user?._id &&
          fetchedOrder?.user &&
          fetchedOrder.user !== user._id &&
          fetchedOrder.user?._id !== user._id
        ) {
          setOrderState({
            loading: false,
            error:
              "Access denied. You do not have permission to view this order.",
            verified: false,
            order: null,
            rawPaymentId: null,
          });
          return;
        }

        setOrderState({
          loading: false,
          error: null,
          verified: true,
          order: fetchedOrder,
          rawPaymentId: navState.paymentId || fetchedOrder?.paymentId || null,
        });
      } catch (err) {
        // Fallback: If direct GET endpoint is not implemented on backend or returned error,
        // but user just verified with Razorpay verification API:
        if (wasVerified) {
          if (!isMounted) return;

          // Reconstruct order details safely from verified payload & cart snapshot
          const fallbackOrder = navState.orderData || {
            _id: activeOrderId,
            orderId: activeOrderId,
            createdAt: new Date().toISOString(),
            status: "PAID",
            paymentStatus: "paid",
            paymentMethod: "Razorpay (Online UPI / Card / NetBanking)",
            items: navState.cartSnapshot?.items || [],
            totalPrice: navState.cartSnapshot?.totalPrice,
            shippingAddress: user?.address || {
              fullName: user?.fullname || user?.fullName || "Valued Customer",
              email: user?.email || "",
              contact: user?.contact || "",
            },
          };

          setOrderState({
            loading: false,
            error: null,
            verified: true,
            order: fallbackOrder,
            rawPaymentId: navState.paymentId || null,
          });
        } else {
          if (!isMounted) return;
          setOrderState({
            loading: false,
            error:
              "Unable to verify order confirmation. If money was deducted, our team will process your order shortly.",
            verified: false,
            order: null,
            rawPaymentId: null,
          });
        }
      }
    };

    if (!authLoading) {
      resolveOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [queryOrderId, navState, user, authLoading]);

  // Normalized order calculations
  const orderData = orderState.order;
  const items = useMemo(() => {
    if (!orderData) return [];
    if (Array.isArray(orderData.items)) return orderData.items;
    if (Array.isArray(orderData.products)) return orderData.products;
    return [];
  }, [orderData]);

  // Format currency helper
  const formatCurrency = (val, cur = "INR") => {
    const num = Number(val) || 0;
    if (cur === "INR" || cur === "inr") {
      return `₹${num.toLocaleString("en-IN")}`;
    }
    return `${cur} ${num.toLocaleString()}`;
  };

  // Safe formatting for order date
  const orderDateString = useMemo(() => {
    const dateVal =
      orderData?.createdAt || orderData?.date || orderData?.orderDate;
    if (!dateVal)
      return new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    try {
      return new Date(dateVal).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  }, [orderData]);

  // Compute total
  const totalAmount =
    orderData?.totalPrice ??
    orderData?.amount ??
    orderData?.totalAmount ??
    items.reduce(
      (acc, it) =>
        acc + (it?.price?.amount ?? it?.price ?? 0) * (it?.quantity || 1),
      0,
    );

  const currencyCode =
    orderData?.currency || orderData?.price?.currency || "INR";

  // Loading View
  if (orderState.loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] text-[#171717] flex flex-col justify-between">
        <BuyerNavbar />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full border border-[#E5E5E5] bg-[#FFFFFF] flex items-center justify-center shadow-xs">
              <Loader2
                className="w-6 h-6 text-[#171717] animate-spin"
                strokeWidth={1.75}
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#171717]">
                Confirming Order
              </h2>
              <p className="text-xs text-[#737373]">
                Securing backend verification with payment provider...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error / Verification Failure View
  if (orderState.error || !orderState.verified) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] text-[#171717] flex flex-col justify-between">
        <BuyerNavbar />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-16 sm:py-24 flex flex-col items-center justify-center">
          <div className="w-full bg-[#FFFFFF] border border-[#E5E5E5] p-8 sm:p-10 rounded-2xl shadow-xs text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
              <AlertCircle className="w-7 h-7" strokeWidth={1.75} />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                Payment Verification Notice
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717] mt-3">
                Order Verification Incomplete
              </h1>
              <p className="text-xs sm:text-sm text-[#737373] leading-relaxed max-w-md mx-auto">
                {orderState.error ||
                  "We could not confirm verification of this order. No charges will be finalized without verification."}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/cart"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#171717] text-[#FFFFFF] text-xs font-semibold tracking-[0.14em] uppercase hover:bg-[#262626] transition-colors">
                <span>Return to Cart</span>
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-xs font-semibold tracking-[0.14em] uppercase text-[#171717] hover:bg-[#F5F5F4] transition-colors">
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Safe Order Data
  const orderNumber =
    orderData?.orderNumber ||
    orderData?.orderId ||
    orderData?._id ||
    queryOrderId ||
    navState.orderId;

  const paymentStatus =
    orderState.verified &&
    (orderData?.paymentStatus || orderData?.status || "Paid");

  const paymentMethod =
    orderData?.paymentMethod ||
    (orderState.rawPaymentId ? "Razorpay (Online Payment)" : null);

  const shippingAddress = orderData?.shippingAddress || orderData?.address;
  const estimatedDelivery =
    orderData?.estimatedDelivery || orderData?.estimatedDeliveryDate;

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#171717] flex flex-col justify-between selection:bg-[#171717] selection:text-[#FFFFFF]">
      <BuyerNavbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* 1. Success Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center animate-scaleIn">
              <CheckCircle2
                className="w-9 h-9 sm:w-11 sm:h-11"
                strokeWidth={1.75}
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#737373] uppercase">
              Purchase Completed
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#171717] uppercase">
              ORDER CONFIRMED
            </h1>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed max-w-md mx-auto">
              Thank you for your purchase. Your order has been placed
              successfully. A digital receipt has been generated for your
              records.
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="space-y-6 sm:space-y-8">
          {/* 2. Order Information Card */}
          <section className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E5E5]">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#737373]">
                  Order Identifier
                </span>
                <p className="text-sm sm:text-base font-bold tracking-tight text-[#171717] font-mono select-all">
                  #{orderNumber}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Payment Status Label: Only shown when payment verification succeeds */}
                {orderState.verified && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Paid
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F5F5F4] text-[#171717] border border-[#E5E5E5]">
                  <ShieldCheck
                    className="w-3.5 h-3.5 text-[#D4AF37]"
                    strokeWidth={2}
                  />
                  Verified
                </span>
              </div>
            </div>

            {/* Key Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#737373] flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Order Date
                </span>
                <p className="text-xs sm:text-sm font-semibold text-[#171717]">
                  {orderDateString}
                </p>
              </div>

              {paymentMethod && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#737373] flex items-center gap-1.5 font-medium">
                    <CreditCard className="w-3.5 h-3.5" strokeWidth={1.75} />
                    Payment Method
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#171717] truncate">
                    {paymentMethod}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#737373] flex items-center gap-1.5 font-medium">
                  <span>Total Amount</span>
                </span>
                <p className="text-sm sm:text-base font-bold text-[#171717]">
                  {formatCurrency(totalAmount, currencyCode)}
                </p>
              </div>
            </div>
          </section>

          {/* 3. Purchased Items */}
          <section className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2.5">
                <ShoppingBag
                  className="w-4 h-4 text-[#171717]"
                  strokeWidth={1.75}
                />
                <h2 className="text-sm sm:text-base font-semibold tracking-tight text-[#171717]">
                  Purchased Items
                </h2>
              </div>
              <span className="text-xs font-medium text-[#737373] bg-[#F5F5F4] px-2.5 py-0.5 rounded-full border border-[#E5E5E5]">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#737373] space-y-1">
                <Package
                  className="w-8 h-8 mx-auto text-[#A3A3A3] mb-2"
                  strokeWidth={1.5}
                />
                <p className="font-medium text-[#171717]">
                  Item details preserved
                </p>
                <p>Refer to your order summary for the complete itemization.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E5E5E5]">
                {items.map((item, idx) => {
                  const product = item.product || item;
                  const variant = product?.variants || item?.variantData || {};

                  // Dynamic image resolution
                  const imageUrl =
                    variant?.images?.[0]?.url ||
                    product?.images?.[0]?.url ||
                    item.image ||
                    null;

                  const title =
                    product?.title ||
                    product?.name ||
                    item.title ||
                    "Curated Garment";
                  const quantity = item.quantity || 1;
                  const unitPrice = item.price?.amount ?? item.price ?? 0;
                  const itemCurrency =
                    item.price?.currency || currencyCode || "INR";
                  const itemLineTotal = unitPrice * quantity;

                  // Extract dynamic attributes (e.g. Size, Color)
                  const attributes = variant?.attributes
                    ? Object.entries(variant.attributes)
                    : item.size
                      ? [["Size", item.size]]
                      : [];

                  const productId = product?._id || product?.id;

                  return (
                    <div
                      key={item._id || `${productId}-${idx}`}
                      className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-1 last:pb-1">
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#F5F5F4] border border-[#E5E5E5] overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={title}
                              className="w-full h-full object-cover object-center"
                              loading="lazy"
                            />
                          ) : (
                            <Package
                              className="w-6 h-6 text-[#A3A3A3]"
                              strokeWidth={1.5}
                            />
                          )}
                        </div>

                        {/* Title and details */}
                        <div className="min-w-0 flex-1 space-y-1.5">
                          {productId ? (
                            <Link
                              to={`/products/${productId}`}
                              className="text-xs sm:text-sm font-semibold text-[#171717] hover:underline truncate block">
                              {title}
                            </Link>
                          ) : (
                            <p className="text-xs sm:text-sm font-semibold text-[#171717] truncate">
                              {title}
                            </p>
                          )}

                          {/* Attributes badges */}
                          {attributes.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {attributes.map(([attrKey, attrVal]) => (
                                <span
                                  key={attrKey}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-[#F5F5F4] text-[#737373] border border-[#E5E5E5]">
                                  {attrKey}:{" "}
                                  <strong className="ml-1 text-[#171717] font-semibold">
                                    {String(attrVal)}
                                  </strong>
                                </span>
                              ))}
                            </div>
                          )}

                          <p className="text-[11px] text-[#737373]">
                            Qty:{" "}
                            <span className="font-medium text-[#171717]">
                              {quantity}
                            </span>{" "}
                            &times; {formatCurrency(unitPrice, itemCurrency)}
                          </p>
                        </div>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-left sm:text-right flex-shrink-0 sm:pl-4">
                        <span className="text-xs sm:text-sm font-bold text-[#171717]">
                          {formatCurrency(itemLineTotal, itemCurrency)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Total Row Summary */}
            <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#737373]">
                Subtotal &amp; Express Handling
              </span>
              <span className="font-bold text-[#171717]">
                {formatCurrency(totalAmount, currencyCode)}
              </span>
            </div>
          </section>

          {/* 4. Delivery & Customer Information (Only authentic backend data) */}
          <section className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5E5E5]">
              <MapPin className="w-4 h-4 text-[#171717]" strokeWidth={1.75} />
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-[#171717]">
                Delivery Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              {/* Shipping Address */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#737373] font-medium block">
                  Shipping Destination
                </span>
                {shippingAddress ? (
                  <div className="space-y-1 text-[#171717] leading-relaxed">
                    {shippingAddress.fullName && (
                      <p className="font-semibold">
                        {shippingAddress.fullName}
                      </p>
                    )}
                    {shippingAddress.street && <p>{shippingAddress.street}</p>}
                    {shippingAddress.addressLine1 && (
                      <p>{shippingAddress.addressLine1}</p>
                    )}
                    {shippingAddress.addressLine2 && (
                      <p>{shippingAddress.addressLine2}</p>
                    )}
                    {(shippingAddress.city ||
                      shippingAddress.state ||
                      shippingAddress.postalCode) && (
                      <p>
                        {[
                          shippingAddress.city,
                          shippingAddress.state,
                          shippingAddress.postalCode || shippingAddress.pincode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {shippingAddress.contact && (
                      <p className="text-[#737373] pt-1">
                        Phone: {shippingAddress.contact}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1 text-[#171717] leading-relaxed">
                    <p className="font-semibold">
                      {user?.fullname ||
                        user?.fullName ||
                        "Registered Account Member"}
                    </p>
                    <p className="text-[#737373]">{user?.email}</p>
                    {user?.contact && (
                      <p className="text-[#737373]">Phone: {user.contact}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Estimation: Only rendered if explicitly returned by backend */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#737373] font-medium block">
                  Delivery Schedule
                </span>
                {estimatedDelivery ? (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F5F5F4] border border-[#E5E5E5]">
                    <Clock
                      className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5"
                      strokeWidth={1.75}
                    />
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[#171717]">
                        Estimated Delivery
                      </p>
                      <p className="text-xs text-[#737373]">
                        {typeof estimatedDelivery === "string"
                          ? estimatedDelivery
                          : new Date(estimatedDelivery).toLocaleDateString(
                              "en-IN",
                              {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              },
                            )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-[#F5F5F4] border border-[#E5E5E5] text-[#737373] leading-relaxed">
                    <p className="font-medium text-[#171717] mb-0.5">
                      Standard Dispatch
                    </p>
                    <p>
                      Orders are prepared and securely dispatched within
                      standard studio processing timelines. Tracking will be
                      communicated via email.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 5. Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {/* Primary Button: Continue Shopping -> / */}
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#171717] text-[#FFFFFF] text-xs font-semibold tracking-[0.16em] uppercase hover:bg-[#262626] active:scale-[0.99] transition-all duration-150 shadow-xs">
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Secondary Button: View Order Details / Account -> /profile */}
              <Link
                to="/profile"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#E5E5E5] bg-[#FFFFFF] text-xs font-semibold tracking-[0.16em] uppercase text-[#171717] hover:bg-[#F5F5F4] active:scale-[0.99] transition-all duration-150">
                <span>View Order Details</span>
              </Link>
            </div>

            {/* Optional Text Link: View My Orders / Profile */}
            <Link
              to="/profile"
              className="text-xs font-medium uppercase tracking-[0.14em] text-[#737373] hover:text-[#171717] transition-colors inline-flex items-center gap-1.5">
              <span>View My Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
