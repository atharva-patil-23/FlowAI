import Reveal from "./Reveal";

/* Mirrors task.model.js exactly. "Due date — yours to set" is the honest line:
 * the AI schema has no dueDate field. */
const FIELDS = [
    { k: "Title", v: "Set up TestFlight pipeline" },
    { k: "Status", v: "Todo · In progress · Completed" },
    { k: "Priority", v: "High · Medium · Low" },
    { k: "Assignee", v: "Anyone on the project" },
    { k: "Due date", v: "Yours to set" },
    { k: "Tags", v: "ios · ci · release" },
];

export default function TaskAnatomy() {
    return (
        <section className="section wrap" style={{ paddingTop: 0 }}>
            <Reveal className="sec-head">
                <span className="eyebrow">Anatomy</span>
                <h2>What a task actually holds.</h2>
                <p className="lede">
                    Enough structure to be useful. Not so much that filling it in becomes the job.
                </p>
            </Reveal>

            <Reveal className="anat">
                {FIELDS.map((f) => (
                    <div className="fld" key={f.k}>
                        <div className="fld-k">{f.k}</div>
                        <div className="fld-v">{f.v}</div>
                    </div>
                ))}
            </Reveal>
        </section>
    );
}
