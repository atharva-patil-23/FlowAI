import { z } from "zod";

export const signupSchema = z.object({
    username: z.string().trim().min(3).max(50),
    firstName: z.string().trim().min(1).max(50),
    lastName: z.string().trim().min(1).max(50),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(6).max(128),
});

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1),
});

export const updatePreferencesSchema = z
    .object({
        aiSuggestion: z.boolean().optional(),
        notifications: z.boolean().optional(),
    })
    .refine((v) => Object.keys(v).length > 0, {
        message: "At least one preference is required",
    });
