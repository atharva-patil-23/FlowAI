import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Leans the element toward the cursor and springs it back on leave.
 * Skipped entirely on touch — there is no hover to lean into, and the listeners
 * would just cost battery.
 */
export default function useMagnetic({ strength = 5 } = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;

        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
            const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
            el.style.transform = `translate(${dx * strength}px, ${dy * (strength * 0.8)}px)`;
        };
        const onLeave = () => {
            el.style.transform = "";
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
        };
    }, [strength]);

    return ref;
}
