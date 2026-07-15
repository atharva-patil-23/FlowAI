import { useEffect, useRef } from "react";
import useScrollVelocity from "./hooks/useScrollVelocity";
import { prefersReducedMotion } from "./hooks/usePrefersReducedMotion";

/* Rendered at a fraction of viewport size and blurred up by CSS. The blur hides
 * the low resolution completely and costs a fraction of a full-size canvas. */
const SCALE = 0.3;
const SEGMENTS = 40;

const BANDS = [
    { rgb: "74,222,128", amp: 0.11, freq: 1.5, speed: 0.00022, y: 0.3, width: 0.16 },
    { rgb: "129,140,248", amp: 0.14, freq: 1.1, speed: 0.00031, y: 0.42, width: 0.21 },
    { rgb: "232,121,249", amp: 0.09, freq: 2.1, speed: 0.00017, y: 0.36, width: 0.12 },
    { rgb: "34,211,238", amp: 0.12, freq: 0.8, speed: 0.00026, y: 0.5, width: 0.17 },
];

export default function AuroraCanvas() {
    const canvasRef = useRef(null);
    const velocity = useScrollVelocity();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let w = 0;
        let h = 0;
        let frame = 0;
        let vel = 0;
        let pointerX = 0.5;
        let pointerY = 0.35;

        const size = () => {
            w = canvas.width = Math.ceil(window.innerWidth * SCALE);
            h = canvas.height = Math.ceil(window.innerHeight * SCALE);
        };
        size();

        const fine = window.matchMedia("(pointer: fine)").matches;
        const onPointer = (e) => {
            pointerX = e.clientX / window.innerWidth;
            pointerY = e.clientY / window.innerHeight;
        };

        // Offset of a band's leading edge at horizontal position `u`, at time `t`.
        const edge = (band, u, t, turbulence) =>
            Math.sin(u * Math.PI * band.freq * 2 + t * band.speed * 1000) * band.amp * turbulence +
            Math.sin(u * Math.PI * band.freq * 5.3 + t * band.speed * 1700) * band.amp * 0.35 * turbulence +
            (pointerX - 0.5) * 0.07 +
            (pointerY - 0.5) * 0.04;

        const draw = (t) => {
            vel += (velocity.current - vel) * 0.06;
            velocity.current *= 0.92;

            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = "lighter";

            for (const band of BANDS) {
                const turbulence = 1 + vel * 1.5;

                ctx.beginPath();
                for (let i = 0; i <= SEGMENTS; i++) {
                    const u = i / SEGMENTS;
                    ctx.lineTo(u * w, (band.y + edge(band, u, t, turbulence)) * h);
                }
                for (let i = SEGMENTS; i >= 0; i--) {
                    const u = i / SEGMENTS;
                    ctx.lineTo(u * w, (band.y + edge(band, u, t, turbulence) + band.width) * h);
                }
                ctx.closePath();

                const grad = ctx.createLinearGradient(0, band.y * h, 0, (band.y + band.width) * h);
                grad.addColorStop(0, `rgba(${band.rgb},0)`);
                grad.addColorStop(0.45, `rgba(${band.rgb},${0.3 + vel * 0.14})`);
                grad.addColorStop(1, `rgba(${band.rgb},0)`);
                ctx.fillStyle = grad;
                ctx.fill();
            }

            ctx.globalCompositeOperation = "source-over";
            frame = requestAnimationFrame(draw);
        };

        /* The canvas is fixed and shows through every translucent section, so it
         * stays live for the whole page. A hidden tab is the only safe moment to
         * stop — pausing on scroll would visibly freeze the ribbons. */
        const onVisibility = () => {
            cancelAnimationFrame(frame);
            if (!document.hidden) frame = requestAnimationFrame(draw);
        };

        window.addEventListener("resize", size);
        if (fine) window.addEventListener("pointermove", onPointer, { passive: true });
        document.addEventListener("visibilitychange", onVisibility);
        frame = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", size);
            if (fine) window.removeEventListener("pointermove", onPointer);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [velocity]);

    // Under reduced motion the aurora never mounts at all.
    if (prefersReducedMotion()) return null;

    return <canvas ref={canvasRef} className="sky" aria-hidden="true" />;
}
