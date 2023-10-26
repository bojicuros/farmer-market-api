import { InferType, number, object, string } from "yup";

export const marketIdSchema = object({
  query: object({
    market_id: string().uuid().required(),
  }),
});

export const productUpdateSchema = object({
  body: object({
    id: string().uuid().required(),
    user_id: string().uuid().required(),
    price_value: number().positive().required(),
  }),
});

export const productIdSchema = object({
  query: object({
    id: string().uuid().required(),
  }),
});

export type MarketIdDto = InferType<typeof marketIdSchema>["query"];
export type ProductUpdateDto = InferType<typeof productUpdateSchema>["body"];
export type ProductIdDto = InferType<typeof productIdSchema>["query"];
