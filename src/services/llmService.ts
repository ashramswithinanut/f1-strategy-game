import { LLMResponse, RaceState, VoiceCommand, AudioEvent } from '../types';

interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export class LLMService {
  private config: OpenAIConfig;
  private isEnabled: boolean = false;

  constructor() {
    this.config = {
      apiKey: (typeof process !== 'undefined' && process.env?.OPENAI_API_KEY) || '',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 150
    };
    
    this.isEnabled = !!this.config.apiKey;
  }

  public async generateCommentary(
    raceState: RaceState,
    recentEvents: string[]
  ): Promise<LLMResponse> {
    // TODO: Computer 2 - Implement dynamic race commentary
    // This should:
    // - Generate natural F1 commentary based on race state
    // - React to recent events and race positions
    // - Maintain appropriate tone and F1 terminology
    // - Create excitement and tension
    
    if (!this.isEnabled) {
      return this.getMockCommentary(raceState);
    }

    const prompt = this.buildCommentaryPrompt(raceState, recentEvents);
    
    try {
      const response = await this.callOpenAI(prompt, {
        temperature: 0.8,
        maxTokens: 100
      });
      
      return {
        content: response,
        confidence: 0.9,
        context: { type: 'commentary', lap: raceState.currentLap }
      };
    } catch (error) {
      console.error('LLM Commentary Error:', error);
      return this.getMockCommentary(raceState);
    }
  }

  public async generateDriverResponse(
    command: VoiceCommand,
    driverName: string,
    driverMorale: number
  ): Promise<LLMResponse> {
    // TODO: Computer 2 - Implement driver radio responses
    // This should:
    // - Generate authentic driver responses to team commands
    // - Consider driver morale and personality
    // - Use appropriate F1 radio terminology
    // - Show driver emotion and reaction
    
    if (!this.isEnabled) {
      return this.getMockDriverResponse(command, driverName, driverMorale);
    }

    const prompt = this.buildDriverResponsePrompt(command, driverName, driverMorale);
    
    try {
      const response = await this.callOpenAI(prompt, {
        temperature: 0.9,
        maxTokens: 50
      });
      
      return {
        content: response,
        confidence: 0.85,
        context: { type: 'driver-radio', driver: driverName }
      };
    } catch (error) {
      console.error('LLM Driver Response Error:', error);
      return this.getMockDriverResponse(command, driverName, driverMorale);
    }
  }

  public async generateStrategySuggestion(
    raceState: RaceState,
    weatherForecast: any[]
  ): Promise<LLMResponse> {
    // TODO: Computer 2 - Implement strategic AI suggestions
    // This should:
    // - Analyze current race situation
    // - Consider weather and track conditions
    // - Suggest optimal strategies
    // - Provide reasoning for suggestions
    
    if (!this.isEnabled) {
      return this.getMockStrategySuggestion(raceState);
    }

    const prompt = this.buildStrategyPrompt(raceState, weatherForecast);
    
    try {
      const response = await this.callOpenAI(prompt, {
        temperature: 0.6,
        maxTokens: 120
      });
      
      return {
        content: response,
        confidence: 0.8,
        suggestions: ['Consider pit window', 'Monitor weather'],
        context: { type: 'strategy', lap: raceState.currentLap }
      };
    } catch (error) {
      console.error('LLM Strategy Error:', error);
      return this.getMockStrategySuggestion(raceState);
    }
  }

  private async callOpenAI(
    prompt: string,
    options: { temperature: number; maxTokens: number }
  ): Promise<string> {
    // TODO: Computer 2 - Implement OpenAI API integration
    // This should:
    // - Make HTTP requests to OpenAI API
    // - Handle authentication
    // - Parse responses
    // - Handle errors and retries
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature,
        max_tokens: options.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  private buildCommentaryPrompt(raceState: RaceState, events: string[]): string {
    return `You are an F1 race commentator. Current situation:
    - Lap ${raceState.currentLap}/${raceState.totalLaps}
    - Weather: ${raceState.weather}
    - Recent events: ${events.join(', ')}
    - Leading positions: ${raceState.drivers.slice(0, 3).map(d => `P${d.position} ${d.name}`).join(', ')}
    
    Provide exciting 1-2 sentence commentary about the current race situation.`;
  }

  private buildDriverResponsePrompt(
    command: VoiceCommand,
    driverName: string,
    morale: number
  ): string {
    const moraleLevel = morale > 80 ? 'confident' : morale > 60 ? 'neutral' : 'frustrated';
    
    return `You are F1 driver ${driverName} with ${moraleLevel} morale. 
    Your team principal just told you to "${command.type}". 
    Respond with a short, authentic F1 driver radio message (max 10 words).`;
  }

  private buildStrategyPrompt(raceState: RaceState, forecast: any[]): string {
    return `You are an F1 race strategist. Current situation:
    - Lap ${raceState.currentLap}/${raceState.totalLaps}
    - Weather: ${raceState.weather}
    - Your drivers in P${raceState.drivers.find(d => d.isPlayer)?.position}
    
    Suggest optimal strategy for next 5 laps (max 2 sentences).`;
  }

  // Mock responses for development/fallback
  private getMockCommentary(raceState: RaceState): LLMResponse {
    const mockCommentaries = [
      "The battle for position is heating up as we approach the halfway mark!",
      "Scuderia Tempesta is showing real pace in these challenging conditions.",
      "The drivers are pushing hard as the pit window approaches.",
      "What a fantastic display of wheel-to-wheel racing we're seeing today!",
      "The weather could be a game-changer in these final laps."
    ];
    
    return {
      content: mockCommentaries[Math.floor(Math.random() * mockCommentaries.length)],
      confidence: 0.7,
      context: { type: 'mock-commentary' }
    };
  }

  private getMockDriverResponse(
    command: VoiceCommand,
    driverName: string,
    morale: number
  ): LLMResponse {
    const responses: Record<string, string> = {
      'pit-stop': morale > 70 ? "Copy that, box box!" : "About time, needed fresh rubber!",
      'push': morale > 70 ? "Pushing now, let's go!" : "I'm giving it everything!",
      'conserve': "Understood, lifting and coasting",
      'swap-positions': morale > 70 ? "Copy, let him through" : "Really? Fine, letting him by",
      'defend': "Defending position, no one's getting past!",
      'attack': "Going for it now!",
      'tyre-change': "Copy, what compound?",
      'fuel-save': "Fuel saving mode activated",
      'radio-check': "Radio check, all good here"
    };
    
    return {
      content: responses[command.type] || "Copy that, chief!",
      confidence: 0.8,
      context: { type: 'mock-driver-response', driver: driverName }
    };
  }

  private getMockStrategySuggestion(raceState: RaceState): LLMResponse {
    const suggestions = [
      "Consider pitting in the next 3 laps for optimal strategy.",
      "Weather looks stable, stick with current tyre compound.",
      "Gap to leader is closing, time to push harder.",
      "Fuel looks good, you can afford to push for a few more laps.",
      "Tyre degradation is showing, consider switching to harder compound."
    ];
    
    return {
      content: suggestions[Math.floor(Math.random() * suggestions.length)],
      confidence: 0.6,
      suggestions: ['Monitor weather', 'Check tyre temps'],
      context: { type: 'mock-strategy' }
    };
  }

  public isAPIEnabled(): boolean {
    return this.isEnabled;
  }
}

// Export singleton instance
export const llmService = new LLMService(); 