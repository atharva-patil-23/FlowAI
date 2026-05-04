import { Plus, Menu, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";

const TopNavigation = ({ onToggleSidebar, onNewTask }) => {
    const user = useAuthStore((s) => s.user);
    const logout = useLogout();
    const navigate = useNavigate();
    const initials =
        (user?.firstName?.[0] || "") + (user?.lastName?.[0] || "") ||
        user?.email?.[0]?.toUpperCase() ||
        "U";

    return (
        <nav className="glass-strong rounded-3xl flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                    className="h-9 w-9 rounded-lg flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            <div className="flex items-center gap-2">
                {onNewTask && (
                    <button
                        onClick={onNewTask}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white text-[13px] font-medium px-3.5 py-2 rounded-lg btn-glow flex items-center gap-1.5"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">New task</span>
                    </button>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-white/10"
                            aria-label="Account menu"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-br from-red-400 to-rose-500 text-white text-[11px]">
                                    {initials.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {user?.firstName
                                        ? `${user.firstName} ${user.lastName || ""}`.trim()
                                        : user?.username || "Account"}
                                </p>
                                <p className="text-xs leading-none text-white/65">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                            <User className="h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                            <Settings className="h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={logout}
                            className="text-red-300 focus:text-red-200"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
};

export default TopNavigation;
