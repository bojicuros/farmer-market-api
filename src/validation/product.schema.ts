import { InferType, number, object, string } from "yup";

export const productIdSchema = object({
  query: object({
    id: string().uuid().required(),
  }),
});

export const addProductSchema = object({
  body: object({
    name: string().required(),
    description: string(),
    unit_of_measurement: string().required(),
  }),
});

export const updateProductSchema = object({
  body: object({
    id: string().uuid().required(),
    name: string(),
    description: string(),
    unit_of_measurement: string(),
  }),
});

export const productPriceAddSchema = object({
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
export type AddProductDto = InferType<typeof addProductSchema>["body"];
export type UpdateProductDto = InferType<typeof updateProductSchema>["body"];
export type ProductPriceAddDto = InferType<
  typeof productPriceAddSchema
>["body"];
export type MarketIdDto = InferType<typeof marketIdSchema>["query"];
