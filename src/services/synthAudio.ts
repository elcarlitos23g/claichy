// Offline Web Audio Engine: Local Audio playback & Offline Harmonic Synth

import { Song } from '../types';

class OfflineAudioEngine {
  private audioCtx: AudioContext | null = null;
  private localAudioElement: HTMLAudioElement | null = null;
  private analyser: AnalyserNode | null = null;
  private synthInterval: any = null;
  private isSynthPlaying = false;
  private currentVolume = 0.8;
  private onTimeUpdateCallback?: (currentTime: number, duration: number) => void;
  private onEndedCallback?: () => void;
  private synthCurrentTime = 0;
  private synthDuration = 180;

  constructor() {
    // Initialized on user interaction
  }

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setCallbacks(
    onTimeUpdate?: (currentTime: number, duration: number) => void,
    onEnded?: () => void
  ) {
    this.onTimeUpdateCallback = onTimeUpdate;
    this.onEndedCallback = onEnded;
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume / 100));
    if (this.localAudioElement) {
      this.localAudioElement.volume = this.currentVolume;
    }
  }

  // Play a local audio blob (MP3/WAV/FLAC)
  public playLocalBlob(blob: Blob, durationHint: number = 0) {
    this.stop();
    this.initContext();

    const url = URL.createObjectURL(blob);
    this.localAudioElement = new Audio(url);
    this.localAudioElement.volume = this.currentVolume;

    // Connect to analyser if audioCtx is available
    if (this.audioCtx && this.analyser) {
      try {
        const source = this.audioCtx.createMediaElementSource(this.localAudioElement);
        source.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
      } catch (e) {
        // Media element might already be connected
      }
    }

    this.localAudioElement.ontimeupdate = () => {
      if (this.localAudioElement && this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(
          this.localAudioElement.currentTime,
          this.localAudioElement.duration || durationHint || 180
        );
      }
    };

    this.localAudioElement.onended = () => {
      if (this.onEndedCallback) {
        this.onEndedCallback();
      }
    };

    this.localAudioElement.play().catch((err) => {
      console.warn('Local audio play error:', err);
    });
  }

  // Play an offline harmonic synth preview matching track musical key & bpm
  public playOfflineSynth(song: Song) {
    this.stop();
    this.initContext();
    if (!this.audioCtx) return;

    this.isSynthPlaying = true;
    this.synthDuration = song.duration || 180;
    this.synthCurrentTime = 0;

    // Musical scale frequencies based on key
    const baseFreqs: Record<string, number[]> = {
      'C': [261.63, 329.63, 392.00, 493.88, 523.25], // C, E, G, B, C
      'Am': [220.00, 261.63, 329.63, 392.00, 440.00], // A, C, E, G, A
      'G': [196.00, 246.94, 293.66, 392.00, 440.00], // G, B, D, G, A
      'Em': [164.81, 196.00, 246.94, 293.66, 329.63], // E, G, B, D, E
      'F': [174.61, 220.00, 261.63, 349.23, 440.00], // F, A, C, F, A
      'Dm': [146.83, 174.61, 220.00, 261.63, 293.66], // D, F, A, C, D
      'default': [220.00, 261.63, 329.63, 392.00, 440.00, 523.25],
    };

    const notes = baseFreqs[song.musicalKey || ''] || baseFreqs['default'];
    const bpm = song.bpm || 100;
    const beatInterval = (60 / bpm) * 1000;
    let step = 0;

    // Time ticker
    const timerInterval = setInterval(() => {
      if (!this.isSynthPlaying) {
        clearInterval(timerInterval);
        return;
      }
      this.synthCurrentTime += 0.5;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.synthCurrentTime, this.synthDuration);
      }
      if (this.synthCurrentTime >= this.synthDuration) {
        this.stop();
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      }
    }, 500);

    // Note player
    this.synthInterval = setInterval(() => {
      if (!this.audioCtx || !this.isSynthPlaying) return;

      const freq = notes[step % notes.length];
      const bassFreq = notes[0] / 2;

      this.triggerTone(freq, 0.4, 'triangle', 0.15 * this.currentVolume);
      if (step % 2 === 0) {
        this.triggerTone(bassFreq, 0.6, 'sine', 0.2 * this.currentVolume);
      }
      step++;
    }, beatInterval);
  }

  private triggerTone(
    freq: number,
    decay: number,
    type: OscillatorType,
    volume: number
  ) {
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        this.audioCtx.currentTime + decay
      );

      osc.connect(gain);
      if (this.analyser) {
        gain.connect(this.analyser);
      }
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + decay);
    } catch (e) {}
  }

  public pause() {
    if (this.localAudioElement) {
      this.localAudioElement.pause();
    }
    this.isSynthPlaying = false;
    if (this.synthInterval) clearInterval(this.synthInterval);
  }

  public resume() {
    if (this.localAudioElement) {
      this.localAudioElement.play();
    }
  }

  public seekTo(seconds: number) {
    if (this.localAudioElement) {
      this.localAudioElement.currentTime = seconds;
    }
    this.synthCurrentTime = seconds;
  }

  public stop() {
    if (this.localAudioElement) {
      this.localAudioElement.pause();
      this.localAudioElement.src = '';
      this.localAudioElement = null;
    }
    this.isSynthPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(16).fill(128);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const offlineAudioEngine = new OfflineAudioEngine();
