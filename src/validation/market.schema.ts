import { InferType, object, string } from "yup";

export const marketIdSchema = object({
  query: object({
    id: string().uuid().required(),
  }),
});

export const marketCreateSchema = object({
  body: object({
    name: string().required(),
    address: string().required(),
    image_url: string().required(),
  }),
});

export const marketUpdateSchema = object({
  body: object({
    id: string().uuid().required(),
    name: string(),
    address: string(),
    image_url: string(),
  }),
});

export type MarketIdDto = InferType<typeof marketIdSchema>["query"];
export type MarketDto = InferType<typeof marketCreateSchema>["body"];
export type MarketUpdateDto = InferType<typeof marketUpdateSchema>["body"];
