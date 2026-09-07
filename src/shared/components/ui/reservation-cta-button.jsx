import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';

/**
 * ReservationCtaButton:
 * - On click: @react-spring physics scale bounce (1 → 0.95 → 1.05 → 1)
 * - Pure CSS background ripple effect at click origin
 * - Navigates smoothly to the target path
 */
export default function ReservationCtaButton({
  children = 'Asegurar mi mesa',
  to = '/reservar',
  className = '',
  onClick,
  showArrow = true,
  ...props
}) {
  const navigate = useNavigate();
  const [ripples, setRipples] = useState([]);

  // Physics-based spring scale
  const [{ scale }, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 380, friction: 14 },
  }));

  const handleClick = (e) => {
    // 1. Spawning CSS ripple at exact click coordinates relative to button
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now() + Math.random();

    setRipples((prev) => [...prev, { x, y, id: rippleId }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 700);

    // 2. Physics bounce sequence: 1 → 0.95 → 1.05 → 1
    api.start({
      to: async (next) => {
        await next({ scale: 0.95, config: { tension: 500, friction: 16 } });
        await next({ scale: 1.05, config: { tension: 450, friction: 10 } });
        await next({ scale: 1.0, config: { tension: 320, friction: 14 } });
      },
    });

    if (onClick) {
      onClick(e);
    }

    if (to) {
      setTimeout(() => {
        navigate(to);
      }, 240);
    }
  };

  return (
    <animated.button
      type="button"
      onClick={handleClick}
      style={{ scale }}
      className={`btn-heartbeat-cta relative overflow-hidden select-none cursor-pointer inline-flex items-center gap-2.5 ${className}`.trim()}
      {...props}
    >
      {/* Background ripple particles in pure CSS */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="btn-ripple-wave"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
          }}
          aria-hidden="true"
        />
      ))}
      <span className="relative z-10 flex items-center gap-2">
        <span>{children}</span>
        {showArrow && <span aria-hidden="true">→</span>}
      </span>
    </animated.button>
  );
}
