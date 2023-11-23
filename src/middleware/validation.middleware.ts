import { Request, Response, NextFunction, RequestHandler } from "express";
import { ObjectSchema, ValidationError } from "yup";

export const validate = (schema: ObjectSchema<any>): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.cast(
        {
          body: req.body,
          query: req.query,
          params: req.params,
        },
        { stripUnknown: true }
      );

      schema.validateSync(data);

      req.body = data.body;
      req.query = data.query;

      schema.validateSync(data, { abortEarly: false });
      return next();
    } catch (err) {
      const error = err as ValidationError;
      return res.status(400).json({
        name: error.name,
        message: error.message,
        errors: error.errors,
        value: error.value,
        path: error.path,
      });
    }
  };
};
