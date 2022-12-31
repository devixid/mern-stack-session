import { createHmac } from "crypto";
import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/user";
import { ApiError } from "../utils";

type UserRegisterRequestBodyTypes = {
    name: string;
    email: string;
    password: string;
}

type UserLoginRequestBodyTypes = Pick<UserRegisterRequestBodyTypes, "email" | "password">

export const register = async (req: Request<any, any, UserRegisterRequestBodyTypes>, res: Response) => {
    const errors = validationResult(req);
    const { name, email, password } = req.body;

    if (!errors.isEmpty()) {
        res.sendResponse("error", 401, {
            message: "Validation error",
            data: errors.array(),
        });
    }

    try {
        const user = await UserModel.findOne({
            "user.email": email,
        });

        if (user) {
            throw new ApiError(409, "User already exists");
        }

        const newUser = new UserModel({
            user: {
                email,
                name,
                password,
            },
        });
        const save = await newUser.save();

        if (!save) {
            throw new ApiError(500, "Error when saving new user");
        }

        return res.sendResponse("success", 201, {
            message: "Registration successfully!",
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            return res.sendResponse("error", error.statusCode, error.getMessage());
        }

        return res.sendResponse("error", 500, {
            message: error?.message || "Internal server error",
        });
    }
};

export const login = async (req: Request<any, any, UserLoginRequestBodyTypes>, res: Response) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.sendResponse("error", 401, {
            message: "Validation error",
            data: errors.array(),
        });
    }

    try {
        const user = await UserModel.findOne({
            "user.email": email,
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const hashedPassword = createHmac("sha512", process.env.SECRET_KEY as string).update(password).digest("hex");

        if (user.user.password !== hashedPassword) {
            throw new ApiError(400, "Wrong password");
        }

        const token = jwt.sign({
            id: user._id,
            email: user.user.email,
        }, process.env.SECRET_KEY as string, {
            issuer: "JSON Web Token",
        });

        const refreshToken = jwt.sign({
            id: user._id,
        }, process.env.SECRET_KEY as string, {
            issuer: "JSON Web Token",
        });

        return res.sendResponse("success", 200, {
            message: "Login successfully!",
            data: {
                accessToken: token,
                refreshToken,
            },
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            return res.sendResponse("error", error.statusCode, error.getMessage());
        }

        return res.sendResponse("error", 500, {
            message: error?.message || "Internal server error",
        });
    }
};

export const getUserInfo = async (req: Request, res: Response) => {
    const { id } = req;

    if (!id) {
        return res.sendResponse("error", 401, {
            message: "Unauthorized",
        });
    }

    try {
        const user = await UserModel.findById(id);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const userData = {
            name: user.user.name,
            email: user.user.email,
        };

        return res.sendResponse<typeof userData>("success", 200, {
            message: "Success",
            data: userData,
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            return res.sendResponse("error", error.statusCode, error.getMessage());
        }

        return res.sendResponse("error", 500, {
            message: error?.message || "Internal server error",
        });
    }
};
