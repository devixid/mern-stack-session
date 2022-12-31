import { Request, Response, Router } from "express";
import UserRoute from "./user";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
    res.sendResponse("success", 200, {
        message: "Welcome to the API",
    });
});

router.use("/users", UserRoute);

export default router;
