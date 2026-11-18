import { useEffect, useRef } from 'react';
import { audioEngine } from '../audio/synthEngine';

interface SpectrumVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

export function SpectrumVisualizer({
  isPlaying,
  barCount = 44,
  className = 'h-16 w-full',
}: SpectrumVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const freqData = new Uint8Array(64);
    let animId = 0;

    const renderFrame = (time: number) => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const active = isPlaying && audioEngine.getFrequencyData(freqData);
      const gap = 3;
      const barWidth = Math.max(2, (width - gap * (barCount - 1)) / barCount);

      for (let i = 0; i < barCount; i++) {
        let normalized = 0.08;
        if (active) {
          const binIndex = Math.min(freqData.length - 1, Math.floor((i / barCount) * 42));
          normalized = Math.max(0.08, freqData[binIndex] / 255);
        } else if (!prefersReducedMotion) {
          // Subtle calm ambient resting curve when paused
          normalized = 0.08 + 0.05 * Math.sin(time * 0.0014 + i * 0.32);
        }

        const barHeight = Math.max(3, normalized * (height - 4));
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        ctx.fillStyle = active ? (i < barCount * 0.42 ? '#3B82F6' : '#FFFFFF') : '#1E293B';
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      ctx.restore();
      if (!prefersReducedMotion) {
        animId = window.requestAnimationFrame(renderFrame);
      }
    };

    animId = window.requestAnimationFrame(renderFrame);
    return () => {
      window.cancelAnimationFrame(animId);
    };
  }, [isPlaying, barCount]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
