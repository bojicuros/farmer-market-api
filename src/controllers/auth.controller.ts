import { Request, Response } from "express";
import {
  getUser,
  createUser,
  getUserByRefreshToken,
  createUserSession,
} from "../services/auth.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {
  LoginInfoDto,
  RefreshTokenDto,
  RegisterInfoDto,
} from "../validation/auth.schema";
import { randomBytes } from "crypto";

dotenv.config();

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginInfoDto;
  try {
    const user = await getUser(email);

    if (user) {
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (passwordsMatch) {
        const roles = user.UserRole.map((userRole) => userRole.role.name);

        const accessToken = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            roles: roles,
          },
          process.env.TOKEN_KEY,
          {
            expiresIn: "1h",
          }
        );

        const refreshToken = randomBytes(64).toString("base64");

        await createUserSession(user, refreshToken);

        res
          .status(200)
          .json({ accessToken: accessToken, refreshToken: refreshToken });
      } else {
        res.status(401).json({ error: "Passwords do not match" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
}

export async function register(req: Request, res: Response) {
  const body = req.body as RegisterInfoDto;

  try {
    const existingUser = await getUser(body.email);

    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await createUser({
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
      password: hashedPassword,
      phone_number: body.phone_number,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
}

export async function refreshAccessToken(req: Request, res: Response) {
  const { refreshToken } = req.body as RefreshTokenDto;
  try {
    const user = await getUserByRefreshToken(refreshToken);

    if (user) {
      const accessToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          roles: user.UserRole.map((userRole) => userRole.role.name),
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ accessToken });
    } else {
      res.status(401).json({ error: "Invalid refresh token" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error refreshing token" });
  }
}
