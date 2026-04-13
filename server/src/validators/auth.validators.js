import { z } from "zod";

export const roleSchema = z.enum(["umkm", "creator"]);

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: roleSchema,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
