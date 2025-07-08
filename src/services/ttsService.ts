import { TTSRequest, AudioSpeaker } from '../types';

export class TTSService {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private isEnabled: boolean = true;
  private currentQueue: SpeechSynthesisUtterance[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    
    // Update voices when they change
    this.synthesis.addEventListener('voiceschanged', () => {
      this.loadVoices();
    });
  }

  private loadVoices(): void {
    this.voices = this.synthesis.getVoices();
  }

  private getVoiceForSpeaker(speaker: AudioSpeaker): SpeechSynthesisVoice | null {
    // Voice preferences for different speakers
    const voicePreferences: Record<AudioSpeaker, string[]> = {
      'commentator': ['Google UK English Male', 'Microsoft David', 'Daniel (Enhanced)', 'Alex', 'Google UK English'],
      'driver1': ['Microsoft Mark', 'Google US English Male', 'Daniel', 'Tom', 'Ralph'],
      'driver2': ['Google US English', 'Microsoft Zira', 'Samantha', 'Karen', 'Victoria'],
      'engineer': ['Google UK English Female', 'Microsoft Hazel', 'Victoria', 'Samantha', 'Fiona'],
      'pit-crew': ['Google US English', 'Microsoft Ryan', 'Tom', 'Ralph', 'Alex'],
      'race-director': ['Microsoft Paul', 'Google UK English Male', 'Daniel', 'Alex', 'George']
    };

    const preferences = voicePreferences[speaker] || ['Google UK English Male'];
    
    for (const pref of preferences) {
      const voice = this.voices.find(v => v.name.includes(pref));
      if (voice) return voice;
    }
    
    // Fallback to any English voice
    return this.voices.find(v => v.lang.startsWith('en')) || this.voices[0] || null;
  }

  public speak(request: TTSRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isEnabled || !this.synthesis) {
        console.log('TTS not enabled or not supported');
        resolve();
        return;
      }

      // Cancel current speech if high priority
      if (request.priority > 7) {
        this.synthesis.cancel();
        this.currentQueue = [];
      }

      const utterance = new SpeechSynthesisUtterance(request.text);
      
      // Set voice based on speaker
      const voice = this.getVoiceForSpeaker(request.voice);
      if (voice) {
        utterance.voice = voice;
        console.log(`Speaking with voice: ${voice.name} for ${request.voice}`);
      } else {
        console.log(`No voice found for ${request.voice}, using default`);
      }

      // Configure speech parameters based on speaker
      switch (request.voice) {
        case 'commentator':
          utterance.rate = 1.3;     // Faster for excitement
          utterance.pitch = 1.1;    // Higher pitch for energy
          utterance.volume = 1.0;   // Full volume
          break;
        case 'driver1':
          utterance.rate = 1.1;     // Slightly faster
          utterance.pitch = 1.2;    // Higher pitch for radio effect
          utterance.volume = 0.9;   // Slightly lower for radio
          break;
        case 'driver2':
          utterance.rate = 1.2;     // Faster for rookie enthusiasm
          utterance.pitch = 1.3;    // Higher pitch for younger driver
          utterance.volume = 0.9;   // Radio volume
          break;
        case 'engineer':
          utterance.rate = 0.9;     // Slower and measured
          utterance.pitch = 0.9;    // Lower pitch for authority
          utterance.volume = 0.8;   // Professional volume
          break;
        case 'pit-crew':
          utterance.rate = 1.3;     // Fast for urgency
          utterance.pitch = 1.0;    // Normal pitch
          utterance.volume = 0.9;   // Urgent volume
          break;
        case 'race-director':
          utterance.rate = 0.8;     // Slow and authoritative
          utterance.pitch = 0.8;    // Low pitch for authority
          utterance.volume = 1.0;   // Full volume for commands
          break;
      }

      utterance.onend = () => {
        this.currentQueue = this.currentQueue.filter(u => u !== utterance);
        console.log(`Finished speaking: "${request.text}"`);
        resolve();
      };

      utterance.onerror = (error) => {
        console.error('TTS Error:', error);
        reject(error);
      };

      utterance.onstart = () => {
        console.log(`Started speaking: "${request.text}" with ${request.voice}`);
      };

      this.currentQueue.push(utterance);
      this.synthesis.speak(utterance);
    });
  }

  public speakCommentary(text: string): Promise<void> {
    console.log(`Speaking commentary: "${text}"`);
    return this.speak({
      text,
      voice: 'commentator',
      priority: 5
    });
  }

  public speakDriverResponse(text: string, driver: 'driver1' | 'driver2'): Promise<void> {
    console.log(`Speaking driver response from ${driver}: "${text}"`);
    return this.speak({
      text,
      voice: driver,
      priority: 8
    });
  }

  public speakEngineerMessage(text: string): Promise<void> {
    console.log(`Speaking engineer message: "${text}"`);
    return this.speak({
      text,
      voice: 'engineer',
      priority: 6
    });
  }

  public speakRaceDirection(text: string): Promise<void> {
    return this.speak({
      text,
      voice: 'race-director',
      priority: 9
    });
  }

  public stopSpeaking(): void {
    this.synthesis.cancel();
    this.currentQueue = [];
  }

  public pauseSpeaking(): void {
    this.synthesis.pause();
  }

  public resumeSpeaking(): void {
    this.synthesis.resume();
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopSpeaking();
    }
  }

  public isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

// Export singleton instance
export const ttsService = new TTSService(); 