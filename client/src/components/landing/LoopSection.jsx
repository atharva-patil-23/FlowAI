import Reveal from "./Reveal";

/* Numbered because this genuinely is a sequence — the order is the product. */
const BEATS = [
    {
        n: "01",
        title: "Describe the goal",
        body: "“Ship the iOS beta by March.” Plain language, up to a thousand characters. Flow sends it to Claude alongside your project's title and description for context — and nothing else.",
    },
    {
        n: "02",
        title: "Claude drafts",
        body: "Back comes a structured set: imperative titles, real descriptions, an honest priority, short lowercase tags. Every field is schema-checked before it reaches your screen.",
    },
    {
        n: "03",
        title: "You decide",
        body: "The draft is just a draft. Keep the ones that earn their place, discard the rest. What survives lands in the project and broadcasts to everyone watching it.",
    },
];

export default function LoopSection() {
    return (
        <section id="loop" className="section wrap">
            <Reveal className="sec-head">
                <span className="eyebrow">The loop</span>
                <h2>
                    One sentence in.
                    <br />A working backlog out.
                </h2>
                <p className="lede">
                    Three beats, in this order, every time. Your project doesn&rsquo;t change until
                    you say so.
                </p>
            </Reveal>

            <Reveal>
                {BEATS.map((b) => (
                    <div className="beat" key={b.n}>
                        <div className="beat-n">{b.n}</div>
                        <div>
                            <h3>{b.title}</h3>
                            <p>{b.body}</p>
                        </div>
                    </div>
                ))}
            </Reveal>
        </section>
    );
}
