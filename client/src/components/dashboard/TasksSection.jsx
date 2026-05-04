import { useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Calendar, User as UserIcon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import TaskDialog from "./TaskDialog";
import AIGenerateTasksDialog from "./AIGenerateTasksDialog";

const STATUS_COLUMNS = [
    { id: "Todo", label: "To do" },
    { id: "Inprogress", label: "In progress" },
    { id: "Completed", label: "Completed" },
];

const PRIORITY_PILL = {
    High: "bg-red-500/25 text-red-200 border-red-400/40",
    Medium: "bg-amber-500/20 text-amber-200 border-amber-400/30",
    Low: "bg-white/10 text-white/70 border-white/15",
};

const formatDueDate = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const initialsOf = (person) => {
    if (!person) return "?";
    const f = person.firstName?.[0] || "";
    const l = person.lastName?.[0] || "";
    if (f || l) return `${f}${l}`.toUpperCase();
    return (person.username || person.email || "?").slice(0, 2).toUpperCase();
};

const TaskCard = ({
    task,
    canEdit,
    canChangeStatus,
    onEdit,
    onDelete,
    onStatusChange,
    updatePending,
}) => {
    const due = formatDueDate(task.dueDate);
    const pillClass = PRIORITY_PILL[task.priority] || PRIORITY_PILL.Medium;

    return (
        <div className="glass-row rounded-2xl p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-tight text-shadow">{task.title}</p>
                {canEdit && (
                    <div className="flex shrink-0 gap-0.5">
                        <button
                            onClick={() => onEdit(task)}
                            aria-label="Edit task"
                            className="h-6 w-6 rounded-md flex items-center justify-center text-white/65 hover:text-white hover:bg-white/10"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => onDelete(task)}
                            aria-label="Delete task"
                            className="h-6 w-6 rounded-md flex items-center justify-center text-white/65 hover:text-red-300 hover:bg-red-500/15"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                )}
            </div>

            {task.description && (
                <p className="line-clamp-2 text-xs text-white/65">{task.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-1.5">
                <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${pillClass}`}
                >
                    {task.priority}
                </span>
                {task.tags?.map((tag) => (
                    <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded-full border border-white/15 text-white/65"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 text-xs text-white/65">
                <div className="flex items-center gap-1.5">
                    {task.assignedTo ? (
                        <>
                            <Avatar className="h-5 w-5">
                                <AvatarFallback className="bg-gradient-to-br from-red-400 to-rose-500 text-white text-[9px]">
                                    {initialsOf(task.assignedTo)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate">
                                {task.assignedTo.firstName ||
                                    task.assignedTo.username ||
                                    task.assignedTo.email}
                            </span>
                        </>
                    ) : (
                        <span className="flex items-center gap-1">
                            <UserIcon className="h-3 w-3" />
                            Unassigned
                        </span>
                    )}
                </div>
                {due && (
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {due}
                    </span>
                )}
            </div>

            {canChangeStatus && (
                <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task, e.target.value)}
                    disabled={updatePending}
                    className="glass-row mt-2 w-full h-7 rounded-md px-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500/40"
                >
                    <option value="Todo">To do</option>
                    <option value="Inprogress">In progress</option>
                    <option value="Completed">Completed</option>
                </select>
            )}
        </div>
    );
};

const TasksSection = ({ project, canEdit, currentUserId }) => {
    const projectId = project._id || project.id;
    const { data: tasks = [], isLoading, isError, error } = useTasks(projectId);
    const updateMutation = useUpdateTask(projectId);
    const deleteMutation = useDeleteTask(projectId);

    const isAssignee = (task) => {
        if (!currentUserId) return false;
        const a = task.assignedTo;
        if (!a) return false;
        const aid = a._id || a.id || a;
        return String(aid) === String(currentUserId);
    };

    const [dialogOpen, setDialogOpen] = useState(false);
    const [aiDialogOpen, setAiDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const openNew = () => {
        setEditingTask(null);
        setDialogOpen(true);
    };

    const openEdit = (task) => {
        setEditingTask(task);
        setDialogOpen(true);
    };

    const handleStatusChange = (task, status) => {
        updateMutation.mutate({ taskId: task._id || task.id, values: { status } });
    };

    const handleDelete = (task) => {
        if (!window.confirm(`Delete task "${task.title}"?`)) return;
        deleteMutation.mutate(task._id || task.id);
    };

    const grouped = STATUS_COLUMNS.map((col) => ({
        ...col,
        tasks: tasks.filter((t) => t.status === col.id),
    }));

    return (
        <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-[18px] font-semibold text-shadow">Tasks</h2>
                {canEdit && (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setAiDialogOpen(true)}
                            className="glass border-white/15 text-white hover:bg-white/10"
                        >
                            <Sparkles className="h-4 w-4 text-red-300" />
                            Generate with AI
                        </Button>
                        <button
                            onClick={openNew}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white text-[13px] font-medium px-3 py-1.5 rounded-lg btn-glow flex items-center gap-1.5"
                        >
                            <Plus className="h-4 w-4" />
                            New task
                        </button>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-10 text-white/55">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
            )}

            {isError && <p className="text-sm text-red-300">{error.message}</p>}

            {!isLoading && !isError && tasks.length === 0 && (
                <p className="py-10 text-center text-sm text-white/55">
                    No tasks yet. {canEdit ? 'Click "New task" to add one.' : ""}
                </p>
            )}

            {!isLoading && tasks.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {grouped.map((col) => (
                        <div key={col.id} className="glass-row rounded-2xl p-3 space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-white/55">
                                    {col.label}
                                </h3>
                                <span className="text-[11px] text-white/55">
                                    {col.tasks.length}
                                </span>
                            </div>
                            <div className="space-y-2">
                                {col.tasks.map((task) => (
                                    <TaskCard
                                        key={task._id || task.id}
                                        task={task}
                                        canEdit={canEdit}
                                        canChangeStatus={canEdit || isAssignee(task)}
                                        onEdit={openEdit}
                                        onDelete={handleDelete}
                                        onStatusChange={handleStatusChange}
                                        updatePending={updateMutation.isPending}
                                    />
                                ))}
                                {col.tasks.length === 0 && (
                                    <p className="rounded-md border border-dashed border-white/15 py-4 text-center text-xs text-white/45">
                                        Empty
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteMutation.isError && (
                <p className="mt-3 text-sm text-red-300">{deleteMutation.error.message}</p>
            )}

            <TaskDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                projectId={projectId}
                project={project}
                task={editingTask}
            />

            <AIGenerateTasksDialog
                open={aiDialogOpen}
                onOpenChange={setAiDialogOpen}
                projectId={projectId}
            />
        </div>
    );
};

export default TasksSection;
