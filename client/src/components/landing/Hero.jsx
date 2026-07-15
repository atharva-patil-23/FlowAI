import { Link } from "react-router-dom";
import useMagnetic from "./hooks/useMagnetic";

export default function Hero() {
    const primaryRef = useMagnetic();
    const secondaryRef = useMagnetic();

    return (
        <div className="hero wrap">
            <div className="pill">
                <span className="dot" aria-hidden="true" /> Powered by Claude · realtime for teams
            </div>

            <h1>
                <span className="ln">
                    <span style={{ animationDelay: "0.05s" }}>Tasks, generated.</span>
                </span>
                <span className="ln">
                    <span style={{ animationDelay: "0.17s" }}>
                        <em>Work, accelerated.</em>
                    </span>
                </span>
            </h1>

            <p className="lede">
                Describe what you&rsquo;re trying to ship. Claude drafts the backlog — titled,
                described, prioritised, tagged. You keep what&rsquo;s right and bin the rest.
            </p>

            <div className="cta-row">
                <Link to="/signup" className="btn btn-warm" ref={primaryRef}>
                    Start with AI <span className="arw">→</span>
                </Link>
                <a href="#loop" className="btn btn-cool" ref={secondaryRef}>
                    See the loop
                </a>
            </div>
        </div>
    );
}
