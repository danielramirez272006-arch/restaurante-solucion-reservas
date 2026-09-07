import { useEffect, useRef, useState } from 'react';

/**
 * Custom Cursor:
 * - 12px gold circle following mouse with ~0.1s lag (via requestAnimationFrame interpolation).
 * - Expands to 40px with mix-blend-mode: difference when hovering over interactive elements.
 * - Pure CSS + JS, zero third-party cursor libraries.
 * - Automatically disabled on touch / coarse-pointer devices.
 */
export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on fine-pointer devices (desktops/laptops with a mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let animationFrameId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check if hovering over buttons, links, inputs, or interactive controls
      const target = e.target;
      const isInteractive = Boolean(
        target &&
          (target.closest('a') ||
            target.closest('button') ||
            target.closest('input') ||
            target.closest('textarea') ||
            target.closest('select') ||
            target.closest('[role="button"]') ||
            target.closest('.clickable') ||
            target.closest('.btn-artisan-gold') ||
            target.closest('.btn-heartbeat-cta') ||
            target.closest('.nav-link-cultural') ||
            target.closest('.menu-card-interactive'))
      );

      setIsHovering(isInteractive);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth trailing animation loop giving 0.1s lag
    // At 60fps, a lerp factor of ~0.18 settles in approx 100ms
    const render = () => {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor-dot ${isHovering ? 'is-hovering' : ''} ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    />
  );
}
