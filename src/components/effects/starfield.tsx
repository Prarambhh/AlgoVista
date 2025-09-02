"use client";

import React, { useEffect, useRef } from "react";

// Lightweight, GPU-friendly canvas starfield with subtle twinkle and parallax.
// Renders behind all content and ignores pointer events.
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

    type Star = {
      x: number;
      y: number;
      size: number;
      speed: number;
      twinklePhase: number;
      twinkleSpeed: number;
      hue: number;
    };

    let stars: Star[] = [];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    let isLight = false;
    const updateThemeFlag = () => {
      isLight = document.documentElement.classList.contains("light");
    };

    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      width = innerWidth;
      height = innerHeight;
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

      // Resize canvas with DPR scaling
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Recreate stars with density based on area
      const target = Math.min(500, Math.floor((width * height) / 9000));
      stars = new Array(target).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isLight ? rand(0.8, 2.2) : rand(0.6, 1.8),
        speed: rand(0.02, 0.08),
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: rand(0.002, 0.01),
        hue: Math.random() < 0.15 ? rand(180, 210) : rand(200, 230), // occasional teal/blue accents
      }));
    };

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / width - 0.5) * 2; // -1..1
      targetY = (e.clientY / height - 0.5) * 2;
    };

    const onThemeChange = () => {
      updateThemeFlag();
      // Recompute for new theme so sizes/colors feel right immediately
      handleResize();
    };

    const observer = new MutationObserver(onThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Init
    updateThemeFlag();
    handleResize();

    let lastTime = performance.now();

    const render = () => {
      const now = performance.now();
      const dt = Math.min(33, now - lastTime); // clamp delta to ~30 FPS logic
      lastTime = now;

      // Ease mouse parallax to avoid jitter
      mouseX += (targetX - mouseX) * 0.03;
      mouseY += (targetY - mouseY) * 0.03;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        // Drift downward gently; wrap when off-screen
        const speedFactor = isLight ? 1.3 : 1; // Light mode moves a bit faster; dark mode unchanged
        s.y += s.speed * (dt * 0.06) * speedFactor;
        s.x += mouseX * 0.05; // parallax

        if (s.y > height + 2) {
          s.y = -2;
          s.x = Math.random() * width;
        } else if (s.x < -2) {
          s.x = width + 2;
        } else if (s.x > width + 2) {
          s.x = -2;
        }

        // Twinkle
        s.twinklePhase += s.twinkleSpeed * dt;
        const twinkle = 0.6 + 0.4 * Math.sin(s.twinklePhase);

        ctx.save();
        if (isLight) {
          // In light mode use darker particles with toned-down glow so they are visible on white
          const alpha = 0.25 * twinkle + 0.1; // 0.1..0.35
          ctx.shadowBlur = 4 * twinkle;
          ctx.shadowColor = `hsla(${s.hue}, 85%, 40%, ${0.12 * twinkle})`;
          ctx.fillStyle = `rgba(17, 24, 39, ${alpha})`; // slate-900-ish
        } else {
          // In dark mode keep bright white stars with bluish glow
          const alpha = 0.5 * twinkle;
          ctx.shadowBlur = 8 * twinkle;
          ctx.shadowColor = `hsla(${s.hue}, 95%, 70%, ${0.25 * twinkle})`;
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}