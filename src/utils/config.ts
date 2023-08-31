import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT,
  tokenKey: process.env.TOKEN_KEY,
  email: process.env.GOOGLE_EMAIL,
  password: process.env.GOOGLE_PASSWORD,
};
