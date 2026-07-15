import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Adds `.in` to the element the first time it scrolls into view, then stops
 * watching. Under reduced motion the element starts revealed and no observer
 * is created at all.
 */
export default function useReveal({ threshold = 0.12, delay = 0 } = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (prefersReducedMotion()) {
            el.classList.add("in");
            return;
        }

        el.style.transitionDelay = `${delay}s`;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                el.classList.add("in");
                io.disconnect();
            },
            { threshold, rootMargin: "0px 0px -8% 0px" }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [threshold, delay]);

    return ref;
}
