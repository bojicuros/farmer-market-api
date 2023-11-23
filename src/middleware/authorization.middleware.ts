import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getById } from "../services/user.service";
import { getUser } from "../services/auth.service";

export const validRoles = ["Admin", "Vendor"];

export const isVendorApprovedUser = async (userId: string) => {
  const user = await getById(userId);
  const userInfo = await getUser(user.email);
  return userInfo.UserRole.every((role) => role.is_approved === true);
};

export const authorize = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const rolesAreValid = roles.every((role) => validRoles.includes(role));

    if (!rolesAreValid)
      return res.status(400).json({ message: "Invalid roles provided" });

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Missing token" });

    try {
      const decodedToken: any = jwt.verify(token, process.env.TOKEN_KEY);
      const userRoles = decodedToken.roles as string[];

      const hasRequiredRole = userRoles.some((userRole: string) =>
        roles.includes(userRole)
      );

      if (!hasRequiredRole)
        return res.status(403).json({ message: "Unauthorized" });

      const isVendorApproved = await isVendorApprovedUser(decodedToken.userId);

      if (!isVendorApproved)
        return res.status(403).json({ message: "Vendor not approved yet" });

      return next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
