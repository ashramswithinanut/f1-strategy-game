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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    const supported = speechAPI.isSupported();
    setIsSupported(supported);
    
    // Check microphone permission status
    if (supported) {
      checkMicrophonePermission();
    }
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setHasPermission(permission.state === 'granted');
      
      permission.onchange = () => {
        setHasPermission(permission.state === 'granted');
      };
    } catch (error) {
      console.warn('Could not check microphone permission:', error);
      setHasPermission(null);
    }
  };

  const requestPermissionAndStart = async () => {
    if (!isSupported) {
      console.log('Speech API not supported, using mock mode');
      mockVoiceCommand();
      return;
    }

    setError(null);
    setTranscript('');
    
    // Request microphone permission first
    const permissionGranted = await speechAPI.requestMicrophonePermission();
    
    if (!permissionGranted) {
      setError('Microphone access denied. Please allow microphone access in your browser settings.');
      return;
    }

    setHasPermission(true);
    
    const success = speechAPI.startListening(
      (result) => {
        setTranscript(result.transcript);
        setConfidence(result.confidence);
        
        console.log(`[Voice] Received: "${result.transcript}" (final: ${result.isFinal})`);
        
        // Parse final results into commands
        if (result.isFinal) {
          const command = commandParser.parseCommand(result.transcript);
          if (command) {
            console.log('[Voice] Command parsed:', command);
            onCommand(command);
            setTranscript('');
            onStateChange(false);
          } else {
            console.log('[Voice] No command recognized in:', result.transcript);
            setError('Command not recognized. Try: "Box both drivers" or "Push now"');
          }
        }
      },
      (error) => {
        console.error('[Voice] Recognition error:', error);
        setError(error);
        onStateChange(false);
      }
    );
    
    if (success) {
      onStateChange(true);
    } else {
      setError('Failed to start voice recognition');
    }
  };

  const startListening = useCallback(() => {
    requestPermissionAndStart();
  }, [isSupported, onCommand, onStateChange]);

  const stopListening = useCallback(() => {
    speechAPI.stopListening();
    onStateChange(false);
    setTranscript('');
    setConfidence(0);
    setError(null);
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

  const getMicrophoneButtonColor = () => {
    if (isListening) {
      return 'bg-f1-red border-f1-yellow animate-pulse-fast';
    }
    
    if (!isSupported) {
      return 'bg-f1-silver border-f1-silver opacity-50';
    }
    
    if (hasPermission === false) {
      return 'bg-f1-yellow border-f1-red';
    }
    
    return 'bg-f1-green border-f1-silver hover:scale-110';
  };

  const getMicrophoneButtonTitle = () => {
    if (!isSupported) {
      return 'Voice not supported. Using demo mode.';
    }
    
    if (hasPermission === false) {
      return 'Microphone access denied. Click to request permission.';
    }
    
    if (isListening) {
      return 'Click or press Space to stop listening';
    }
    
    return 'Click or press Space to start voice input';
  };

  return (
    <div 
      className="fixed bottom-4 right-4 z-40"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Permission Status Indicator */}
      {hasPermission === false && (
        <div className="absolute bottom-20 right-0 bg-f1-red/90 border border-f1-yellow rounded-lg p-3 text-sm text-white max-w-64">
          <div className="font-bold mb-1">🎤 Microphone Access Required</div>
          <div className="text-xs">
            Please allow microphone access to use voice commands. 
            Click the microphone button to request permission.
          </div>
        </div>
      )}

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
        className={`w-16 h-16 rounded-full border-4 transition-all duration-300 ${getMicrophoneButtonColor()}`}
        title={getMicrophoneButtonTitle()}
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
              {error}
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
            {!isSupported ? 'Demo Mode Only' : 'Press SPACE or click mic'}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInterface; 