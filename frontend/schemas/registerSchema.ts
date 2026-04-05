import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name minimum 3 characters"),
    username: z.string().min(3, "Username minimum 3 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password minimum 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
