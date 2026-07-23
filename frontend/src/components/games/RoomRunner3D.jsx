import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { playGame } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function RoomRunner3D() {
  const canvasRef = useRef(null);
  const { setWallet } = useAuth();
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [reward, setReward] = useState(null);
  const stateRef = useRef({ playing: false, score: 0 });

  const endGame = useCallback(async (finalScore) => {
    setPlaying(false);
    setGameOver(true);
    stateRef.current.playing = false;
    try {
      const res = await playGame('room-runner', finalScore);
      setReward(res);
      if (res.wallet) setWallet(res.wallet);
      else if (res.totalPoints) setWallet((w) => ({ ...w, points: res.totalPoints }));
    } catch { /* offline demo */ }
  }, [setWallet]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w = 0;
    let h = 0;

    let playerX = 0.5;
    let speed = 0.008;
    let obstacles = [];
    let frame = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const spawnObstacle = () => {
      obstacles.push({
        x: 0.2 + Math.random() * 0.6,
        z: 1,
        w: 0.08 + Math.random() * 0.06,
        color: `hsl(${230 + Math.random() * 40}, 70%, 60%)`,
      });
    };

    const draw3DRoad = () => {
      const horizon = h * 0.35;
      const grd = ctx.createLinearGradient(0, horizon, 0, h);
      grd.addColorStop(0, '#1e1b4b');
      grd.addColorStop(1, '#312e81');
      ctx.fillStyle = grd;
      ctx.fillRect(0, horizon, w, h - horizon);

      for (let i = 0; i < 12; i++) {
        const t = i / 12;
        const y = horizon + (h - horizon) * t * t;
        const roadW = w * (0.15 + t * 0.85);
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 + t * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w / 2 - roadW / 2, y);
        ctx.lineTo(w / 2 + roadW / 2, y);
        ctx.stroke();
      }
    };

    const project = (x, z) => {
      const horizon = h * 0.35;
      const t = 1 - z;
      const y = horizon + (h - horizon) * t * t;
      const scale = 0.15 + t * 0.85;
      const px = w / 2 + (x - 0.5) * w * scale;
      const size = 30 * scale;
      return { px, py: y, size, scale };
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h * 0.35);
      draw3DRoad();

      if (stateRef.current.playing) {
        frame++;
        if (frame % 45 === 0) spawnObstacle();
        speed = Math.min(0.025, 0.008 + stateRef.current.score * 0.00005);

        obstacles = obstacles
          .map((o) => ({ ...o, z: o.z - speed }))
          .filter((o) => o.z > 0);

        obstacles.forEach((o) => {
          const { px, py, size } = project(o.x, o.z);
          ctx.fillStyle = o.color;
          ctx.fillRect(px - size / 2, py - size, size, size);
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.strokeRect(px - size / 2, py - size, size, size);

          if (o.z < 0.12 && o.z > 0.04 && Math.abs(o.x - playerX) < 0.08) {
            endGame(stateRef.current.score);
          }
        });

        if (frame % 30 === 0) {
          stateRef.current.score += 1;
          setScore(stateRef.current.score);
        }
      }

      const p = project(playerX, 0.05);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(p.px, p.py - p.size, p.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(p.px - p.size * 0.5, p.py - p.size * 1.5, p.size, p.size);

      animId = requestAnimationFrame(loop);
    };

    const handleKey = (e) => {
      if (!stateRef.current.playing) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') playerX = Math.max(0.15, playerX - 0.06);
      if (e.key === 'ArrowRight' || e.key === 'd') playerX = Math.min(0.85, playerX + 0.06);
    };

    const handleClick = (e) => {
      if (!stateRef.current.playing) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      playerX = Math.max(0.15, Math.min(0.85, x));
    };

    resize();
    loop();
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', handleKey);
    canvas.addEventListener('click', handleClick);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKey);
      canvas.removeEventListener('click', handleClick);
    };
  }, [endGame]);

  const start = () => {
    setScore(0);
    setGameOver(false);
    setReward(null);
    stateRef.current = { playing: true, score: 0 };
    setPlaying(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-4 shadow-xl ring-1 ring-indigo-500/30"
    >
      <div className="mb-3 flex items-center justify-between text-white">
        <div>
          <h3 className="font-bold">🏃 Room Runner 3D</h3>
          <p className="text-xs text-indigo-300">Dodge obstacles · Arrow keys or tap</p>
        </div>
        <span className="rounded-xl bg-white/10 px-3 py-1 font-mono text-lg font-bold">{score}</span>
      </div>
      <canvas ref={canvasRef} className="h-48 w-full cursor-pointer rounded-xl sm:h-56" />
      <div className="mt-3 flex gap-2">
        {!playing && (
          <button onClick={start} className="flex-1 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-2.5 text-sm font-bold text-white">
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        )}
        {playing && <p className="text-xs text-indigo-300">Avoid purple blocks!</p>}
      </div>
      {reward && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-center text-sm font-semibold text-emerald-400">
          +{reward.pointsEarned || 0} points earned!
        </motion.p>
      )}
    </motion.div>
  );
}
