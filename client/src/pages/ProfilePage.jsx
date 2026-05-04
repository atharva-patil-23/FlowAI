import { Link } from "react-router-dom";
import { Mail, User as UserIcon, Calendar, ArrowLeft } from "lucide-react";

import { useAuthStore } from "@/store/authStore";

const Field = ({ icon: Icon, label, value }) => (
    <div className="glass-row rounded-2xl px-4 py-3 flex items-start gap-3">
        <Icon className="h-4 w-4 mt-0.5 text-white/55 shrink-0" />
        <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wider text-white/55">{label}</p>
            <p className="text-sm text-white truncate">{value || "—"}</p>
        </div>
    </div>
);

const ProfilePage = () => {
    const user = useAuthStore((s) => s.user);

    return (
        <div className="mx-auto max-w-2xl space-y-5">
            <Link
                to="/dashboard"
                className="inline-flex items-center text-sm text-white/65 hover:text-white"
            >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to inbox
            </Link>

            <div className="glass rounded-3xl p-6 space-y-5">
                <div>
                    <h1 className="text-2xl font-semibold text-shadow">Profile</h1>
                    <p className="mt-1 text-sm text-white/65">
                        Your account details. Editing is coming soon.
                    </p>
                </div>

                <div className="space-y-2">
                    <Field
                        icon={UserIcon}
                        label="Name"
                        value={
                            user?.firstName
                                ? `${user.firstName} ${user.lastName || ""}`.trim()
                                : user?.username
                        }
                    />
                    <Field icon={UserIcon} label="Username" value={user?.username} />
                    <Field icon={Mail} label="Email" value={user?.email} />
                    <Field icon={Calendar} label="Role" value={user?.role || "user"} />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
