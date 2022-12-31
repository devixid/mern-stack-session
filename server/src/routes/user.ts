import { Router } from "express";
import { check } from "express-validator";

import * as UserController from "../controllers/user";
import { AuthMiddleware } from "../middlewares";

const router = Router();

router.post(
    "/register",
    check("name")
        .notEmpty()
        .withMessage("field 'name' is required!"),
    check("email")
        .notEmpty()
        .withMessage("field 'email' is required!")
        .isEmail()
        .withMessage("invalid email"),
    check("password")
        .notEmpty()
        .withMessage("field 'password' is required")
        .isStrongPassword()
        .withMessage("invalid password"),
    UserController.register,
);

router.post(
    "/login",
    check("email")
        .notEmpty()
        .withMessage("field 'email' is required!")
        .isEmail()
        .withMessage("invalid email"),
    check("password")
        .notEmpty()
        .withMessage("field 'password' is required")
        .isStrongPassword()
        .withMessage("invalid password"),
    UserController.login,
);

router.get(
    "/me",
    AuthMiddleware,
    UserController.getUserInfo,
);

export default router;
