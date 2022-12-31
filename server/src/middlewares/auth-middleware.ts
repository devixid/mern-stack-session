import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { ApiError } from "../utils";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] || null;

        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        const data = jwt.verify(token, process.env.SECRET_KEY as string) as UserSession;

        req.id = data.id;

        next();
    } catch (error: any) {
        console.log(error);

        if (error instanceof ApiError) {
            res.sendResponse("error", error.statusCode, error.getMessage());
            return;
        }

        res.sendResponse("error", 500, {
            message: "Internal server error",
        });
    }
};
