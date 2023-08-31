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
    lat: string().matches(
      /^-?([1-8]?[0-9]\.{1}\d{1,6}|90\.{1}0{1,6})$/,
      "Invalid latitude value"
    ),
    lng: string().matches(
      /^-?((1[0-7][0-9]|[1-9]?[0-9])\.{1}\d{1,6}|180\.{1}0{1,6})$/,
      "Invalid longitude value"
    ),
    image_url: string().required(),
  }),
});

export const marketUpdateSchema = object({
  body: object({
    id: string().uuid().required(),
    name: string(),
    address: string(),
    lat: string().matches(
      /^-?([1-8]?[0-9]\.{1}\d{1,6}|90\.{1}0{1,6})$/,
      "Invalid latitude value"
    ),
    lng: string().matches(
      /^-?((1[0-7][0-9]|[1-9]?[0-9])\.{1}\d{1,6}|180\.{1}0{1,6})$/,
      "Invalid longitude value"
    ),
    image_url: string(),
  }),
});

export type MarketIdDto = InferType<typeof marketIdSchema>["query"];
export type MarketDto = InferType<typeof marketCreateSchema>["body"];
export type MarketUpdateDto = InferType<typeof marketUpdateSchema>["body"];
