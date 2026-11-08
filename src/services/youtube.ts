// YouTube IFrame Player API Integration (100% legal, compliant with YouTube Terms of Service)

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: any;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
  }
}

export interface YouTubePlayerCallbacks {
  onReady?: () => void;
  onStateChange?: (state: number) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onError?: (errorCode: number) => void;
}

class YouTubeManager {
  private player: any = null;
  private isApiLoaded = false;
  private isReady = false;
  private timeUpdateInterval: any = null;
  private callbacks: YouTubePlayerCallbacks = {};
  private currentVideoId: string | null = null;
  private pendingVideoId: string | null = null;
  private pendingAutoplay = true;
  private elementId: string = 'youtube-player-host';
  private initRetryCount = 0;
  private watchdogTimer: any = null;

  constructor() {
    this.loadApi();
  }

  private loadApi() {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      this.isApiLoaded = true;
      return;
    }

    // Register global callback before script loads
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousReady) previousReady();
      this.isApiLoaded = true;
      console.log('[YouTube API] Script loaded & API ready');
      if (!this.player) {
        this.createPlayer(this.elementId, this.pendingVideoId || '5yx6BWlEVcY');
      }
    };

    if (!document.getElementById('youtube-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }
  }

  public init(elementId: string, callbacks: YouTubePlayerCallbacks) {
    this.elementId = elementId;
    this.callbacks = callbacks;

    if (this.isApiLoaded && window.YT && window.YT.Player) {
      if (!this.player) {
        this.createPlayer(elementId);
      }
    } else {
      // API script is still loading; poll briefly just in case callback missed
      const checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkInterval);
          this.isApiLoaded = true;
          if (!this.player) {
            this.createPlayer(this.elementId);
          }
        }
      }, 100);

      // Stop polling after 10 seconds
      setTimeout(() => clearInterval(checkInterval), 10000);
    }
  }

  private createPlayer(elementId: string, initialVideoId: string = '5yx6BWlEVcY') {
    if (!window.YT || !window.YT.Player) return;

    const hostElement = document.getElementById(elementId);
    if (!hostElement) {
      if (this.initRetryCount < 30) {
        this.initRetryCount++;
        setTimeout(() => this.createPlayer(elementId, initialVideoId), 150);
      }
      return;
    }

    try {
      this.player = new window.YT.Player(elementId, {
        height: '100%',
        width: '100%',
        videoId: initialVideoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          fs: 1,
        },
        events: {
          onReady: () => {
            console.log('[YouTube Player] Ready event fired');
            this.isReady = true;
            this.startTimeTracker();
            if (this.callbacks.onReady) {
              this.callbacks.onReady();
            }
            if (this.pendingVideoId) {
              const vid = this.pendingVideoId;
              const auto = this.pendingAutoplay;
              this.pendingVideoId = null;
              this.loadVideo(vid, auto);
            }
          },
          onStateChange: (event: any) => {
            if (this.watchdogTimer) {
              clearTimeout(this.watchdogTimer);
              this.watchdogTimer = null;
            }
            if (this.callbacks.onStateChange) {
              this.callbacks.onStateChange(event.data);
            }
          },
          onError: (event: any) => {
            console.warn('[YouTube API Error Event]:', event.data);
            if (this.watchdogTimer) {
              clearTimeout(this.watchdogTimer);
              this.watchdogTimer = null;
            }
            if (this.callbacks.onError) {
              this.callbacks.onError(event.data);
            }
          },
        },
      });
    } catch (err) {
      console.error('Failed to instantiate YouTube Player:', err);
    }
  }

  public loadVideo(videoId: string, autoplay: boolean = true) {
    if (!videoId) return;
    this.currentVideoId = videoId;

    if (!this.isReady || !this.player) {
      this.pendingVideoId = videoId;
      this.pendingAutoplay = autoplay;
      return;
    }

    try {
      if (autoplay) {
        if (typeof this.player.loadVideoById === 'function') {
          this.player.loadVideoById({
            videoId,
            startSeconds: 0,
          });
          // Ensure play is commanded
          if (typeof this.player.playVideo === 'function') {
            this.player.playVideo();
          }
        }
      } else {
        if (typeof this.player.cueVideoById === 'function') {
          this.player.cueVideoById({
            videoId,
            startSeconds: 0,
          });
        }
      }

      // Safeguard watchdog: if YouTube doesn't start or changes state in 4.5 seconds, notify callback
      if (this.watchdogTimer) clearTimeout(this.watchdogTimer);
      this.watchdogTimer = setTimeout(() => {
        if (this.player && typeof this.player.getPlayerState === 'function') {
          const st = this.player.getPlayerState();
          // -1 = unstarted, 3 = buffering, 5 = cued
          if (st === -1 || st === 5) {
            console.log('[YouTube Watchdog] Triggering playVideo fallback for state:', st);
            try {
              this.player.playVideo();
            } catch (e) {}
          } else if (st === 3) {
            console.log('[YouTube Watchdog] Still buffering after timeout');
            // Notify state change or error if needed
          }
        }
      }, 4500);
    } catch (e) {
      console.error('Error loading video by ID:', e);
      if (this.callbacks.onError) {
        this.callbacks.onError(999);
      }
    }
  }

  public play() {
    if (this.player && typeof this.player.playVideo === 'function') {
      try {
        this.player.playVideo();
      } catch (e) {
        console.warn('Play error:', e);
      }
    }
  }

  public pause() {
    if (this.player && typeof this.player.pauseVideo === 'function') {
      try {
        this.player.pauseVideo();
      } catch (e) {
        console.warn('Pause error:', e);
      }
    }
  }

  public seekTo(seconds: number) {
    if (this.player && typeof this.player.seekTo === 'function') {
      try {
        this.player.seekTo(seconds, true);
      } catch (e) {
        console.warn('Seek error:', e);
      }
    }
  }

  public setVolume(volume: number) {
    if (this.player && typeof this.player.setVolume === 'function') {
      try {
        this.player.setVolume(Math.max(0, Math.min(100, volume)));
      } catch (e) {
        console.warn('Volume error:', e);
      }
    }
  }

  public mute() {
    if (this.player && typeof this.player.mute === 'function') {
      try {
        this.player.mute();
      } catch (e) {}
    }
  }

  public unMute() {
    if (this.player && typeof this.player.unMute === 'function') {
      try {
        this.player.unMute();
      } catch (e) {}
    }
  }

  public getCurrentTime(): number {
    if (this.player && typeof this.player.getCurrentTime === 'function') {
      try {
        return this.player.getCurrentTime() || 0;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  }

  public getDuration(): number {
    if (this.player && typeof this.player.getDuration === 'function') {
      try {
        return this.player.getDuration() || 0;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  }

  private startTimeTracker() {
    if (this.timeUpdateInterval) clearInterval(this.timeUpdateInterval);
    this.timeUpdateInterval = setInterval(() => {
      if (this.isReady && this.player && this.callbacks.onTimeUpdate) {
        const current = this.getCurrentTime();
        const dur = this.getDuration();
        this.callbacks.onTimeUpdate(current, dur);
      }
    }, 400);
  }

  public extractYouTubeId(input: string): string | null {
    if (!input) return null;
    const clean = input.trim();
    // Raw 11-char YouTube ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return clean;
    }
    // Standard URL or youtu.be or shorts
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = clean.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    // Shorts URL
    const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch && shortsMatch[1]) {
      return shortsMatch[1];
    }
    return null;
  }

  public destroy() {
    if (this.timeUpdateInterval) clearInterval(this.timeUpdateInterval);
    if (this.watchdogTimer) clearTimeout(this.watchdogTimer);
    if (this.player && typeof this.player.destroy === 'function') {
      try {
        this.player.destroy();
      } catch (e) {}
    }
    this.player = null;
    this.isReady = false;
  }
}

export const youtubeManager = new YouTubeManager();
