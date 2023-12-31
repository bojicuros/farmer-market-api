import { InferType, object, string, array } from "yup";

export const productIdSchema = object({
  query: object({
    id: string().uuid().required(),
  }),
});

export const addProductSchema = object({
  body: object({
    name: string().required(),
    unit_of_measurement: string().required(),
  }),
});

export const updateProductSchema = object({
  body: object({
    id: string().uuid().required(),
    name: string(),
    unit_of_measurement: string(),
  }),
});

export const userIdSchema = object({
  query: object({
    user_id: string().uuid().required(),
  }),
});

export const userProductAddSchema = object({
  body: object({
    user_id: string().required().uuid(),
    market_id: string().required().uuid(),
    product_id: string().required().uuid(),
  }),
});

export const userProductDeleteSchema = object({
  query: object({
    user_id: string().required().uuid(),
    market_id: string().required().uuid(),
    product_id: string().required().uuid(),
  }),
});

export const vendorsSellingProductSchema = object({
  query: object({
    user_id: string().required().uuid(),
    market_id: string().required().uuid(),
    product_id: string().required().uuid(),
  }),
});

export type ProductIdDto = InferType<typeof productIdSchema>["query"];
export type AddProductDto = InferType<typeof addProductSchema>["body"];
export type UpdateProductDto = InferType<typeof updateProductSchema>["body"];
export type UserIdDto = InferType<typeof userIdSchema>["query"];
export type UserProductAddDto = InferType<typeof userProductAddSchema>["body"];
export type UserProductDeleteDto = InferType<
  typeof userProductDeleteSchema
>["query"];
export type VendorsSellingProductDto = InferType<
  typeof vendorsSellingProductSchema
>["query"];
