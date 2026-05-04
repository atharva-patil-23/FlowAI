import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Bell } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useUpdatePreferences } from "@/hooks/useAuth";

const Toggle = ({ checked, disabled, onChange, label, description, icon: Icon }) => (
    <label className="glass-row rounded-2xl px-4 py-3 flex items-start gap-3 cursor-pointer">
        <Icon className="h-4 w-4 mt-0.5 text-white/55 shrink-0" />
        <div className="min-w-0 flex-1">
            <p className="text-sm text-white">{label}</p>
            <p className="mt-0.5 text-xs text-white/55">{description}</p>
        </div>
        <input
            type="checkbox"
            checked={Boolean(checked)}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer"
        />
    </label>
);

const SettingsPage = () => {
    const user = useAuthStore((s) => s.user);
    const prefs = user?.preferences || { aiSuggestion: true, notifications: true };
    const update = useUpdatePreferences();

    const set = (patch) => update.mutate(patch);

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
                    <h1 className="text-2xl font-semibold text-shadow">Settings</h1>
                    <p className="mt-1 text-sm text-white/65">
                        Control how Flow AI works for you.
                    </p>
                </div>

                <div className="space-y-2">
                    <Toggle
                        icon={Sparkles}
                        label="AI suggestions"
                        description="Show AI-generated task suggestions in projects you can edit."
                        checked={prefs.aiSuggestion}
                        disabled={update.isPending}
                        onChange={(v) => set({ aiSuggestion: v })}
                    />
                    <Toggle
                        icon={Bell}
                        label="Email notifications"
                        description="Receive emails for project invites and task assignments."
                        checked={prefs.notifications}
                        disabled={update.isPending}
                        onChange={(v) => set({ notifications: v })}
                    />
                </div>

                {update.isError && (
                    <p className="text-sm text-red-300">{update.error.message}</p>
                )}
                {update.isSuccess && !update.isPending && (
                    <p className="text-xs text-white/55">Preferences saved.</p>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
