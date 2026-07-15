import Reveal from "./Reveal";

/* Leads with the limitation on purpose. The old page claimed the AI set due
 * dates; it doesn't, and owning that reads better than the overclaim did. */
const QUESTIONS = [
    {
        q: "Does the AI set due dates?",
        a: "No — and we'd rather say so than pretend. Claude drafts the title, description, priority, and tags. Due dates are yours, because only you know what week you're actually having.",
    },
    {
        q: "Can it touch my board without me?",
        a: "Never. Generation returns a draft to your screen and stops. Tasks only exist once you've picked them and saved.",
    },
    {
        q: "What does Claude actually see?",
        a: "The goal you type, plus your project's title and description. Your other tasks, teammates, and projects are never sent.",
    },
    {
        q: "How many tasks can I ask for?",
        a: "One to eight per prompt, capped at thirty seconds. If Claude is having a slow day you get told, rather than left spinning.",
    },
    {
        q: "Is it really live, or does it poll?",
        a: "Really live — a websocket per project room, so changes push the moment they happen rather than on some interval.",
    },
];

export default function FaqSection() {
    return (
        <section id="faq" className="section wrap">
            <Reveal className="sec-head">
                <span className="eyebrow">Questions</span>
                <h2>The honest answers.</h2>
            </Reveal>

            <Reveal>
                {QUESTIONS.map((item) => (
                    <details className="q" key={item.q}>
                        <summary>
                            {item.q}
                            <span className="pm" aria-hidden="true" />
                        </summary>
                        <div className="q-a">{item.a}</div>
                    </details>
                ))}
            </Reveal>
        </section>
    );
}
