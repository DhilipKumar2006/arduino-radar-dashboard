
import React, { useRef, useEffect } from 'react';
import { RadarPoint } from '../types';

interface RadarDisplayProps {
  angle: number;
  points: RadarPoint[];
  fadeDuration: number;
}

const RadarDisplay: React.FC<RadarDisplayProps> = ({ angle, points, fadeDuration }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const parent = canvas.parentElement;
    if (!parent) return;

    const size = Math.min(parent.clientWidth, parent.clientHeight);
    canvas.width = size;
    canvas.height = size;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = size / 2 * 0.9;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 20, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * (i / 4), 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Draw crosshairs
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY + radius);
    ctx.stroke();

    // Draw sweep line with gradient
    const sweepAngleRad = (angle * Math.PI) / 180;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(0, 255, 0, 0.7)');
    gradient.addColorStop(0.8, 'rgba(0, 255, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(sweepAngleRad);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, -Math.PI / 90, Math.PI / 90); // a thin wedge for the sweep
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();

    // Draw points
    points.forEach(point => {
      const pointAngleRad = (point.angle * Math.PI) / 180;
      const x = centerX + Math.cos(pointAngleRad) * point.distance * radius;
      const y = centerY + Math.sin(pointAngleRad) * point.distance * radius;

      const timeSinceDetection = Date.now() - point.timestamp;
      const opacity = 1 - timeSinceDetection / fadeDuration;

      if (opacity > 0) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(0, 255, 0, ${opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

  }, [angle, points, fadeDuration]);

  return <canvas ref={canvasRef} className="bg-transparent" />;
};

export default RadarDisplay;
