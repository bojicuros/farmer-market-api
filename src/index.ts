import cors from "cors";
import { config } from "./utils/config";
import express, { Response } from "express";
import userRouter from "./routers/user.router";
import marketRouter from "./routers/market.router";
import authRouter from "./routers/auth.router";
import priceRouter from "./routers/price.router";

if (!config.port) {
  process.exit(1);
}

const PORT: number = parseInt(config.port as string, 10);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/markets", marketRouter);
app.use("/api/auth", authRouter);
app.use("/api/prices", priceRouter);

app.get("/api/healthchecker", (_, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to market price check app",
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
