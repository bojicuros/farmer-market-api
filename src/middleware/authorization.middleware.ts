import { Request, Response, NextFunction } from "express";

const validRoles = ["ADMIN", "VENDOR"];

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const rolesAreValid = roles.every((role) => validRoles.includes(role));

    if (!rolesAreValid) {
      return res.status(400).json({ message: "Invalid roles provided" });
    }

    // You can implement your own logic to check if the user has the required role
    // For example, you can get the user role from the authenticated user object
    const userRole = "ADMIN"; // Replace this with your actual user role logic

    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  };
};
