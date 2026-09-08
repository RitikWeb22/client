import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on devices that have a precise pointer (desktop mouse)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    // Quick setters for silky 60fps movement
    const xDotTo = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const yDotTo = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });

    const xRingTo = gsap.quickTo(ring, 'x', { duration: 0.25, ease: 'power3.out' });
    const yRingTo = gsap.quickTo(ring, 'y', { duration: 0.25, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      xDotTo(e.clientX);
      yDotTo(e.clientY);
      xRingTo(e.clientX);
      yRingTo(e.clientY);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Check hovered elements for custom cursor states
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [data-cursor], input, select, textarea, .product-card-hover');
      if (target) {
        setIsHovered(true);
        const customText = target.getAttribute('data-cursor');
        if (customText) {
          setCursorText(customText);
        } else {
          setCursorText('');
        }
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={cursorDotRef}
        className={`pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-[9999] rounded-full transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${
          isHovered ? 'w-2 h-2 bg-amber-400' : 'w-1.5 h-1.5 bg-neutral-900'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Outer Smooth Trailing Ring */}
      <div
        ref={cursorRingRef}
        className={`pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-[9998] flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${
          cursorText
            ? 'w-16 h-16 bg-neutral-900 text-white text-[9px] font-bold tracking-widest uppercase shadow-2xl scale-100'
            : isHovered
            ? 'w-12 h-12 border border-neutral-900/40 bg-neutral-900/5 backdrop-blur-[1px] scale-110'
            : 'w-8 h-8 border border-neutral-900/25 scale-100'
        }`}
        style={{ willChange: 'transform' }}
      >
        {cursorText && (
          <span className="animate-pulse">{cursorText}</span>
        )}
      </div>
    </>
  );
}
