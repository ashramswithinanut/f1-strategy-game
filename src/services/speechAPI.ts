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
    // TODO: Computer 2 - Initialize Web Speech API
    // Check for browser support and create recognition instance
    this.initializeRecognition();
  }

  private initializeRecognition() {
    // TODO: Computer 2 - Implement speech recognition initialization
    // This should:
    // - Check for webkitSpeechRecognition or SpeechRecognition support
    // - Set up event handlers
    // - Configure recognition parameters
    
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
      // TODO: Computer 2 - Process speech recognition results
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;
      
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
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  public startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      console.error('Speech recognition not available');
      return false;
    }

    if (this.isListening) {
      console.warn('Already listening');
      return false;
    }

    this.onResult = onResult;
    this.onError = onError || null;

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }

  public stopListening(): void {
    if (!this.recognition || !this.isListening) {
      return;
    }

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
      target: 'both',
      params: {},
      timestamp: Date.now(),
      confidence: 0.8
    };

    // Extract driver target
    if (match[1]) {
      const driverMatch = match[1].toLowerCase();
      if (driverMatch === '1') {
        command.target = 'driver-1';
      } else if (driverMatch === '2') {
        command.target = 'driver-2';
      } else if (driverMatch === 'both') {
        command.target = 'both';
      }
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