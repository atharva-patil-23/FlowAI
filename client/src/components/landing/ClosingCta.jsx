import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import useMagnetic from "./hooks/useMagnetic";

export default function ClosingCta() {
    const primaryRef = useMagnetic();
    const secondaryRef = useMagnetic();

    return (
        <section className="cta wrap">
            <Reveal>
                <h2>
                    Stop grooming.
                    <br />
                    <em>Start shipping.</em>
                </h2>
                <p>Type your first goal in about ninety seconds. Free to start, no card.</p>
                <div className="cta-row">
                    <Link to="/signup" className="btn btn-warm" ref={primaryRef}>
                        Start with AI <span className="arw">→</span>
                    </Link>
                    <Link to="/login" className="btn btn-cool" ref={secondaryRef}>
                        Sign in
                    </Link>
                </div>
            </Reveal>
        </section>
    );
}
