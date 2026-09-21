import { body, validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

export const addVariantValidator = [
  body("price")
    .notEmpty()
    .withMessage("price are required")
    .isJSON()
    .withMessage("price must be valid JSON"),
  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("attributes")
    .notEmpty()
    .withMessage("Attributes are required")
    .isJSON()
    .withMessage("Attributes must be valid JSON"),
  validate,
];
