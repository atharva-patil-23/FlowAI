const idOf = (v) => {
    if (v == null) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object" && v._id) return v._id.toString();
    return v.toString();
};

export const isOwner = (project, userId) => idOf(project.owner) === idOf(userId);

export const memberEntry = (project, userId) =>
    (project.members || []).find((m) => idOf(m.user) === idOf(userId));

export const canView = (project, userId) => {
    if (project.visibility === "public") return true;
    return isOwner(project, userId) || Boolean(memberEntry(project, userId));
};

export const canEdit = (project, userId) => {
    if (isOwner(project, userId)) return true;
    const m = memberEntry(project, userId);
    return Boolean(m && m.role === "editor");
};
