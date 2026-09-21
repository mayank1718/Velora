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

export const registerValidation = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Fullname is required")
    .isLength({ min: 3 })
    .withMessage("Fullname must be at least 3 characters"),

  body("contact")
    .trim()
    .notEmpty()
    .withMessage("Contact is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Contact must be exactly 10 digits"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("isSeller").isBoolean().withMessage("isSeller must be boolean"),
  validate,
];
