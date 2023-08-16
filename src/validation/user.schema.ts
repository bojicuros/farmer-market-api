import { object, string } from "yup";

export const userCreateSchema = object({
  email: string().email().required(),
  first_name: string().required(),
  last_name: string().required(),
  password: string().min(8).required(),
  phone_number: string().min(8),
});

export const userUpdateSchema = object({
  id: string().uuid().required(),
  email: string().email(),
  first_name: string(),
  last_name: string(),
  password: string().min(8),
  phone_number: string().min(8),
});

export const userIdSchema = object({
  id: string().uuid().required(),
});
