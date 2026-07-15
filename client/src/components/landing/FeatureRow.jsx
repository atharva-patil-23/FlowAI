import Reveal from "./Reveal";

/**
 * One feature: prose on one side, an illustration on the other. Used four times
 * (generation, realtime, inbox, access); `flip` alternates which side the art
 * sits on so the page doesn't march down in one column.
 */
export default function FeatureRow({ id, eyebrow, heading, body, bullets = [], art, flip = false }) {
    return (
        <div className={`row${flip ? " flip" : ""}`} id={id}>
            <Reveal>
                <span className="eyebrow">{eyebrow}</span>
                <h2>{heading}</h2>
                <p>{body}</p>
                {bullets.length > 0 && (
                    <ul className="bullets">
                        {bullets.map((b, i) => (
                            <li key={i}>
                                <i aria-hidden="true" />
                                <span>{b}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </Reveal>
            <Reveal className="art" delay={0.08}>
                {art}
            </Reveal>
        </div>
    );
}
