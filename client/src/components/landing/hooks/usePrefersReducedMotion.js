import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Reads the OS motion preference and keeps up if the user changes it mid-session. */
export const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia(QUERY).matches;

export default function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(prefersReducedMotion);

    useEffect(() => {
        const mq = window.matchMedia(QUERY);
        const onChange = (e) => setReduced(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    return reduced;
}
