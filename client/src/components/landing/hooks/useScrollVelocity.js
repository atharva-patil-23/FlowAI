import { useEffect, useRef } from "react";

/**
 * Tracks how fast the page is scrolling, as a 0..~1.9 signal that decays back to
 * rest. Returned as a ref so the animation loop can read it every frame without
 * re-rendering anything.
 */
export default function useScrollVelocity() {
    const target = useRef(0);

    useEffect(() => {
        let lastY = window.scrollY;

        const onScroll = () => {
            target.current = Math.min(Math.abs(window.scrollY - lastY) / 26, 1.9);
            lastY = window.scrollY;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return target;
}
