import { InferType, date, number, object, string } from "yup";

export const marketIdSchema = object({
  query: object({
    market_id: string().uuid().required(),
  }),
});

export const pricePerDaySchema = object({
  body: object({
    date: date().required(),
    market_id: string().uuid().required(),
  }),
});

export const addProductPriceSchema = object({
  body: object({
    market_id: string().uuid().required(),
    user_id: string().uuid().required(),
    product_id: string().uuid().required(),
    price_value: number().positive().required(),
  }),
});

export const updateProductPriceSchema = object({
  body: object({
    id: string().uuid().required(),
    price_value: number().positive().required(),
  }),
});

export const priceIdSchema = object({
  query: object({
    id: string().uuid().required(),
  }),
});

export const userIdSchema = object({
  query: object({
    user_id: string().uuid().required(),
  }),
});

export type MarketIdDto = InferType<typeof marketIdSchema>["query"];
export type PricePerDayDto = InferType<typeof pricePerDaySchema>["body"];
export type AddProductPriceDto = InferType<
  typeof addProductPriceSchema
>["body"];
export type UpdateProductPriceDto = InferType<
  typeof updateProductPriceSchema
>["body"];
export type PriceIdDto = InferType<typeof priceIdSchema>["query"];
export type UserIdDto = InferType<typeof userIdSchema>["query"];
