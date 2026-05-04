import { useEffect, useState } from "react";
import { Brain, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => setIsVisible(true), []);

    const navigate = useNavigate();
    const goSignup = () => navigate("/signup");
    const goLogin = () => navigate("/login");

    const features = [
        {
            icon: Brain,
            title: "Type the goal. Get the plan.",
            body: "Claude turns one sentence into a structured backlog. You pick what stays, what tags, what ships first.",
            tint: "from-red-500/30 to-rose-500/20",
        },
        {
            icon: Target,
            title: "Prioritized for you.",
            body: "Every task lands with priority, due date, and tags. No more hours spent grooming the backlog.",
            tint: "from-rose-500/30 to-red-600/20",
        },
        {
            icon: Zap,
            title: "Live, by default.",
            body: "Sockets push every change. Open Flow on two devices and watch them dance in sync.",
            tint: "from-red-600/30 to-orange-500/20",
        },
    ];

    return (
        <div className="min-h-screen">
            {/* nav */}
            <header className="px-6 pt-5 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto glass rounded-full h-14 px-5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-sm shadow-lg shadow-red-500/30">
                            ✦
                        </div>
                        <span className="font-semibold text-[15px] text-shadow">Flow AI</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-7 text-[13.5px] text-white/80">
                        <a href="#features" className="hover:text-white">Features</a>
                        <button onClick={goLogin} className="hover:text-white">Sign in</button>
                    </nav>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goLogin}
                            className="md:hidden text-[13px] px-3 py-1.5 text-white/85 hover:text-white"
                        >
                            Sign in
                        </button>
                        <button
                            onClick={goSignup}
                            className="text-[13px] glass-strong px-4 py-1.5 rounded-full hover:bg-white/15"
                        >
                            Start with AI
                        </button>
                    </div>
                </div>
            </header>

            {/* hero */}
            <section className="max-w-5xl mx-auto px-6 pt-24 pb-28 text-center">
                <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-10 text-[12px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                    <span className="text-white/90">Powered by Claude · live for teams</span>
                </div>
                <h1
                    className={`text-shadow text-5xl md:text-7xl lg:text-[88px] leading-[0.95] font-bold mb-7 transition-all duration-1000 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                    style={{ letterSpacing: "-0.04em" }}
                >
                    Tasks, generated.
                    <br />
                    Work, accelerated.
                </h1>
                <p
                    className={`text-[18px] text-white/85 max-w-xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                >
                    Flow turns goals into backlogs, teammates into a feed, and your day into a single, calm inbox. Built for the AI-native team.
                </p>
                <div
                    className={`flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 transition-all duration-1000 delay-500 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                >
                    <button
                        onClick={goSignup}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white text-[14.5px] font-medium px-6 py-3 rounded-full btn-glow w-full sm:w-auto"
                    >
                        Start with AI →
                    </button>
                    <a
                        href="#features"
                        className="text-[14.5px] text-white/85 hover:text-white px-6 py-3 glass rounded-full w-full sm:w-auto text-center"
                    >
                        See features
                    </a>
                </div>
            </section>

            {/* features */}
            <section id="features" className="max-w-6xl mx-auto px-6 pb-28">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-shadow" style={{ letterSpacing: "-0.02em" }}>
                        Why <span className="bg-gradient-to-r from-red-400 to-rose-300 bg-clip-text text-transparent">Flow AI</span>
                    </h2>
                    <p className="text-white/75 max-w-2xl mx-auto text-[16px]">
                        AI that drafts the boring work so you can spend brain on the hard parts.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className={`glass rounded-3xl p-7 hover:scale-[1.02] transition-transform duration-300 bg-gradient-to-br ${f.tint}`}
                        >
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-red-500/40">
                                <f.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-[18px] font-semibold mb-2 text-shadow">{f.title}</h3>
                            <p className="text-[14px] text-white/75 leading-relaxed">{f.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* footer */}
            <footer className="px-6 pb-8">
                <div className="max-w-6xl mx-auto glass rounded-2xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[12.5px] text-white/75">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs">✦</div>
                        <span>Flow AI — work, accelerated.</span>
                    </div>
                    <div>© 2026 Flow AI. Created by Atharva Patil.</div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
