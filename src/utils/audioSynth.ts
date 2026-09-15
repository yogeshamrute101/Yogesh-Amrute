/**
 * Web Audio Procedural Synthesizer for Background Music
 * Provides 100% reliable, zero-latency royalty-free beats
 * (Lo-Fi Chill, Cyberpunk Phonk, Cinematic Beats)
 */

class BackgroundAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private tempo = 90; // BPM
  private beatCount = 0;
  private masterGain: GainNode | null = null;
  private destinationNode: MediaStreamAudioDestinationNode | null = null;
  private genre: 'phonk' | 'lofi' | 'cinematic' | 'ambient' = 'lofi';

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5;
      this.destinationNode = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.connect(this.destinationNode);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAudioStreamDestination(): MediaStreamAudioDestinationNode | null {
    this.init();
    return this.destinationNode;
  }

  public setGenre(genre: 'phonk' | 'lofi' | 'cinematic' | 'ambient') {
    this.genre = genre;
    if (genre === 'phonk') this.tempo = 130;
    else if (genre === 'lofi') this.tempo = 82;
    else if (genre === 'cinematic') this.tempo = 72;
    else this.tempo = 65;
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.beatCount = 0;
    this.scheduleBeat();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private scheduleBeat() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const time = this.ctx.currentTime + 0.05;
    const step = this.beatCount % 16;

    // Drum sequence
    if (this.genre === 'phonk') {
      // Hard phonk kick on 0, 4, 8, 12 + cowbell
      if (step === 0 || step === 8 || step === 11) {
        this.playKick(time, 140, 40, 0.2);
      }
      if (step === 4 || step === 12) {
        this.playSnare(time, 0.15);
      }
      if (step % 2 === 0) {
        this.playHiHat(time, 0.05, 0.04);
      }
      // Phonk synth note
      if (step === 0 || step === 3 || step === 6 || step === 10 || step === 14) {
        const notes = [220, 246.94, 261.63, 293.66, 329.63];
        const freq = notes[Math.floor(Math.random() * notes.length)];
        this.playPhonkCowbell(time, freq);
      }
    } else if (this.genre === 'lofi') {
      // Warm Lo-Fi beat
      if (step === 0 || step === 6 || step === 10) {
        this.playKick(time, 90, 45, 0.25);
      }
      if (step === 4 || step === 12) {
        this.playSnare(time, 0.2);
      }
      if (step % 2 === 0) {
        this.playHiHat(time, 0.04, 0.03);
      }
      // Electric piano chords
      if (step === 0 || step === 8) {
        const chords = [
          [261.63, 329.63, 392.0, 493.88], // Cmaj7
          [220.0, 261.63, 329.63, 392.0],   // Am7
          [174.61, 220.0, 261.63, 329.63], // Fmaj7
          [196.0, 246.94, 293.66, 349.23], // G7
        ];
        const chord = chords[Math.floor((this.beatCount / 16) % chords.length)];
        chord.forEach((freq, idx) => {
          this.playWarmChordNote(time + idx * 0.02, freq);
        });
      }
    } else if (this.genre === 'cinematic') {
      // Heavy cinematic drum hit & sub pulse
      if (step === 0) {
        this.playKick(time, 80, 25, 0.6);
      }
      if (step === 8) {
        this.playSnare(time, 0.4);
      }
      if (step === 0 || step === 8) {
        this.playCinematicPad(time, step === 0 ? 110 : 130.81);
      }
    } else {
      // Ambient
      if (step === 0 || step === 8) {
        this.playCinematicPad(time, 174.61);
      }
    }

    this.beatCount++;
    const intervalMs = (60 / this.tempo / 4) * 1000;
    this.timer = window.setTimeout(() => this.scheduleBeat(), intervalMs);
  }

  private playKick(time: number, startFreq: number, endFreq: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + duration);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playSnare(time: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    // Noise buffer
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
  }

  private playHiHat(time: number, duration: number, gainLevel: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
  }

  private playWarmChordNote(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 1.2);
  }

  private playPhonkCowbell(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'square';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.5, time);

    filter.type = 'bandpass';
    filter.frequency.value = freq * 1.2;
    filter.Q.value = 4;

    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.35);
    osc2.stop(time + 0.35);
  }

  private playCinematicPad(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, time);
    filter.frequency.linearRampToValueAtTime(600, time + 1.5);
    filter.frequency.linearRampToValueAtTime(200, time + 3.0);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.18, time + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 3.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 3.0);
  }

  /**
   * Procedural Sound Effects Engine (Zero external files, zero latency)
   */
  public playSfx(type: 'whoosh' | 'pop' | 'glitch' | 'flash' | 'bass_drop' | 'camera' | 'ding') {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    if (type === 'whoosh') {
      // Clean dynamic air whoosh
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.28);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 3;
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.14);
      filter.frequency.exponentialRampToValueAtTime(350, now + 0.28);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
    } else if (type === 'pop') {
      // Snappy bubble / viral sticker pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'glitch') {
      // Cyber glitch burst
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(450, now + 0.03);
      osc.frequency.setValueAtTime(120, now + 0.07);
      osc.frequency.setValueAtTime(800, now + 0.11);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'flash') {
      // Cinematic white flash impact
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'bass_drop') {
      // Deep 808 sub boom
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.6);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'camera') {
      // High-resolution camera click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'ding') {
      // High-clarity chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now); // A6
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.7);
    }
  }

  public playTransitionSfx(transition: string) {
    if (transition === 'zoom_in') this.playSfx('whoosh');
    else if (transition === 'slide_left') this.playSfx('whoosh');
    else if (transition === 'glitch') this.playSfx('glitch');
    else if (transition === 'flash') this.playSfx('flash');
    else if (transition === 'fade' || transition === 'dissolve') this.playSfx('ding');
  }
}

export const bgAudioEngine = new BackgroundAudioEngine();
