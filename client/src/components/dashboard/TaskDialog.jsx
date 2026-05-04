import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTaskSchema } from "@/lib/validations/task";
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";

const toDateInput = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
};

const fromDateInput = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

const defaultValues = {
    title: "",
    description: "",
    priority: "Medium",
    status: "Todo",
    assignedTo: "",
    dueDate: "",
    tags: "",
};

const TaskDialog = ({ open, onOpenChange, projectId, project, task }) => {
    const isEdit = Boolean(task);
    const createMutation = useCreateTask(projectId);
    const updateMutation = useUpdateTask(projectId);
    const mutation = isEdit ? updateMutation : createMutation;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createTaskSchema.omit({ tags: true })),
        defaultValues,
    });

    useEffect(() => {
        if (!open) {
            reset(defaultValues);
            return;
        }
        if (task) {
            reset({
                title: task.title || "",
                description: task.description || "",
                priority: task.priority || "Medium",
                status: task.status || "Todo",
                assignedTo: task.assignedTo?._id || task.assignedTo?.id || task.assignedTo || "",
                dueDate: toDateInput(task.dueDate),
                tags: (task.tags || []).join(", "),
            });
        } else {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, task]);

    const assigneeOptions = [
        { value: "", label: "Unassigned" },
        ...(project?.owner
            ? [
                  {
                      value: project.owner._id || project.owner.id,
                      label: `${project.owner.firstName || project.owner.username || project.owner.email} (Owner)`,
                  },
              ]
            : []),
        ...(project?.members || []).map((m) => ({
            value: m.user?._id || m.user?.id,
            label: m.user?.firstName || m.user?.username || m.user?.email || "Unknown",
        })),
    ];

    const onSubmit = (values) => {
        const payload = {
            title: values.title,
            description: values.description || "",
            priority: values.priority,
            status: values.status,
            assignedTo: values.assignedTo || null,
            dueDate: fromDateInput(values.dueDate),
            tags: values.tags
                ? values.tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                : [],
        };

        const options = {
            onSuccess: () => onOpenChange?.(false),
        };

        if (isEdit) {
            updateMutation.mutate({ taskId: task._id || task.id, values: payload }, options);
        } else {
            createMutation.mutate(payload, options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit task" : "New task"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update the task details below." : "Add a task to this project."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="space-y-1.5">
                        <Label htmlFor="task-title">Title</Label>
                        <Input
                            id="task-title"
                            placeholder="Design homepage hero"
                            autoFocus
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="task-description">Description</Label>
                        <Textarea
                            id="task-description"
                            rows={3}
                            placeholder="Details, context, acceptance criteria..."
                            {...register("description")}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="task-status">Status</Label>
                            <select
                                id="task-status"
                                {...register("status")}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="Todo">To do</option>
                                <option value="Inprogress">In progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="task-priority">Priority</Label>
                            <select
                                id="task-priority"
                                {...register("priority")}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="task-assignee">Assignee</Label>
                            <select
                                id="task-assignee"
                                {...register("assignedTo")}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {assigneeOptions.map((opt) => (
                                    <option key={opt.value || "unassigned"} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="task-due">Due date</Label>
                            <Input id="task-due" type="date" {...register("dueDate")} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="task-tags">Tags</Label>
                        <Input
                            id="task-tags"
                            placeholder="design, frontend, urgent"
                            {...register("tags")}
                        />
                        <p className="text-xs text-muted-foreground">Separate with commas.</p>
                    </div>

                    {mutation.isError && (
                        <p className="text-sm text-destructive">{mutation.error.message}</p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange?.(false)}
                            disabled={mutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending
                                ? isEdit
                                    ? "Saving..."
                                    : "Creating..."
                                : isEdit
                                  ? "Save"
                                  : "Create task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TaskDialog;
