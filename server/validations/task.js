import { z } from "zod";
import mongoose from "mongoose";

const objectId = z
    .string()
    .refine((v) => mongoose.Types.ObjectId.isValid(v), { message: "Invalid id" });

const nullableObjectId = z
    .union([objectId, z.null()])
    .optional();

const nullableDate = z
    .union([z.string().datetime({ offset: true }), z.string().length(0), z.null()])
    .transform((v) => (v ? new Date(v) : null))
    .optional();

export const createTaskSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(200),
    description: z.string().trim().max(2000).optional().default(""),
    priority: z.enum(["High", "Medium", "Low"]).optional().default("Medium"),
    status: z.enum(["Todo", "Inprogress", "Completed"]).optional().default("Todo"),
    assignedTo: nullableObjectId,
    dueDate: nullableDate,
    tags: z.array(z.string().trim().min(1).max(40)).max(20).optional().default([]),
});

export const updateTaskSchema = z
    .object({
        title: z.string().trim().min(1).max(200).optional(),
        description: z.string().trim().max(2000).optional(),
        priority: z.enum(["High", "Medium", "Low"]).optional(),
        status: z.enum(["Todo", "Inprogress", "Completed"]).optional(),
        assignedTo: nullableObjectId,
        dueDate: nullableDate,
        tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
    })
    .refine((v) => Object.keys(v).length > 0, {
        message: "At least one field is required",
    });

export const projectIdParamSchema = z.object({
    projectId: objectId,
});

export const taskIdParamSchema = z.object({
    projectId: objectId,
    taskId: objectId,
});
