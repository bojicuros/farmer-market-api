import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

export const validate = (schema: yup.ObjectSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.method === "GET" ? req.query : req.body;
      await schema.validate(data, { abortEarly: false });
      next();
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }
  };
};
