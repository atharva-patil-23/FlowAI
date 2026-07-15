import { useEffect } from "react";

import "../styles/landing.css";

import AuroraCanvas from "../components/landing/AuroraCanvas";
import Starfield from "../components/landing/Starfield";
import LandingNav from "../components/landing/LandingNav";
import Hero from "../components/landing/Hero";
import GeneratorStage from "../components/landing/GeneratorStage";
import StatsRow from "../components/landing/StatsRow";
import LoopSection from "../components/landing/LoopSection";
import FeatureRow from "../components/landing/FeatureRow";
import { SchemaArt, SyncArt, InboxArt, AccessArt } from "../components/landing/FeatureArt";
import TaskAnatomy from "../components/landing/TaskAnatomy";
import FaqSection from "../components/landing/FaqSection";
import ClosingCta from "../components/landing/ClosingCta";
import LandingFooter from "../components/landing/LandingFooter";

const LandingPage = () => {
    /* index.css paints a fixed red gradient on <body> for the whole app. Aurora
     * needs a different ground, and it must go back exactly as it was the moment
     * you navigate to /login or /signup — hence a class, added and removed here
     * rather than an edit to the global base layer. */
    useEffect(() => {
        document.body.classList.add("landing-theme");
        return () => document.body.classList.remove("landing-theme");
    }, []);

    return (
        <div className="landing-root">
            <AuroraCanvas />
            <Starfield />
            <div className="horizon" aria-hidden="true" />

            <div className="shell">
                <LandingNav />
                <Hero />
                <GeneratorStage />
                <StatsRow />
                <LoopSection />

                <section id="gen" className="section wrap">
                    <FeatureRow
                        eyebrow="Generation"
                        heading={
                            <>
                                The backlog writes
                                <br />
                                its own <em>first draft</em>.
                            </>
                        }
                        body="Grooming is the tax you pay before the work starts. Flow hands that first pass to Claude, which returns tasks shaped like tasks — discrete units one person can actually pick up on a Tuesday."
                        bullets={[
                            <>
                                <b>Imperative titles.</b> “Design login screen”, not “login stuff”.
                            </>,
                            <>
                                <b>Honest priorities.</b> High, Medium, Low — weighted, not defaulted.
                            </>,
                            <>
                                <b>Short tags.</b> Up to six lowercase keywords per task.
                            </>,
                            <>
                                <b>One to eight.</b> You say how many it drafts.
                            </>,
                        ]}
                        art={<SchemaArt />}
                    />

                    <FeatureRow
                        id="live"
                        flip
                        eyebrow="Realtime"
                        heading={
                            <>
                                Everyone sees it
                                <br />
                                the moment it <em>lands</em>.
                            </>
                        }
                        body="Flow holds an open socket to every client in a project. Create, edit, complete, delete — the change is on your teammate's screen before they've finished reading it. No refresh. No polling. No “did you get that?”"
                        bullets={[
                            "Created, updated, and deleted events broadcast per project room.",
                            "Laptop and phone stay in lockstep, no reload.",
                            "Kept tasks fan out to the whole team instantly.",
                        ]}
                        art={<SyncArt />}
                    />

                    <FeatureRow
                        eyebrow="Inbox"
                        heading={
                            <>
                                Your day, in
                                <br />
                                one <em>flat list</em>.
                            </>
                        }
                        body="Projects are how work gets organised. They're a terrible way to work out what to do next. The inbox cuts across every project you belong to and shows only what's landed on you."
                        bullets={[
                            "Every task assigned to you, from every project, one place.",
                            "Urgent and overdue surface first.",
                            "One click back into the project when you need context.",
                        ]}
                        art={<InboxArt />}
                    />
                </section>

                <TaskAnatomy />

                <section className="section wrap" style={{ paddingTop: 0 }}>
                    <FeatureRow
                        eyebrow="Access"
                        heading={
                            <>
                                Private by default.
                                <br />
                                Open when you <em>mean</em> it.
                            </>
                        }
                        body="Every project starts private to you. Invite people as editors when they need to change things, or viewers when they only need to watch. Flip a project public when you want it readable by anyone with the link — deliberately, never by accident."
                        bullets={[
                            <>
                                <b>Owner</b> — full control, including who else gets in.
                            </>,
                            <>
                                <b>Editor</b> — create, edit, and generate tasks.
                            </>,
                            <>
                                <b>Viewer</b> — read-only. Can&rsquo;t touch the board.
                            </>,
                        ]}
                        art={<AccessArt />}
                    />
                </section>

                <FaqSection />
                <ClosingCta />
                <LandingFooter />
            </div>
        </div>
    );
};

export default LandingPage;
