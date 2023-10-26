import { InferType, number, object, string } from "yup";

export const productIdSchema = object({
  query: object({
    id: string().uuid().required(),
  }),
});

export const productSchema = object({
  body: object({
    id: string().uuid().required(),
    name: string(),
    description: string(),
    unit_of_measurement: string(),
  }),
});

export const productUpdateSchema = object({
  body: object({
    id: string().uuid().required(),
    user_id: string().uuid().required(),
    price_value: number().positive().required(),
  }),
});

export const marketIdSchema = object({
  query: object({
    market_id: string().uuid().required(),
  }),
});
export type ProductIdDto = InferType<typeof productIdSchema>["query"];
export type ProductDto = InferType<typeof productSchema>["body"];
export type ProductUpdateDto = InferType<typeof productUpdateSchema>["body"];
export type MarketIdDto = InferType<typeof marketIdSchema>["query"];
