/**
 * Sound Engine - Sistema de sonidos para gamificación
 * Usa Web Audio API para generar sonidos sintetizados sin archivos externos
 */

class SoundEngine {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  /**
   * Sonido de completar tarea - Acorde ascendente alegre
   */
  playTaskComplete() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Acorde ascendente C-E-G-C
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.3, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.35);
    });
  }

  /**
   * Sonido de ganar puntos - Tintineo rápido
   */
  playPointsEarned() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.1);
    osc.frequency.linearRampToValueAtTime(1600, now + 0.15);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Sonido de racha (streak) - Sonido épico con reverb
   */
  playStreakSound(streakCount: number) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Base frequency increases with streak
    const baseFreq = 300 + (streakCount * 30);
    
    // Power chord
    const frequencies = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 2.5];
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = i === 0 ? 'sawtooth' : 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15 / (i + 1), now + 0.05);
      gain.gain.setValueAtTime(0.15 / (i + 1), now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.85);
    });

    // Shimmer effect
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(2000, now + 0.1);
    shimmer.frequency.exponentialRampToValueAtTime(4000, now + 0.5);
    shimmerGain.gain.setValueAtTime(0, now + 0.1);
    shimmerGain.gain.linearRampToValueAtTime(0.08, now + 0.2);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    shimmer.start(now + 0.1);
    shimmer.stop(now + 0.75);
  }

  /**
   * Sonido de subir de nivel - Fanfarria épica
   */
  playLevelUp() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Fanfarria: notas ascendentes rápidas
    const melody = [523, 587, 659, 784, 880, 1047, 1175, 1319];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.value = freq;
      const startTime = now + i * 0.06;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
      gain.gain.setValueAtTime(0.12, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });

    // Final chord
    const finalNotes = [1047, 1319, 1568];
    finalNotes.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const startTime = now + 0.5;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);
      osc.start(startTime);
      osc.stop(startTime + 1.3);
    });
  }

  /**
   * Sonido de canjear recompensa - Sonido mágico de monedas
   */
  playRewardRedeem() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Coin sounds
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 1200 + Math.random() * 800;
      const startTime = now + i * 0.07;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    }

    // Magic shimmer
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(3000, now + 0.35);
    shimmer.frequency.exponentialRampToValueAtTime(5000, now + 0.8);
    shimmerGain.gain.setValueAtTime(0, now + 0.35);
    shimmerGain.gain.linearRampToValueAtTime(0.06, now + 0.45);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    shimmer.start(now + 0.35);
    shimmer.stop(now + 0.95);
  }

  /**
   * Sonido de click/tap - Feedback táctil
   */
  playTap() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 600;
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Sonido de error/no se puede
   */
  playError() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.2);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Sonido de combo/multiplicador
   */
  playCombo(comboCount: number) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const baseFreq = 400 + (comboCount * 100);
    
    // Quick ascending arpeggio
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = baseFreq * (1 + i * 0.5);
      const startTime = now + i * 0.04;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    }
  }

  /**
   * Sonido de all tasks complete - Victoria!
   */
  playAllComplete() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Victory fanfare
    const melody = [
      { freq: 784, time: 0 },
      { freq: 784, time: 0.12 },
      { freq: 784, time: 0.24 },
      { freq: 1047, time: 0.4 },
      { freq: 880, time: 0.55 },
      { freq: 988, time: 0.65 },
      { freq: 1047, time: 0.8 },
    ];

    melody.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.value = freq;
      const startTime = now + time;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
      gain.gain.setValueAtTime(0.1, startTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });

    // Final sustained chord
    setTimeout(() => {
      const finalCtx = this.getContext();
      const finalNow = finalCtx.currentTime;
      [1047, 1319, 1568, 2093].forEach((freq) => {
        const osc = finalCtx.createOscillator();
        const gain = finalCtx.createGain();
        osc.connect(gain);
        gain.connect(finalCtx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, finalNow);
        gain.gain.linearRampToValueAtTime(0.12, finalNow + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, finalNow + 1.5);
        osc.start(finalNow);
        osc.stop(finalNow + 1.6);
      });
    }, 950);
  }
}

// Singleton instance
export const soundEngine = new SoundEngine();
