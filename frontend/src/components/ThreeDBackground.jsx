import { useEffect, useRef } from 'react';

export default function ThreeDBackground({ variant = 'hero' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w = 0;
    let h = 0;

    const particles = Array.from({ length: variant === 'hero' ? 80 : variant === 'dashboard' ? 50 : 35 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.0008,
      vy: (Math.random() - 0.5) * 0.0008,
      vz: (Math.random() - 0.5) * 0.0005,
      size: Math.random() * 2 + 0.5,
      hue: Math.random() * 60 + 230,
    }));

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        if (p.z < 0 || p.z > 1) p.vz *= -1;

        const scale = 0.3 + p.z * 1.2;
        const px = cx + (p.x - 0.5) * w * scale * 1.8;
        const py = cy + (p.y - 0.5) * h * scale * 1.2;
        const alpha = 0.15 + p.z * 0.45;

        ctx.beginPath();
        ctx.arc(px, py, p.size * scale * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${alpha})`;
        ctx.fill();
      });

      // connect nearby particles for 3D mesh feel
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.12) {
            const sa = 0.3 + a.z * 1.2;
            const sb = 0.3 + b.z * 1.2;
            ctx.beginPath();
            ctx.moveTo(cx + (a.x - 0.5) * w * sa * 1.8, cy + (a.y - 0.5) * h * sa * 1.2);
            ctx.lineTo(cx + (b.x - 0.5) * w * sb * 1.8, cy + (b.y - 0.5) * h * sb * 1.2);
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 0.12) * 0.12})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [variant]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />
      <div className="scene-3d absolute inset-0">
        <div className="grid-plane grid-plane-1" />
        <div className="grid-plane grid-plane-2" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`floating-cube cube-${i + 1}`} />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-[#fafafa]" />
    </div>
  );
}
