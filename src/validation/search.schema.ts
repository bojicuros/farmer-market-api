import { InferType, object, string } from "yup";

export const searchSchema = object({
  query: object({
    query: string().min(1).required(),
  }),
});

export type SearchQueryDto = InferType<typeof searchSchema>["query"];
