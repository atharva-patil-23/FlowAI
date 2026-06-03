import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useGenerateTasks } from "@/hooks/useAI";
import { useCreateTask } from "@/hooks/useTasks";

const PRIORITY_VARIANT = {
    High: "destructive",
    Medium: "secondary",
    Low: "outline",
};

const AIGenerateTasksDialog = ({ open, onOpenChange, projectId }) => {
    const [prompt, setPrompt] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selected, setSelected] = useState(() => new Set());
    const [addError, setAddError] = useState(null);
    const [adding, setAdding] = useState(false);

    const generate = useGenerateTasks(projectId);
    const createTask = useCreateTask(projectId);

    useEffect(() => {
        if (!open) {
            setPrompt("");
            setSuggestions([]);
            setSelected(new Set());
            setAddError(null);
            setAdding(false);
        }
    }, [open]);

    const onGenerate = () => {
        setAddError(null);
        generate.mutate(
            { prompt, count: 6 },
            {
                onSuccess: ({ suggestions: list }) => {
                    setSuggestions(list);
                    setSelected(new Set(list.map((_, i) => i)));
                },
            }
        );
    };

    const toggle = (idx) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    const onAddSelected = async () => {
        setAddError(null);
        setAdding(true);
        try {
            const chosen = [...selected]
                .sort((a, b) => a - b)
                .map((i) => suggestions[i])
                .filter(Boolean);
            for (const task of chosen) {
                await createTask.mutateAsync({
                    title: task.title,
                    description: task.description || "",
                    priority: task.priority || "Medium",
                    status: "Todo",
                    tags: task.tags || [],
                    assignedTo: null,
                    dueDate: null,
                });
            }
            onOpenChange?.(false);
        } catch (err) {
            setAddError(err?.message || "Failed to add tasks");
        } finally {
            setAdding(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Generate tasks with AI
                    </DialogTitle>
                    <DialogDescription>
                        Describe the goal and Claude will break it into tasks you can review.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="ai-prompt">What do you want to accomplish?</Label>
                        <Textarea
                            id="ai-prompt"
                            rows={3}
                            placeholder="Launch marketing site with blog and pricing page by end of month"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={generate.isPending || adding}
                        />
                    </div>

                    {generate.isError && (
                        <p className="text-sm text-destructive">{generate.error.message}</p>
                    )}

                    {suggestions.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Suggestions</Label>
                                <span className="text-xs text-muted-foreground">
                                    {selected.size} of {suggestions.length} selected
                                </span>
                            </div>
                            <div className="space-y-2">
                                {suggestions.map((task, idx) => (
                                    <label
                                        key={idx}
                                        className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-card p-3 text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            className="mt-0.5 h-4 w-4 shrink-0"
                                            checked={selected.has(idx)}
                                            onChange={() => toggle(idx)}
                                            disabled={adding}
                                        />
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <p className="font-medium">{task.title}</p>
                                            {task.description && (
                                                <p className="text-xs text-muted-foreground">
                                                    {task.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                <Badge
                                                    variant={
                                                        PRIORITY_VARIANT[task.priority] || "secondary"
                                                    }
                                                >
                                                    {task.priority}
                                                </Badge>
                                                {task.tags?.map((tag) => (
                                                    <Badge
                                                        key={tag}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {addError && <p className="text-sm text-destructive">{addError}</p>}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange?.(false)}
                        disabled={generate.isPending || adding}
                    >
                        Cancel
                    </Button>
                    {suggestions.length === 0 ? (
                        <Button
                            onClick={onGenerate}
                            disabled={generate.isPending || prompt.trim().length < 5}
                        >
                            {generate.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Generate
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={onAddSelected}
                            disabled={adding || selected.size === 0}
                        >
                            {adding ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                `Add ${selected.size} task${selected.size === 1 ? "" : "s"}`
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AIGenerateTasksDialog;
