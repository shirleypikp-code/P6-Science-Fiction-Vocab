import { useEffect, useRef } from 'react';

interface StarfieldProps {
  isWarpSpeed?: boolean;
}

export default function Starfield({ isWarpSpeed = false }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const numStars = 140;
    const stars = Array.from({ length: numStars }).map(() => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * width,
      size: Math.random() * 1.6 + 0.6,
      color: Math.random() > 0.8 ? '#38bdf8' : Math.random() > 0.6 ? '#c084fc' : '#ffffff'
    }));

    const render = () => {
      // Clear with dark void trailing
      ctx.fillStyle = isWarpSpeed ? 'rgba(11, 15, 25, 0.35)' : '#0B0F19';
      ctx.fillRect(0, 0, width, height);

      // Subtle galactic gradient overlay
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        10,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.7
      );
      gradient.addColorStop(0, 'rgba(30, 27, 75, 0.35)');
      gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.2)');
      gradient.addColorStop(1, 'rgba(11, 15, 25, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const speed = isWarpSpeed ? 24 : 1.2;
      const cx = width / 2;
      const cy = height / 2;

      stars.forEach((star) => {
        star.z -= speed;
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 1.5;
          star.y = (Math.random() - 0.5) * height * 1.5;
        }

        const k = 250 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const depth = (1 - star.z / width);
          const size = Math.max(0.8, star.size * k * 0.6);
          const alpha = Math.min(1, Math.max(0.2, depth * 1.2));

          ctx.beginPath();
          if (isWarpSpeed) {
            // Draw warp streaks
            const prevK = 250 / (star.z + speed * 2.5);
            const prevPx = star.x * prevK + cx;
            const prevPy = star.y * prevK + cy;

            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.strokeStyle = star.color;
            ctx.lineWidth = Math.min(3, size);
            ctx.globalAlpha = alpha;
            ctx.stroke();
          } else {
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = alpha;
            ctx.fill();
          }
        }
      });

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isWarpSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
