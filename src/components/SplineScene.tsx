"use client";

import Spline from "@splinetool/react-spline/next";
import { Suspense } from "react";

function SplineFallback() {
  return <div className="spline-fallback" aria-hidden="true" />;
}

export default function SplineScene() {
  return (
    <Suspense fallback={<SplineFallback />}>
      <Spline
        scene="https://prod.spline.design/6PD9PObnUJ1TIrqE/scene.splinecode"
        style={{ width: "100%", height: "100%" }}
      />
    </Suspense>
  );
}
