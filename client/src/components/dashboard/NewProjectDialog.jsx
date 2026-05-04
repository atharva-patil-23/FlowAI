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
import { createProjectSchema } from "@/lib/validations/project";
import { useCreateProject } from "@/hooks/useProjects";

const defaultValues = { title: "", description: "", visibility: "private" };

const NewProjectDialog = ({ open, onOpenChange, onCreated }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ resolver: zodResolver(createProjectSchema), defaultValues });

    const createMutation = useCreateProject();

    useEffect(() => {
        if (!open) reset(defaultValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const onSubmit = (values) =>
        createMutation.mutate(values, {
            onSuccess: ({ project }) => {
                onOpenChange?.(false);
                onCreated?.(project);
            },
        });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New project</DialogTitle>
                    <DialogDescription>
                        Group related tasks together. You can invite teammates later.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="space-y-1.5">
                        <Label htmlFor="project-title">Title</Label>
                        <Input
                            id="project-title"
                            placeholder="Launch marketing site"
                            autoFocus
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="project-description">Description</Label>
                        <Textarea
                            id="project-description"
                            placeholder="What is this project about?"
                            rows={4}
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-xs text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="project-visibility">Visibility</Label>
                        <select
                            id="project-visibility"
                            {...register("visibility")}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="private">Private — invite-only</option>
                            <option value="public">Public — any signed-in user can view</option>
                        </select>
                    </div>

                    {createMutation.isError && (
                        <p className="text-sm text-destructive">{createMutation.error.message}</p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange?.(false)}
                            disabled={createMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? "Creating..." : "Create project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewProjectDialog;
