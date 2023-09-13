import { InferType, boolean, object, string } from "yup";

export const userCreateSchema = object({
  body: object({
    email: string().email().required(),
    first_name: string().required(),
    last_name: string().required(),
    password: string().min(8).required(),
    phone_number: string(),
  }),
});

export const userUpdateSchema = object({
  body: object({
    id: string().uuid().required(),
    email: string().email(),
    first_name: string(),
    last_name: string(),
    password: string().min(8),
    phone_number: string(),
    is_active: boolean(),
  }),
});

export const userIdSchema = object({
  query: object({
    id: string().uuid().required(),
  }),
});

export type UserCreateDto = InferType<typeof userCreateSchema>["body"];
export type UserUpdateDto = InferType<typeof userUpdateSchema>["body"];
export type UserIdDto = InferType<typeof userIdSchema>["query"];
