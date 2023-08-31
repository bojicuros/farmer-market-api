import { object, string, InferType } from "yup";

export const loginSchema = object({
  body: object({
    email: string().email().required(),
    password: string().min(8).required(),
  }),
});

export const registerSchema = object({
  body: object({
    email: string().email().required(),
    first_name: string().required(),
    last_name: string().required(),
    password: string().min(8).required(),
    phone_number: string(),
  }),
});

export const refreshTokenSchema = object({
  body: object({
    refreshToken: string().required(),
  }),
});

export const emailTokenSchema = object({
  body: object({
    token: string().required(),
    user_id: string().uuid().required(),
  }),
});

export const emailSchema = object({
  query: object({
    email: string().email().required(),
  }),
});

export const resetTokenSchema = object({
  body: object({
    email: string().email().required(),
    token: string().required(),
  }),
});

export const passwordTokenSchema = object({
  body: object({
    email: string().email().required(),
    token: string().required(),
    password: string().min(8).required(),
  }),
});

export type LoginInfoDto = InferType<typeof loginSchema>["body"];
export type RegisterInfoDto = InferType<typeof registerSchema>["body"];
export type RefreshTokenDto = InferType<typeof refreshTokenSchema>["body"];
export type ConfirmationTokenDto = InferType<typeof emailTokenSchema>["body"];
export type EmailDto = InferType<typeof emailSchema>["query"];
export type ResetTokenDto = InferType<typeof resetTokenSchema>["body"];
export type PasswordTokenDto = InferType<typeof passwordTokenSchema>["body"];
