import { body } from "express-validator";

const signupValidation = [
    body("fullName")
        .notEmpty()
        .withMessage("Full name is required")
        .matches(/^[a-zA-Z\s]+$/) // will match only alphabetic characters and spaces
        .withMessage("Fullname can't contain numerics")
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters long"),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Plz provide a valid Email'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6, max: 15 })
        .withMessage('Password must 6 to 15 character long')
];

const loginValidation = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Plz provide a valid Email'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6, max: 15 })
        .withMessage('Password must 6 to 15 character long')
];

export { signupValidation, loginValidation };