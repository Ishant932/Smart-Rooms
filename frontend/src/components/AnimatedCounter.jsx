import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AnimatedCounter({ value, suffix = '', duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  const numeric = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  const isDecimal = String(value).includes('.');

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - (1 - p) ** 3;
      setDisplay(isDecimal ? (numeric * eased).toFixed(1) : Math.floor(numeric * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, numeric, duration, isDecimal]);

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}
