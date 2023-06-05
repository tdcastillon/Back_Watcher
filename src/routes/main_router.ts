import express, {Response, Request} from "express";
import UserRouter from "./user_routes";

const app = express.Router();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.use("/users", UserRouter);

export default app;