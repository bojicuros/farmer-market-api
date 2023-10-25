import { InferType, object, string } from "yup";

export const marketIdSchema = object({
  query: object({
    market_id: string().uuid().required(),
  }),
});

export type MarketIdDto = InferType<typeof marketIdSchema>["query"];
