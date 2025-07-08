import React, { useEffect, useState } from 'react';
import { VoiceCommand } from '../../types';

interface VoiceInterfaceProps {
  isListening: boolean;
  onCommand: (command: VoiceCommand) => void;
  onStateChange: (listening: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  isListening,
  onCommand,
  onStateChange
}) => {
  const [transcript, setTranscript] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  // TODO: Computer 2 - Implement voice recognition
  // This should:
  // - Use Web Speech API for voice input
  // - Parse natural language commands
  // - Handle command confidence levels
  // - Provide visual feedback for voice state
  // - Support commands like:
  //   - "Box driver 1 for softs"
  //   - "Tell both drivers to push"
  //   - "Swap positions"
  //   - "Fuel save mode"

  useEffect(() => {
    // Check if Web Speech API is supported
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const startListening = () => {
    if (!isSupported) return;
    
    onStateChange(true);
    // TODO: Computer 2 - Initialize speech recognition
    console.log('Starting voice recognition...');
  };

  const stopListening = () => {
    onStateChange(false);
    setTranscript('');
    // TODO: Computer 2 - Stop speech recognition
    console.log('Stopping voice recognition...');
  };

  const parseCommand = (text: string): VoiceCommand | null => {
    // TODO: Computer 2 - Implement command parsing logic
    // This should parse natural language into structured commands
    // Example patterns:
    // "box driver 1" -> { type: 'pit-stop', target: 'driver-1' }
    // "push now" -> { type: 'push', target: 'both' }
    // "swap positions" -> { type: 'swap-positions', target: 'both' }
    
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('box') || lowerText.includes('pit')) {
      return {
        id: `cmd-${Date.now()}`,
        type: 'pit-stop',
        target: 'both',
        params: {},
        timestamp: Date.now(),
        confidence: 0.8
      };
    }
    
    if (lowerText.includes('push')) {
      return {
        id: `cmd-${Date.now()}`,
        type: 'push',
        target: 'both',
        params: { intensity: 'medium' },
        timestamp: Date.now(),
        confidence: 0.9
      };
    }
    
    return null;
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    // Space bar to toggle voice input
    if (event.code === 'Space') {
      event.preventDefault();
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    }
  };

  // Mock voice command for testing
  const mockVoiceCommand = () => {
    const mockCommands = [
      'Box both drivers for fresh tyres',
      'Tell driver 1 to push',
      'Swap positions now',
      'Fuel save mode'
    ];
    
    const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
    setTranscript(randomCommand);
    
    setTimeout(() => {
      const command = parseCommand(randomCommand);
      if (command) {
        onCommand(command);
      }
      setTranscript('');
      onStateChange(false);
    }, 1000);
  };

  return (
    <div 
      className="fixed bottom-4 right-4 z-40"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Voice Control Button */}
      <button
        onClick={isListening ? stopListening : (isSupported ? startListening : mockVoiceCommand)}
        className={`w-16 h-16 rounded-full border-4 transition-all duration-300 ${
          isListening 
            ? 'bg-f1-red border-f1-yellow animate-pulse-fast' 
            : 'bg-f1-green border-f1-silver hover:scale-110'
        }`}
        title={isSupported ? 'Click or press Space to talk' : 'Demo Mode - Click to simulate'}
      >
        {isListening ? '🎙️' : '🎤'}
      </button>

      {/* Voice Status Overlay */}
      {isListening && (
        <div className="absolute bottom-20 right-0 bg-pit-wall/95 border border-f1-silver/30 rounded-lg p-4 min-w-64">
          <div className="flex items-center gap-2 mb-2">
            <div className="voice-indicator listening"></div>
            <span className="text-f1-green text-sm font-bold">LISTENING</span>
          </div>
          
          {transcript && (
            <div className="text-f1-silver text-sm mb-2">
              "{transcript}"
            </div>
          )}
          
          {confidence > 0 && (
            <div className="text-xs text-f1-yellow">
              Confidence: {Math.round(confidence * 100)}%
            </div>
          )}
          
          <div className="text-xs text-f1-silver/70 mt-2">
            Say: "Box driver 1", "Push now", "Swap positions"
          </div>
        </div>
      )}

      {/* Voice Commands Help */}
      {!isListening && (
        <div className="absolute bottom-20 right-0 bg-pit-wall/90 border border-f1-silver/20 rounded-lg p-3 text-xs text-f1-silver/70 min-w-48">
          <div className="font-bold mb-1">Voice Commands:</div>
          <div>• "Box [driver] for [tyres]"</div>
          <div>• "Push now / Conserve fuel"</div>
          <div>• "Swap positions"</div>
          <div>• "Tell [driver] to [action]"</div>
          <div className="mt-2 text-f1-yellow">
            Press SPACE or click mic
          </div>
        </div>
      )}

      {/* API Status Indicator */}
      <div className="absolute -top-2 -left-2">
        <div className={`w-4 h-4 rounded-full border-2 border-white/50 ${
          isSupported ? 'bg-f1-green' : 'bg-f1-yellow'
        }`} title={isSupported ? 'Voice API Ready' : 'Demo Mode'}></div>
      </div>
    </div>
  );
};

export default VoiceInterface; 