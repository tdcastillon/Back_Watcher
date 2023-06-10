import express, {Response, Request} from "express";
import UserRouter from "./user_routes";
import MovieNotesRouter from "./movie_notes_routes";

const app = express.Router();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.use("/users", UserRouter);
app.use("/marks", MovieNotesRouter);

export default app;