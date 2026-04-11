 import { z } from "zod";

export const AbiSchema = z.array(
  z.object({
    type: z.string(),
    name: z.string(),
    inputs: z.array(
      z.object({
        name: z.string(),
        type: z.string(),
      }),
    ).optional(),
    outputs: z.array(
      z.object({
        name: z.string(),
        type: z.string(),
      }),
    ).optional(),
    stateMutability: z.string().optional(),
  }),
);

export type Abi = z.infer<typeof AbiSchema>;