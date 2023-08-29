import { Request, Response } from "express";
import {
  getUser,
  createUser,
  getUserByRefreshToken,
  createUserSession,
  createConfirmationToken,
  getConfirmationToken,
  wrongConfirmationToken,
  rightConfirmationToken,
  deleteConfirmationToken,
  updatePassword,
} from "../services/auth.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {
  ConfirmationTokenDto,
  EmailDto,
  LoginInfoDto,
  PasswordTokenDto,
  RefreshTokenDto,
  RegisterInfoDto,
} from "../validation/auth.schema";
import { randomBytes } from "crypto";
import { marketEmail, sendEmail } from "../services/mail.service";

dotenv.config();

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginInfoDto;
  try {
    const user = await getUser(email);

    if (user) {
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (passwordsMatch) {
        const roles = user.UserRole.map((userRole) => ({
          role: userRole.role.name,
          isApproved: userRole.is_approved,
        }));

        const vendorRole = roles.find((role) => role.role === "Vendor");

        const isVendorApproved = vendorRole ? vendorRole.isApproved : true;

        const accessToken = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            roles: roles,
            is_approved: isVendorApproved,
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

    const newUser = await createUser(body);

    const secretToken = generateConfirmationToken();

    createConfirmationToken(secretToken, newUser.id);

    sendConfirmationEmail(newUser.email, secretToken);

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      phone_number: newUser.phone_number,
    });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
}

function generateConfirmationToken(): string {
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  return token;
}

function sendConfirmationEmail(email: string, secretToken: string) {
  const emailOptions = {
    from: marketEmail,
    to: email,
    subject: "Email Confirmation",
    text: `Here is your confirmation token: ${secretToken}`,
  };

  sendEmail(emailOptions);
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

export async function confirmEmailToken(req: Request, res: Response) {
  const { token, user_id } = req.body as ConfirmationTokenDto;
  try {
    const confirmationToken = await getConfirmationToken(user_id);
    const isTokenValid = await bcrypt.compare(token, confirmationToken.token);

    if (isTokenValid) {
      rightConfirmationToken(user_id);
      return res.status(200).json({ message: "Successfully confirmed" });
    }

    const wrongToken = wrongConfirmationToken(user_id);
    if ((await wrongToken).failed_attempts === 3)
      return res.status(401).json({
        error: "Number of failed attempts is 3. Your profile is now deleted",
      });
    res.status(401).json({ error: "Invalid confirmation token" });
  } catch (error) {
    res.status(500).json({ error: "Error confirmation token" });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  const email = (req.query as EmailDto).email;

  try {
    const user = await getUser(email);

    const secretToken = generateConfirmationToken();

    createConfirmationToken(secretToken, user.id);

    sendConfirmationEmail(user.email, secretToken);

    res.status(201).json({ message: "Email sent" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
}

export async function confirmPasswordToken(req: Request, res: Response) {
  const { token, email, password } = req.body as PasswordTokenDto;
  try {
    const user = await getUser(email);
    const confirmationToken = await getConfirmationToken(user.id);
    const isTokenValid = await bcrypt.compare(token, confirmationToken.token);

    if (isTokenValid) {
      await deleteConfirmationToken(confirmationToken.id);
      const user = await getUser(email);
      await updatePassword(user.id, password);
      return res.status(201).json({ message: "Successfully changed password" });
    }

    res.status(401).json({ error: "Invalid confirmation token" });
  } catch (error) {
    res.status(500).json({ error: "Error confirmation token" });
  }
}
