import { useEffect, useRef } from 'react';

/** Lighter particle field — pauses when tab is hidden for better performance. */
export default function ThreeDBackground({ variant = 'hero' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let animId;
    let w = 0;
    let h = 0;
    let running = true;

    const count = variant === 'hero' ? 28 : variant === 'dashboard' ? 16 : 12;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      size: Math.random() * 1.8 + 0.4,
      hue: Math.random() * 50 + 175,
    }));

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;

        const scale = 0.4 + p.z * 0.9;
        const px = cx + (p.x - 0.5) * w * scale * 1.6;
        const py = cy + (p.y - 0.5) * h * scale;
        const alpha = 0.12 + p.z * 0.35;

        ctx.beginPath();
        ctx.arc(px, py, p.size * scale * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 65%, 55%, ${alpha})`;
        ctx.fill();
      }

      // Sparse connections only (O(n) neighbor check)
      for (let i = 0; i < particles.length - 1; i++) {
        const a = particles[i];
        const b = particles[i + 1];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.18) {
          ctx.beginPath();
          ctx.moveTo(cx + (a.x - 0.5) * w * 1.2, cy + (a.y - 0.5) * h);
          ctx.lineTo(cx + (b.x - 0.5) * w * 1.2, cy + (b.y - 0.5) * h);
          ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 0.18) * 0.1})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
      animId = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      running = document.visibilityState === 'visible';
      if (running) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animId);
      }
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [variant]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-55" />
      <div className="scene-3d absolute inset-0 opacity-60">
        <div className="grid-plane grid-plane-1" />
        {[0, 1, 2].map((i) => (
          <div key={i} className={`floating-cube cube-${i + 1}`} />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-[#fafafa]" />
    </div>
  );
}
