/* The four illustrations that sit beside each FeatureRow. They're presentational
 * only — grouped here so FeatureRow stays about layout and these stay about
 * showing the product. */

export function SchemaArt() {
    return (
        <>
            <div className="art-h">Structured output · validated on arrival</div>
            <pre className="code">
                <span className="p">{"{"}</span>
                {"\n  "}
                <span className="k">&quot;title&quot;</span>
                {":       "}
                <span className="s">&quot;Set up TestFlight pipeline&quot;</span>
                {",\n  "}
                <span className="k">&quot;description&quot;</span>
                {": "}
                <span className="s">&quot;Configure signing, upload the</span>
                {"\n                 "}
                <span className="s">first build, invite testers.&quot;</span>
                {",\n  "}
                <span className="k">&quot;priority&quot;</span>
                {":    "}
                <span className="s">&quot;High&quot;</span>
                {",\n  "}
                <span className="k">&quot;tags&quot;</span>
                {":        ["}
                <span className="s">&quot;ios&quot;</span>
                {", "}
                <span className="s">&quot;ci&quot;</span>
                {", "}
                <span className="s">&quot;release&quot;</span>
                {"]\n"}
                <span className="p">{"}"}</span>
            </pre>
            <div className="art-note">
                Malformed drafts never reach your board — they&rsquo;re rejected at the door.
            </div>
        </>
    );
}

function Device({ name }) {
    return (
        <div className="dev">
            <div className="dev-h">
                <span>{name}</span>
                <span style={{ color: "var(--jade)" }}>●</span>
            </div>
            <div className="bar" style={{ width: "88%" }} />
            <div className="bar live" style={{ width: "64%" }} />
            <div className="bar" style={{ width: "74%" }} />
            <div className="bar" style={{ width: "44%" }} />
        </div>
    );
}

export function SyncArt() {
    return (
        <>
            <div className="sync">
                <Device name="ANITA · MACBOOK" />
                <div className="link" aria-hidden="true">
                    <span />
                    SOCKET
                    <span />
                </div>
                <Device name="DEV · IPHONE" />
            </div>
            <div style={{ marginTop: 18, fontSize: ".73rem", color: "var(--haze-dim)", textAlign: "center" }}>
                The same project, two devices, one truth.
            </div>
        </>
    );
}

const INBOX = [
    { label: "Set up TestFlight pipeline", priority: "High", project: "mobile" },
    { label: "Draft the pricing page copy", priority: "Medium", project: "web" },
    { label: "Review Q3 analytics spec", priority: "Medium", project: "data" },
    { label: "Archive the old staging bucket", priority: "Low", project: "infra" },
];

export function InboxArt() {
    return (
        <>
            <div className="art-h">Assigned to you · 4 open</div>
            {INBOX.map((t) => (
                <div className="irow hoverable" key={t.label}>
                    <span className="av">A</span>
                    <span className="irow-label">{t.label}</span>
                    <span className={`prio ${t.priority}`}>
                        {t.priority === "Medium" ? "Med" : t.priority}
                    </span>
                    <span className="pj">{t.project}</span>
                </div>
            ))}
        </>
    );
}

const ROSTER = [
    { initials: "AP", name: "Atharva Patil", role: "Owner", tone: "High" },
    { initials: "AN", name: "Anita Rao", role: "Editor", tone: "Medium" },
    { initials: "JK", name: "Jonas Kerr", role: "Viewer", tone: "Low" },
];

export function AccessArt() {
    return (
        <>
            <div className="art-h">Project · Mobile launch · Private</div>
            {ROSTER.map((m) => (
                <div className="irow" key={m.initials}>
                    <span className="av">{m.initials}</span>
                    <span className="irow-label">{m.name}</span>
                    <span className={`prio ${m.tone}`}>{m.role}</span>
                </div>
            ))}
            <div className="art-note">
                Sessions are signed tokens, passwords are hashed, and nothing about your projects
                reaches Claude except the goal you type and the project&rsquo;s own title.
            </div>
        </>
    );
}
