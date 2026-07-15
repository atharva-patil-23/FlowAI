import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useMagnetic from "./hooks/useMagnetic";

const LINKS = [
    { href: "#loop", label: "The loop" },
    { href: "#gen", label: "Generation" },
    { href: "#live", label: "Realtime" },
    { href: "#faq", label: "FAQ" },
];

export default function LandingNav() {
    const navRef = useRef(null);
    const ctaRef = useMagnetic();

    useEffect(() => {
        const el = navRef.current;
        if (!el) return;
        const onScroll = () => el.classList.toggle("stuck", window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className="nav" ref={navRef}>
            <div className="nav-in">
                <div className="brand">
                    <span className="mark" aria-hidden="true" /> Flow AI
                </div>
                <nav className="nav-links" aria-label="Primary">
                    {LINKS.map((l) => (
                        <a key={l.href} href={l.href}>
                            {l.label}
                        </a>
                    ))}
                </nav>
                <Link to="/signup" className="btn btn-warm" ref={ctaRef}>
                    Start free <span className="arw">→</span>
                </Link>
            </div>
        </header>
    );
}
