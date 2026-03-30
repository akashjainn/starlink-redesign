"use client";

import { useEffect, useRef } from "react";

// Using @splinetool/runtime directly (has CJS support) to avoid webpack ESM
// resolution issues with @splinetool/react-spline's ESM-only exports.
export default function SplineScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let app: { load: (url: string) => Promise<void>; dispose: () => void } | null =
      null;

    // Dynamic import inside useEffect — safe in browser-only context
    import("@splinetool/runtime").then(({ Application }) => {
      if (!canvasRef.current) return;
      app = new Application(canvasRef.current);
      app.load("https://prod.spline.design/6PD9PObnUJ1TIrqE/scene.splinecode");
    });

    return () => {
      app?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
