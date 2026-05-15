/**
 * Particle System - Sistema de partículas para celebraciones
 * Genera confetti, estrellas, fuego y otros efectos visuales
 */

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
  type: 'confetti' | 'star' | 'fire' | 'sparkle' | 'coin';
  shape?: 'circle' | 'square' | 'triangle' | 'star';
}

export function createConfettiParticles(count: number, originX: number, originY: number): Particle[] {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F1948A', '#82E0AA'];
  const shapes: Particle['shape'][] = ['circle', 'square', 'triangle'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `confetti-${Date.now()}-${i}`,
    x: originX + (Math.random() - 0.5) * 40,
    y: originY,
    vx: (Math.random() - 0.5) * 15,
    vy: -(Math.random() * 12 + 5),
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 15,
    opacity: 1,
    life: 0,
    maxLife: 60 + Math.random() * 40,
    type: 'confetti' as const,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
  }));
}

export function createStarParticles(count: number, originX: number, originY: number): Particle[] {
  const colors = ['#FFD700', '#FFA500', '#FF6347', '#FFFF00', '#FF69B4'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `star-${Date.now()}-${i}`,
    x: originX + (Math.random() - 0.5) * 60,
    y: originY + (Math.random() - 0.5) * 60,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.5) * 6,
    size: Math.random() * 12 + 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 8,
    opacity: 1,
    life: 0,
    maxLife: 40 + Math.random() * 30,
    type: 'star' as const,
    shape: 'star' as const,
  }));
}

export function createFireParticles(count: number, originX: number, originY: number): Particle[] {
  const colors = ['#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FFA500', '#FF0000'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `fire-${Date.now()}-${i}`,
    x: originX + (Math.random() - 0.5) * 20,
    y: originY,
    vx: (Math.random() - 0.5) * 3,
    vy: -(Math.random() * 4 + 2),
    size: Math.random() * 10 + 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: 0,
    rotationSpeed: 0,
    opacity: 1,
    life: 0,
    maxLife: 25 + Math.random() * 15,
    type: 'fire' as const,
    shape: 'circle' as const,
  }));
}

export function createSparkleParticles(count: number, originX: number, originY: number): Particle[] {
  const colors = ['#FFFFFF', '#FFD700', '#87CEEB', '#DDA0DD', '#98FB98'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `sparkle-${Date.now()}-${i}`,
    x: originX + (Math.random() - 0.5) * 100,
    y: originY + (Math.random() - 0.5) * 100,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: Math.random() * 6 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 20,
    opacity: 1,
    life: 0,
    maxLife: 30 + Math.random() * 20,
    type: 'sparkle' as const,
    shape: 'star' as const,
  }));
}

export function createCoinParticles(count: number, originX: number, originY: number): Particle[] {
  const colors = ['#FFD700', '#FFC107', '#FF9800', '#FFEB3B'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `coin-${Date.now()}-${i}`,
    x: originX + (Math.random() - 0.5) * 30,
    y: originY,
    vx: (Math.random() - 0.5) * 8,
    vy: -(Math.random() * 8 + 3),
    size: Math.random() * 8 + 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 12,
    opacity: 1,
    life: 0,
    maxLife: 50 + Math.random() * 20,
    type: 'coin' as const,
    shape: 'circle' as const,
  }));
}

export function updateParticle(particle: Particle): Particle {
  const gravity = particle.type === 'fire' ? -0.05 : 0.3;
  const drag = particle.type === 'sparkle' ? 0.98 : 0.99;
  
  return {
    ...particle,
    x: particle.x + particle.vx,
    y: particle.y + particle.vy,
    vx: particle.vx * drag,
    vy: (particle.vy + gravity) * drag,
    rotation: particle.rotation + particle.rotationSpeed,
    opacity: Math.max(0, 1 - (particle.life / particle.maxLife)),
    life: particle.life + 1,
  };
}

export function isParticleAlive(particle: Particle): boolean {
  return particle.life < particle.maxLife;
}
