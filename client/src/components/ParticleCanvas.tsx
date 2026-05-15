import { useRef, useEffect, useCallback } from "react";
import { Particle, updateParticle, isParticleAlive } from "@/lib/particles";

interface ParticleCanvasProps {
  particles: Particle[];
  onParticlesUpdate: (particles: Particle[]) => void;
}

export default function ParticleCanvas({ particles, onParticlesUpdate }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>(particles);

  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate((particle.rotation * Math.PI) / 180);
    ctx.globalAlpha = particle.opacity;

    switch (particle.type) {
      case 'confetti':
        ctx.fillStyle = particle.color;
        if (particle.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.shape === 'square') {
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -particle.size / 2);
          ctx.lineTo(particle.size / 2, particle.size / 2);
          ctx.lineTo(-particle.size / 2, particle.size / 2);
          ctx.closePath();
          ctx.fill();
        }
        break;

      case 'star':
      case 'sparkle':
        ctx.fillStyle = particle.color;
        drawStar(ctx, 0, 0, 5, particle.size / 2, particle.size / 4);
        break;

      case 'fire':
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.7, particle.color + '80');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'coin':
        // Gold coin with shine
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, particle.size / 2, particle.size / 2 * Math.abs(Math.cos(particle.rotation * 0.05)), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(-particle.size / 6, -particle.size / 6, particle.size / 5, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let updatedParticles = particlesRef.current
      .map(updateParticle)
      .filter(isParticleAlive);

    updatedParticles.forEach(p => drawParticle(ctx, p));

    if (updatedParticles.length !== particlesRef.current.length || updatedParticles.length > 0) {
      particlesRef.current = updatedParticles;
      onParticlesUpdate(updatedParticles);
    }

    if (updatedParticles.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [drawParticle, onParticlesUpdate]);

  useEffect(() => {
    if (particles.length > 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles.length > 0, animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}
