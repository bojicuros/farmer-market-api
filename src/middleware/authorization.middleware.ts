import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const validRoles = ["Admin", "Vendor"];

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const rolesAreValid = roles.every((role) => validRoles.includes(role));

    if (!rolesAreValid) {
      return res.status(400).json({ message: "Invalid roles provided" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    try {
      const decodedToken: any = jwt.verify(token, process.env.TOKEN_KEY);
      const userRoles = decodedToken.roles;

      const hasRequiredRole = userRoles.some((role: string) =>
        roles.includes(role)
      );

      if (hasRequiredRole) {
        next();
      } else {
        res.status(403).json({ message: "Unauthorized" });
      }
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
