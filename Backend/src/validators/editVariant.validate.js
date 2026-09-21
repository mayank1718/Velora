import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
    });
  }
  next();
};

export const editVariantValidator = [
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isJSON()
    .withMessage("Price must be valid JSON"),

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
