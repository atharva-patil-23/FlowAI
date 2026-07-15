import Reveal from "./Reveal";
import useCountUp from "./hooks/useCountUp";

/* Each figure is checkable: 1–8 per prompt and the 30s AbortController ceiling
 * live in aiController, the three priorities in task.model, and "0 refreshes"
 * is what the socket buys you. */
const STATS = [
    { to: 8, label: "tasks per prompt, max" },
    { to: 30, label: "second generation ceiling" },
    { to: 3, label: "priority levels, used honestly" },
    { to: 0, label: "refreshes needed, ever" },
];

function Orbit({ to, label, delay }) {
    const numRef = useCountUp(to);
    return (
        <Reveal className="orbit" delay={delay}>
            <div className="orbit-n" ref={numRef}>
                0
            </div>
            <div className="orbit-l">{label}</div>
        </Reveal>
    );
}

export default function StatsRow() {
    return (
        <section className="wrap" style={{ padding: "104px 0 0" }}>
            <div className="orbits">
                {STATS.map((s, i) => (
                    <Orbit key={s.label} to={s.to} label={s.label} delay={i * 0.08} />
                ))}
            </div>
        </section>
    );
}
