import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="glass-strong rounded-3xl px-12 py-14 text-center max-w-md">
                <div className="text-7xl font-bold mb-4 bg-gradient-to-br from-red-400 to-rose-300 bg-clip-text text-transparent text-shadow">
                    404
                </div>
                <p className="text-xl text-white/85 mb-2">This page wandered off.</p>
                <p className="text-sm text-white/60 mb-8">
                    The page at <span className="text-white/80">{location.pathname}</span> doesn't exist.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white px-6 py-2.5 rounded-full btn-glow text-sm font-medium"
                >
                    Back to home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
