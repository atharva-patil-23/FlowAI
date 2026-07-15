import { useEffect, useRef } from "react";

const STAR_COUNT = 130;

/** A static star layer. Drawn once per size — no animation loop. */
export default function Starfield() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const draw = () => {
            const dpr = window.devicePixelRatio || 1;
            const w = window.innerWidth;
            const h = window.innerHeight;

            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < STAR_COUNT; i++) {
                const x = Math.random() * w;
                const y = Math.random() * h * 0.85;
                const r = Math.random() * 1.1;
                ctx.fillStyle = `rgba(236,238,251,${Math.random() * 0.5 + 0.12})`;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        draw();
        let timer;
        const onResize = () => {
            clearTimeout(timer);
            timer = setTimeout(draw, 200);
        };
        window.addEventListener("resize", onResize);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="stars" aria-hidden="true" />;
}
