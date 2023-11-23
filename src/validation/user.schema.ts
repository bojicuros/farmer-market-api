import { InferType, array, boolean, object, string } from "yup";

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

export const userInfoUpdateSchema = object({
  body: object({
    id: string().uuid().required(),
    email: string().email(),
    first_name: string(),
    last_name: string(),
    roles: array().of(string()).min(1),
    markets: array().of(string()).min(1),
  }),
});

export const userIdSchema = object({
  query: object({
    id: string().uuid().required(),
  }),
});

export const marketsIdSchema = object({
  body: object({
    id: string().uuid().required(),
    marketNames: array().of(string()).min(1),
  }),
});

export type UserCreateDto = InferType<typeof userCreateSchema>["body"];
export type UserUpdateDto = InferType<typeof userUpdateSchema>["body"];
export type UserIdDto = InferType<typeof userIdSchema>["query"];
export type UserInfoUpdateDto = InferType<typeof userInfoUpdateSchema>["body"];
export type MarketIdsDto = InferType<typeof marketsIdSchema>["body"];
