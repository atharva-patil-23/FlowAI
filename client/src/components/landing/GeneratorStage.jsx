import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { prefersReducedMotion } from "./hooks/usePrefersReducedMotion";

const GOAL = "Ship the iOS beta by March";

/* Shaped exactly like what aiController returns: title, description, priority,
 * tags. No due date — the schema doesn't produce one. */
const DRAFT = [
    {
        title: "Set up TestFlight pipeline",
        description: "Configure signing, upload the first build, invite internal testers.",
        priority: "High",
        tags: ["ios", "ci"],
    },
    {
        title: "Audit onboarding for the beta",
        description: "Walk the first-run flow, list what would confuse a new tester.",
        priority: "High",
        tags: ["design", "ux"],
    },
    {
        title: "Write the beta release notes",
        description: "Short changelog plus the three things we want feedback on.",
        priority: "Medium",
        tags: ["copy"],
    },
    {
        title: "Set up crash reporting",
        description: "Symbolicated reports before external testers get in.",
        priority: "Medium",
        tags: ["infra"],
    },
    {
        title: "Recruit twenty external testers",
        description: "Pull from the waitlist, prioritise older devices.",
        priority: "Low",
        tags: ["research"],
    },
    {
        title: "Freeze the feature set",
        description: "Agree what is not shipping in the beta, write it down.",
        priority: "Low",
        tags: ["planning"],
    },
];

function TaskCard({ task, revealed }) {
    const onPointerMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--cx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--cy", `${e.clientY - r.top}px`);
    };

    return (
        <div className={`card${revealed ? " on" : ""}`} onPointerMove={onPointerMove}>
            <div className="card-t">{task.title}</div>
            <div className="card-d">{task.description}</div>
            <div className="card-m">
                <span className={`prio ${task.priority}`}>{task.priority}</span>
                {task.tags.map((t) => (
                    <span className="tag" key={t}>
                        {t}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function GeneratorStage() {
    const [typed, setTyped] = useState("");
    const [drafting, setDrafting] = useState(false);
    const [mounted, setMounted] = useState(0);
    const [revealed, setRevealed] = useState(0);

    const stageRef = useRef(null);
    const runId = useRef(0);
    const cancelled = useRef(false);

    const run = useCallback(async () => {
        // Bumping the id retires any sequence already in flight, so a replay
        // mid-run can't keep typing over the new one.
        const id = ++runId.current;
        const live = () => runId.current === id && !cancelled.current;
        const wait = (ms) => new Promise((r) => setTimeout(r, ms));

        setTyped("");
        setDrafting(false);
        setMounted(0);
        setRevealed(0);

        if (prefersReducedMotion()) {
            setTyped(GOAL);
            setMounted(DRAFT.length);
            setRevealed(DRAFT.length);
            return;
        }

        await wait(500);
        if (!live()) return;

        for (let i = 1; i <= GOAL.length; i++) {
            if (!live()) return;
            setTyped(GOAL.slice(0, i));
            await wait(44);
        }

        await wait(380);
        if (!live()) return;
        setDrafting(true);

        await wait(1250);
        if (!live()) return;
        setDrafting(false);

        for (let i = 1; i <= DRAFT.length; i++) {
            if (!live()) return;
            setMounted(i);
            await wait(28);
            if (!live()) return;
            setRevealed(i);
            await wait(120);
        }
    }, []);

    // Hold the sequence until it's actually on screen, then play it once.
    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                run();
            },
            { threshold: 0.25 }
        );
        io.observe(el);

        return () => {
            io.disconnect();
            cancelled.current = true; // stop an in-flight sequence on unmount
        };
    }, [run]);

    return (
        <Reveal className="stage">
            <div ref={stageRef} className="glass-panel">
                <div className="stage-h">
                    <span className="stage-t">PROJECT · MOBILE LAUNCH</span>
                    <span className="stage-t" style={{ color: "var(--jade)" }}>
                        ● CONNECTED
                    </span>
                </div>

                <div className="stage-b">
                    <div className="prompt">
                        <span className="prompt-k">GOAL</span>
                        <span className="typed">{typed}</span>
                        <span className="caret" aria-hidden="true" />
                    </div>

                    <div className={`beam${drafting ? " on" : ""}`} aria-hidden="true" />
                    <div className={`drafting${drafting ? " on" : ""}`} aria-live="polite">
                        Claude is drafting…
                    </div>

                    <div className="cards">
                        {DRAFT.slice(0, mounted).map((task, i) => (
                            <TaskCard key={task.title} task={task} revealed={i < revealed} />
                        ))}
                    </div>

                    <div className="stage-f">
                        <span className="fnote">Nothing is saved until you choose. Hover a card.</span>
                        <button type="button" className="replay" onClick={run}>
                            ↻ Replay
                        </button>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}
