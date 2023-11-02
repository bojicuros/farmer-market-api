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
import {
  ConfirmationTokenDto,
  EmailDto,
  LoginInfoDto,
  PasswordTokenDto,
  RefreshTokenDto,
  RegisterInfoDto,
  ResetTokenDto,
} from "../validation/auth.schema";
import { randomBytes } from "crypto";
import { sendEmail } from "../services/mail.service";
import { config } from "../utils/config";

export const MAX_FAILED_ATTEMPTS_EMAIL = 3;

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginInfoDto;
  try {
    const user = await getUser(email);

    if (user) {
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (passwordsMatch) {
        const roleNames = user.UserRole.map((userRole) => userRole.role.name);

        const accessToken = jwt.sign(
          {
            userId: user.id,
            roles: roleNames,
          },
          config.tokenKey,
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
        res
          .status(401)
          .json({ error: "Unauthorized", message: "Passwords do not match" });
      }
    } else {
      res.status(404).json({ error: "Not Found", message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: "Error fetching user" });
  }
}

export async function register(req: Request, res: Response) {
  const body = req.body as RegisterInfoDto;

  try {
    const existingUser = await getUser(body.email);

    if (existingUser) {
      res
        .status(409)
        .json({ error: "Conflict", message: "User already exists" });
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
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error registering user",
    });
  }
}

export async function requireConfirmationToken(req: Request, res: Response) {
  const email = (req.query as EmailDto).email;
  try {
    const user = await getUser(email);

    if (user) {
      const secretToken = generateConfirmationToken();

      createConfirmationToken(secretToken, user.id);

      sendConfirmationEmail(user.email, secretToken);

      res.status(200).json({ message: "Confirmation token sent" });
    } else {
      res.status(404).json({
        error: "Not Found",
        message: "User not found. Cannot send confirmation token.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error sending confirmation token",
    });
  }
}

function generateConfirmationToken(): string {
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  return token;
}

function sendConfirmationEmail(email: string, secretToken: string) {
  const emailOptions = {
    from: config.email,
    to: email,
    subject: "Email Confirmation",
    text: `Here is your confirmation token: ${secretToken}`,
  };

  sendEmail(emailOptions);
}

export async function refreshAccessToken(req: Request, res: Response) {
  const { refreshToken } = req.body as RefreshTokenDto;
  try {
    const session = await getUserByRefreshToken(refreshToken);

    const user = session.user;

    if (user) {
      const roleNames = user.UserRole.map((userRole) => userRole.role.name);

      const accessToken = jwt.sign(
        {
          userId: user.id,
          roles: roleNames,
        },
        config.tokenKey,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ accessToken });
    } else {
      res
        .status(401)
        .json({ error: "Unauthorized", message: "Invalid refresh token" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error refreshing token",
    });
  }
}

export async function confirmEmailToken(req: Request, res: Response) {
  const { token, user_id } = req.body as ConfirmationTokenDto;
  try {
    const confirmationToken = await getConfirmationToken(user_id);
    const isTokenValid = await bcrypt.compare(token, confirmationToken.token);

    if (isTokenValid) {
      rightConfirmationToken(user_id);
      return res.status(200).json({ message: "Email successfully confirmed" });
    }

    const wrongToken = await wrongConfirmationToken(user_id);
    if (wrongToken.failed_attempts === MAX_FAILED_ATTEMPTS_EMAIL) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Max failed attempts reached. Your profile is now deleted",
      });
    }

    res
      .status(401)
      .json({ error: "Unauthorized", message: "Invalid confirmation token" });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error confirming email token",
    });
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
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error sending email for password reset",
    });
  }
}

export async function emailAvailable(req: Request, res: Response) {
  const email = (req.query as EmailDto).email;

  try {
    const user = await getUser(email);

    res.status(200).json({ available: !user });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error checking email availability",
    });
  }
}

export async function validateResetToken(req: Request, res: Response) {
  const { token, email } = req.body as ResetTokenDto;
  try {
    const user = await getUser(email);
    const confirmationToken = await getConfirmationToken(user.id);
    const isTokenValid = await bcrypt.compare(token, confirmationToken.token);

    if (isTokenValid) {
      return res.status(200).json({ message: "Successfully validated token" });
    }

    res
      .status(401)
      .json({ error: "Unauthorized", message: "Invalid confirmation token" });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error validating reset token",
    });
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
      await updatePassword(user.id, password);
      return res.status(201).json({ message: "Successfully changed password" });
    }

    res
      .status(401)
      .json({ error: "Unauthorized", message: "Invalid confirmation token" });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error changing password",
    });
  }
}
