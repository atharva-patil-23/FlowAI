import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Counts from 0 to `to` when the element enters view. Writes straight to the
 * DOM node rather than through state — this fires once per element and there is
 * no reason to re-render the tree 60 times for it.
 */
export default function useCountUp(to, { duration = 1200 } = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (to === 0 || prefersReducedMotion()) {
            el.textContent = String(to);
            return;
        }

        let frame = 0;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();

                let start = null;
                const tick = (ts) => {
                    start ??= ts;
                    const p = Math.min((ts - start) / duration, 1);
                    el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
                    if (p < 1) frame = requestAnimationFrame(tick);
                };
                frame = requestAnimationFrame(tick);
            },
            { threshold: 0.6 }
        );

        io.observe(el);
        return () => {
            io.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [to, duration]);

    return ref;
}
