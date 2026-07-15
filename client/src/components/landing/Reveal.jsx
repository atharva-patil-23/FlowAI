import useReveal from "./hooks/useReveal";

/**
 * Wraps children in a scroll-reveal. Thin, but it keeps the observer wiring out
 * of every section component — they just say what should rise and when.
 */
export default function Reveal({ children, delay = 0, className = "", as: Tag = "div", ...rest }) {
    const ref = useReveal({ delay });
    return (
        <Tag ref={ref} className={`rise ${className}`.trim()} {...rest}>
            {children}
        </Tag>
    );
}
