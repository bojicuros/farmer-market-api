import * as dotenv from "dotenv";
import cors from "cors";
import express, { Response } from "express";
import userRouter from "./routers/user.router";
import marketRouter from "./routers/market.router";
import authRouter from "./routers/auth.router";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/markets", marketRouter);
app.use("/api/auth", authRouter);

app.get("/api/healthchecker", (_, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to NodeJs with Prisma and PostgreSQL",
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
