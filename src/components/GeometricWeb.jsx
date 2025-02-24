import React, { useEffect, useRef } from 'react';

const GeometricWeb = () => {
  const canvasRef = useRef(null);
  const dots = useRef([]);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initDots = () => {
      dots.current = [];
      const numDots = 100;
      for (let i = 0; i < numDots; i++) {
        dots.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const drawWeb = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.current.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(40, 34, 197, 3)';
        ctx.fill();
      });
      dots.current.forEach((dot1, i) => {
        dots.current.slice(i + 1).forEach(dot2 => {
          const distance = Math.hypot(dot1.x - dot2.x, dot1.y - dot2.y);
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(dot1.x, dot1.y);
            ctx.lineTo(dot2.x, dot2.y);
            const opacity = 1 - (distance / 150);
            ctx.strokeStyle = `rgba(40, 34, 197, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      });
      animationFrameId.current = requestAnimationFrame(drawWeb);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initDots();
    drawWeb();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ opacity: 0.3 }}
    />
  );
};

export default GeometricWeb;
