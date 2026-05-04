import { z } from "zod";

export const signupSchema = z
    .object({
        username: z.string().trim().min(3, "Username must be at least 3 characters").max(50),
        firstName: z.string().trim().min(1, "First name is required").max(50),
        lastName: z.string().trim().min(1, "Last name is required").max(50),
        email: z.string().trim().toLowerCase().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters").max(128),
        confirmPassword: z.string().min(1, "Confirm your password"),
    })
    .refine((d) => d.password === d.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});
