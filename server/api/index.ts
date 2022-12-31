/// <reference types="../express-env" />

import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import path from "path";

import connectDB from "../src/lib/mongodb";
import { SendResponseMiddleware } from "../src/middlewares";
import routes from "../src/routes";

dotenv.config({
    path: path.resolve(`${process.cwd()}/config`, process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"),
});

const app = express();
const server = http.createServer(app);
const corsOptions: CorsOptions = {
    origin: "*",
};

connectDB().then(() => {
    console.log("DB Connected!");
});

/* Express Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(SendResponseMiddleware);

/* API Route */
app.use("/api/v1", routes);

/* Optional route */
app.use("*", (_req: Request, res: Response) => {
    res.sendResponse("error", 404, {
        message: "route not found",
    });
});

export default server;
