class AudioService {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    // Initialized on user interaction
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(frequency: number, type: 'sine' | 'sawtooth' | 'triangle' = 'sawtooth', duration: number = 0.5) {
    this.init();
    if (!this.ctx || !this.gainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain(); // Local gain for envelope

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    // Filter to make it sound a bit more string-like
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 3, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    // Envelope (Attack, Decay)
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05); // Attack
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Release

    osc.start(now);
    osc.stop(now + duration);
  }

  playSuccess() {
    this.playTone(523.25, 'sine', 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.2), 100); // E5
  }

  playError() {
    this.playTone(150, 'sawtooth', 0.3);
  }
}

export const audioService = new AudioService();