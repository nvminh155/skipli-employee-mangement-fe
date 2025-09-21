import { z } from "zod";

export const loginAuth = z.object({
  email: z
    .string()
    .min(1)
    .max(50)
    .email()
    .regex(/^[a-zA-Z0-9.@]+$/),
  code: z
    .string()
    .min(6)
    .max(6)
});
