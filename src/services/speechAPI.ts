import { VoiceCommand, TyreCompound } from '../types';

interface SpeechRecognitionConfig {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export class SpeechAPI {
  private recognition: any;
  private isListening: boolean = false;
  private onResult: ((result: SpeechRecognitionResult) => void) | null = null;
  private onError: ((error: string) => void) | null = null;

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence || 0.8;
      
      console.log(`[Speech] Result: "${transcript}" (confidence: ${confidence})`);
      
      if (this.onResult) {
        this.onResult({
          transcript,
          confidence,
          isFinal: result.isFinal
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = 'Speech recognition error';
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your audio settings.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      if (this.onError) {
        this.onError(errorMessage);
      }
    };

    this.recognition.onend = () => {
      console.log('[Speech] Recognition ended');
      this.isListening = false;
    };

    this.recognition.onstart = () => {
      console.log('[Speech] Recognition started');
      this.isListening = true;
    };
  }

  public async requestMicrophonePermission(): Promise<boolean> {
    try {
      // Request microphone permission explicitly
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Stop the stream immediately, we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      console.log('[Speech] Microphone permission granted');
      return true;
    } catch (error) {
      console.error('[Speech] Microphone permission denied:', error);
      return false;
    }
  }

  public startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      console.error('Speech recognition not available');
      if (onError) {
        onError('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      }
      return false;
    }

    if (this.isListening) {
      console.warn('Already listening');
      return false;
    }

    this.onResult = onResult;
    this.onError = onError || null;

    try {
      console.log('[Speech] Starting recognition...');
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      if (onError) {
        onError(`Failed to start speech recognition: ${error}`);
      }
      return false;
    }
  }

  public stopListening(): void {
    if (!this.recognition || !this.isListening) {
      return;
    }

    console.log('[Speech] Stopping recognition...');
    this.recognition.stop();
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
  }

  public isSupported(): boolean {
    return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

// Command parsing utilities
export class CommandParser {
  private commandPatterns: Record<string, RegExp[]> = {
    'pit-stop': [
      /(?:box|pit)\s+(?:driver\s+)?([12]|both)/i,
      /(?:box|pit)\s+(?:for\s+)?(\w+)\s+(?:tyres?|tires?)/i,
      /(?:box|pit)\s+(?:driver\s+)?([12]|both)\s+(?:for\s+)?(\w+)/i
    ],
    'push': [
      /(?:push|attack|go\s+faster)/i,
      /(?:tell|ask)\s+(?:driver\s+)?([12]|both)\s+to\s+push/i,
      /(?:driver\s+)?([12]|both)\s+push\s+(?:now|hard)/i
    ],
    'conserve': [
      /(?:conserve|save|fuel\s+save)/i,
      /(?:lift\s+and\s+coast|save\s+fuel)/i
    ],
    'swap-positions': [
      /(?:swap|switch)\s+positions/i,
      /(?:let\s+)?(?:driver\s+)?([12])\s+(?:pass|through)/i
    ],
    'defend': [
      /(?:defend|hold\s+position)/i,
      /(?:driver\s+)?([12])\s+defend/i
    ],
    'radio-check': [
      /(?:radio\s+check|how\s+are\s+you)/i,
      /(?:driver\s+)?([12])\s+(?:radio\s+check|status)/i
    ]
  };

  public parseCommand(transcript: string): VoiceCommand | null {
    // TODO: Computer 2 - Implement sophisticated command parsing
    // This should:
    // - Use regex patterns to match common commands
    // - Extract parameters (driver numbers, tyre types, etc.)
    // - Handle natural language variations
    // - Return structured command objects
    
    const lowerTranscript = transcript.toLowerCase().trim();
    
    for (const [commandType, patterns] of Object.entries(this.commandPatterns)) {
      for (const pattern of patterns) {
        const match = lowerTranscript.match(pattern);
        if (match) {
          return this.buildCommand(commandType, match, transcript);
        }
      }
    }
    
    return null;
  }

  private buildCommand(
    type: string,
    match: RegExpMatchArray,
    originalTranscript: string
  ): VoiceCommand {
    const command: VoiceCommand = {
      id: `cmd-${Date.now()}`,
      type: type as any,
      target: 'both', // Default to both, will be overridden if specific driver mentioned
      params: {},
      timestamp: Date.now(),
      confidence: 0.8
    };

    // Extract driver target - be more specific about parsing
    if (match[1]) {
      const driverMatch = match[1].toLowerCase();
      console.log('[CommandParser] Driver match found:', driverMatch);
      
      if (driverMatch === '1') {
        command.target = 'driver-1';
        console.log('[CommandParser] Set target to driver-1');
      } else if (driverMatch === '2') {
        command.target = 'driver-2';
        console.log('[CommandParser] Set target to driver-2');
      } else if (driverMatch === 'both') {
        command.target = 'both';
        console.log('[CommandParser] Set target to both');
      }
    }

    // For commands without specific driver mention, check if they should default to both
    if (!match[1] && ['push', 'conserve', 'defend', 'attack'].includes(type)) {
      command.target = 'both';
      console.log('[CommandParser] No driver specified, defaulting to both for:', type);
    }

    // Extract additional parameters based on command type
    switch (type) {
      case 'pit-stop':
        if (match[2]) {
          const tyreType = match[2].toLowerCase();
          if (['soft', 'medium', 'hard', 'intermediate', 'wet'].includes(tyreType)) {
            command.params.tyreCompound = tyreType === 'intermediate' ? 'intermediate' : tyreType as TyreCompound;
          }
        }
        break;
      
      case 'push':
        command.params.intensity = 'medium';
        if (originalTranscript.includes('hard') || originalTranscript.includes('maximum')) {
          command.params.intensity = 'maximum';
        }
        break;
    }

    console.log('[CommandParser] Final command:', command);
    return command;
  }

  public getAvailableCommands(): string[] {
    return [
      'Box driver 1 for soft tyres',
      'Box both drivers',
      'Tell driver 2 to push',
      'Push now',
      'Conserve fuel',
      'Swap positions',
      'Defend position',
      'Radio check'
    ];
  }
}

// Export singleton instances
export const speechAPI = new SpeechAPI();
export const commandParser = new CommandParser(); 