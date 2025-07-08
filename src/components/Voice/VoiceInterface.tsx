import React, { useEffect, useState, useCallback } from 'react';
import { VoiceCommand } from '../../types';
import { speechAPI, commandParser } from '../../services/speechAPI';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    setIsSupported(speechAPI.isSupported());
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      console.log('Speech API not supported, using mock mode');
      mockVoiceCommand();
      return;
    }
    
    setError(null);
    setTranscript('');
    
    const success = speechAPI.startListening(
      (result) => {
        setTranscript(result.transcript);
        setConfidence(result.confidence);
        
        // Parse final results into commands
        if (result.isFinal) {
          const command = commandParser.parseCommand(result.transcript);
          if (command) {
            onCommand(command);
            setTranscript('');
            onStateChange(false);
          }
        }
      },
      (error) => {
        setError(error);
        onStateChange(false);
      }
    );
    
    if (success) {
      onStateChange(true);
    }
  }, [isSupported, onCommand, onStateChange]);

  const stopListening = useCallback(() => {
    speechAPI.stopListening();
    onStateChange(false);
    setTranscript('');
    setConfidence(0);
  }, [onStateChange]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    // Space bar to toggle voice input
    if (event.code === 'Space') {
      event.preventDefault();
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    }
  }, [isListening, startListening, stopListening]);

  // Mock voice command for testing/unsupported browsers
  const mockVoiceCommand = useCallback(() => {
    const mockCommands = [
      'Box both drivers for fresh tyres',
      'Tell driver 1 to push',
      'Swap positions now',
      'Fuel save mode',
      'Box driver 2 for soft tyres',
      'Push maximum attack'
    ];
    
    const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
    setTranscript(randomCommand);
    setConfidence(0.85);
    onStateChange(true);
    
    setTimeout(() => {
      const command = commandParser.parseCommand(randomCommand);
      if (command) {
        onCommand(command);
      }
      setTranscript('');
      setConfidence(0);
      onStateChange(false);
    }, 1500);
  }, [onCommand, onStateChange]);

  return (
    <div 
      className="fixed bottom-4 right-4 z-40"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Test TTS Button (Debug) */}
      {!isListening && (
        <div className="fixed bottom-4 left-20 z-30">
          <button
            onClick={() => {
              console.log('Testing TTS system...');
              // Test commentary
              import('../../services/ttsService').then(({ ttsService }) => {
                ttsService.speakCommentary("INCREDIBLE! This is a test of the commentary system!");
              });
              
              // Test driver response after 2 seconds
              setTimeout(() => {
                import('../../services/ttsService').then(({ ttsService }) => {
                  ttsService.speakDriverResponse("Copy that, box box! Coming in hot!", 'driver1');
                });
              }, 2000);
            }}
            className="btn-secondary text-xs"
            title="Test TTS System"
          >
            🔊 Test TTS
          </button>
        </div>
      )}

      {/* Voice Control Button */}
      <button
        onClick={isListening ? stopListening : startListening}
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
          
          {error && (
            <div className="text-xs text-f1-red">
              Error: {error}
            </div>
          )}
          
          <div className="text-xs text-f1-silver/70 mt-2">
            {commandParser.getAvailableCommands().slice(0, 3).map(cmd => (
              <div key={cmd}>• "{cmd}"</div>
            ))}
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