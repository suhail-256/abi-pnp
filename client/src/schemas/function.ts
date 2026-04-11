import { z } from "zod";

export const FunctionSchema = z.object({
  type: z.literal("function"),
  name: z.string(),
  inputs: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
    })
  ).optional(),
  outputs: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
    })
  ).optional(),
  stateMutability: z.string()
});

export type FunctionType = z.infer<typeof FunctionSchema>;
