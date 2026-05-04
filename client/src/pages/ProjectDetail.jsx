import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Loader2,
    Trash2,
    UserPlus,
    X,
    Pencil,
    Check,
    Ban,
    Globe2,
    Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    useProject,
    useUpdateProject,
    useDeleteProject,
    useAddProjectMember,
    useRemoveProjectMember,
} from "@/hooks/useProjects";
import { useAuthStore } from "@/store/authStore";
import { useProjectRealtime } from "@/hooks/useProjectRealtime";
import TasksSection from "@/components/dashboard/TasksSection";

const initialsOf = (person) => {
    if (!person) return "?";
    const f = person.firstName?.[0] || "";
    const l = person.lastName?.[0] || "";
    if (f || l) return `${f}${l}`.toUpperCase();
    return (person.username || person.email || "?").slice(0, 2).toUpperCase();
};

const displayName = (person) =>
    person?.firstName
        ? `${person.firstName} ${person.lastName || ""}`.trim()
        : person?.username || person?.email || "Unknown";

const EditHeader = ({ project, canEdit, onDelete, isDeleting }) => {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description || "");
    const [visibility, setVisibility] = useState(project.visibility);

    const updateMutation = useUpdateProject(project._id || project.id);

    const cancel = () => {
        setTitle(project.title);
        setDescription(project.description || "");
        setVisibility(project.visibility);
        setEditing(false);
        updateMutation.reset();
    };

    const save = () =>
        updateMutation.mutate(
            { title: title.trim(), description: description.trim(), visibility },
            { onSuccess: () => setEditing(false) }
        );

    if (!editing) {
        return (
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="truncate text-3xl font-semibold tracking-tight">
                        {project.title}
                    </h1>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        {project.visibility === "public" ? (
                            <Globe2 className="h-3.5 w-3.5" />
                        ) : (
                            <Lock className="h-3.5 w-3.5" />
                        )}
                        {project.visibility === "public" ? "Public" : "Private"}
                    </p>
                    {project.description && (
                        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                            {project.description}
                        </p>
                    )}
                </div>

                {canEdit && (
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>
                        {onDelete && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={onDelete}
                                disabled={isDeleting}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="space-y-1.5">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="edit-visibility">Visibility</Label>
                <select
                    id="edit-visibility"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                </select>
            </div>

            {updateMutation.isError && (
                <p className="text-sm text-destructive">{updateMutation.error.message}</p>
            )}

            <div className="flex gap-2">
                <Button size="sm" onClick={save} disabled={updateMutation.isPending}>
                    <Check className="h-4 w-4" />
                    {updateMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={cancel}
                    disabled={updateMutation.isPending}
                >
                    <Ban className="h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </div>
    );
};

const MembersCard = ({ project, isOwner }) => {
    const projectId = project._id || project.id;
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("editor");

    const addMutation = useAddProjectMember(projectId);
    const removeMutation = useRemoveProjectMember(projectId);

    const submit = (e) => {
        e.preventDefault();
        addMutation.mutate(
            { email: email.trim().toLowerCase(), role },
            { onSuccess: () => setEmail("") }
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{initialsOf(project.owner)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                            {displayName(project.owner)}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                            {project.owner?.email}
                        </p>
                    </div>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        Owner
                    </span>
                </div>

                {project.members?.map((member) => (
                    <div
                        key={member._id || member.user?._id || member.user?.id}
                        className="flex items-center gap-3"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{initialsOf(member.user)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {displayName(member.user)}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {member.user?.email}
                            </p>
                        </div>
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted-foreground">
                            {member.role}
                        </span>
                        {isOwner && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                    removeMutation.mutate(member.user?._id || member.user?.id)
                                }
                                disabled={removeMutation.isPending}
                                aria-label={`Remove ${displayName(member.user)}`}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}

                {isOwner && (
                    <>
                        <Separator />
                        <form onSubmit={submit} className="space-y-3">
                            <Label htmlFor="invite-email">Invite by email</Label>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Input
                                    id="invite-email"
                                    type="email"
                                    placeholder="teammate@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-32"
                                >
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                                <Button type="submit" disabled={addMutation.isPending}>
                                    <UserPlus className="h-4 w-4" />
                                    {addMutation.isPending ? "Adding..." : "Add"}
                                </Button>
                            </div>
                            {addMutation.isError && (
                                <p className="text-sm text-destructive">
                                    {addMutation.error.message}
                                </p>
                            )}
                        </form>
                    </>
                )}

                {removeMutation.isError && (
                    <p className="text-sm text-destructive">{removeMutation.error.message}</p>
                )}
            </CardContent>
        </Card>
    );
};

const ProjectDetail = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const currentUserId = useAuthStore((s) => s.user?.id);

    const { data: project, isLoading, isError, error } = useProject(projectId);
    const deleteMutation = useDeleteProject();

    useProjectRealtime(projectId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-2xl space-y-2 py-16 text-center">
                <h2 className="text-xl font-semibold">Can't load project</h2>
                <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
        );
    }

    if (!project) return null;

    const ownerId = project.owner?._id || project.owner?.id || project.owner;
    const isOwner = currentUserId && String(ownerId) === String(currentUserId);
    const membership = project.members?.find(
        (m) => String(m.user?._id || m.user?.id) === String(currentUserId)
    );
    const canEdit = isOwner || membership?.role === "editor";

    const onDelete = () => {
        if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
        deleteMutation.mutate(projectId, {
            onSuccess: () => navigate("/dashboard", { replace: true }),
        });
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <EditHeader
                project={project}
                canEdit={isOwner}
                onDelete={isOwner ? onDelete : null}
                isDeleting={deleteMutation.isPending}
            />

            <MembersCard project={project} isOwner={isOwner} />

            <TasksSection project={project} canEdit={canEdit} currentUserId={currentUserId} />
        </div>
    );
};

export default ProjectDetail;
