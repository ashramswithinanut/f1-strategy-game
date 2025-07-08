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
    const leaderboardText = raceState.drivers
      .sort((a, b) => a.position - b.position)
      .slice(0, 5)
      .map(d => `P${d.position} ${d.name} (${d.tyreCompound}, ${d.lapTime.toFixed(1)}s)`)
      .join(', ');

    return `You are an EXCITED F1 race commentator like Martin Brundle or David Croft. Current race situation:
    - Lap ${raceState.currentLap} of ${raceState.totalLaps} (${Math.round((raceState.currentLap/raceState.totalLaps)*100)}% complete)
    - Weather: ${raceState.weather} (Track: ${raceState.trackCondition})
    - Current flag: ${raceState.flags}
    - Positions: ${leaderboardText}
    - Recent events: ${events.length > 0 ? events.join(', ') : 'Clean racing'}
    
    Provide EXCITING, emotional commentary with F1 terminology! Use words like "INCREDIBLE", "BRILLIANT", "WHAT A MOVE!", include tire strategy mentions, and reflect the current race drama. 1-2 sentences maximum.`;
  }

  private buildDriverResponsePrompt(
    command: VoiceCommand,
    driverName: string,
    morale: number
  ): string {
    const moraleLevel = morale > 80 ? 'confident and motivated' : morale > 60 ? 'focused but neutral' : 'frustrated and under pressure';
    
    return `You are F1 driver ${driverName} with ${moraleLevel} morale on team radio. 
    Your team principal just commanded "${command.type}". 
    Respond with an authentic F1 driver radio message (max 12 words) using real F1 terminology like "copy", "box box", "push push", "understood", include emotion based on morale level.`;
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
    const playerDrivers = raceState.drivers.filter(d => d.isPlayer);
    const leader = raceState.drivers.find(d => d.position === 1);
    const lapProgress = Math.round((raceState.currentLap / raceState.totalLaps) * 100);
    const recentEvents = raceState.events.slice(-2);
    
    let contextualCommentaries: string[] = [];
    
    // Early race commentary
    if (raceState.currentLap <= 3) {
      contextualCommentaries = [
        "LIGHTS OUT AND AWAY WE GO! The drivers are battling through the opening laps!",
        "INCREDIBLE start to this race! The field is tightly packed and anything can happen!",
        "BRILLIANT racing in these opening stages! Scuderia Tempesta looking strong!",
        "WHAT A START! The drivers are finding their rhythm in these crucial early laps!"
      ];
    }
    // Mid race commentary
    else if (raceState.currentLap <= 7) {
      contextualCommentaries = [
        "The pit window is WIDE OPEN! Strategic decisions will make or break this race!",
        "FASCINATING battle for position! The tyre strategies are starting to play out!",
        "INCREDIBLE pace from the leaders! The championship fight is heating up!",
        `BRILLIANT driving! We're ${lapProgress}% through and the action is non-stop!`
      ];
    }
    // Final laps commentary
    else {
      contextualCommentaries = [
        "FINAL LAPS! This is where champions are made! Every tenth counts!",
        "INCREDIBLE tension! The chequered flag is approaching fast!",
        "WHAT A FINISH we're building up to! The drivers are giving everything!",
        "BRILLIANT final stint! This is why we love Formula 1!"
      ];
    }
    
    // Weather-based commentary
    if (raceState.weather !== 'sunny') {
      contextualCommentaries.push(`CHALLENGING conditions with ${raceState.weather} weather! The drivers are showing their skill!`);
    }
    
    // Event-based commentary
    if (recentEvents.length > 0) {
      const event = recentEvents[recentEvents.length - 1];
      if (event.type === 'crash') {
        contextualCommentaries.push("DRAMA on track! The safety car could change everything!");
      } else if (event.type === 'weather') {
        contextualCommentaries.push("WEATHER CHANGE! The teams are scrambling to adapt their strategies!");
      } else if (event.type === 'pit-stop') {
        contextualCommentaries.push("BRILLIANT pit work! Every second counts in these strategic battles!");
      }
    }
    
    // Position-based commentary
    if (playerDrivers.length > 0) {
      const playerPos = playerDrivers[0].position;
      if (playerPos === 1) {
        contextualCommentaries.push("SCUDERIA TEMPESTA LEADING! What a drive from the team!");
      } else if (playerPos <= 3) {
        contextualCommentaries.push("TEMPESTA in the PODIUM positions! The championship fight is ON!");
      } else {
        contextualCommentaries.push("TEMPESTA fighting hard in the points! Never give up attitude!");
      }
    }
    
    return {
      content: contextualCommentaries[Math.floor(Math.random() * contextualCommentaries.length)],
      confidence: 0.9,
      context: { 
        type: 'contextual-commentary',
        lap: raceState.currentLap,
        weather: raceState.weather,
        events: recentEvents.length
      }
    };
  }

  private getMockDriverResponse(
    command: VoiceCommand,
    driverName: string,
    morale: number
  ): LLMResponse {
    const isDriver1 = driverName.includes('1') || driverName.includes('Alessandro');
    const isVeteran = isDriver1; // Driver 1 is veteran, Driver 2 is rookie
    
    const responses: Record<string, string[]> = {
      'pit-stop': morale > 70 ? [
        "Copy that, box box! Coming in hot!",
        "Understood, pitting now! Let's go!",
        "Box confirmed! Make it snappy guys!",
        "Roger, boxing this lap!"
      ] : [
        "About time! These tyres are done!",
        "Finally! I've been asking for fresh rubber!",
        "Copy, but we're losing time here!",
        "Roger that, needed this pit stop!"
      ],
      
      'push': morale > 70 ? [
        "PUSH PUSH PUSH! I'm on it!",
        "Maximum attack! Let's hunt them down!",
        "Copy, pushing like crazy! Here we go!",
        "Roger! Time to show them what we've got!"
      ] : [
        "I'm giving it everything I've got!",
        "Pushing hard but the car's not there!",
        "Copy, but I need more pace from the car!",
        "Understood, but this is all I have!"
      ],
      
      'conserve': [
        "Understood, lifting and coasting now",
        "Copy, fuel saving mode activated",
        "Roger, backing off to save fuel",
        "Fuel save mode, got it chief"
      ],
      
      'swap-positions': morale > 70 ? [
        "Copy, let him through on the straight",
        "Understood, team comes first",
        "Roger, letting my teammate by",
        "Copy that, moving aside"
      ] : [
        "Really? Fine, letting him past",
        "This better be the right call...",
        "Copy, but I'm not happy about this",
        "Roger... moving over now"
      ],
      
      'defend': [
        "Defending position! No one's getting past!",
        "Copy, I'll hold them off!",
        "Roger, closing every gap!",
        "Understood, making myself wide!"
      ],
      
      'attack': [
        "Going for it now! Here's my chance!",
        "Copy, sending it into turn one!",
        "Roger, it's overtaking time!",
        "Attack mode ON! Let's do this!"
      ],
      
      'radio-check': [
        "Radio check, all good here!",
        "Loud and clear, ready to race!",
        "Copy, radio working perfectly",
        "Roger, receiving you five by five"
      ]
    };
    
    // Add personality differences
    const responseOptions = responses[command.type] || ["Copy that, chief!"];
    let selectedResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];
    
    // Veteran driver (more professional)
    if (isVeteran && Math.random() > 0.5) {
      selectedResponse = selectedResponse.replace(/!/g, '.');
    }
    
    // Rookie driver (more enthusiastic)
    if (!isVeteran && Math.random() > 0.3) {
      selectedResponse = selectedResponse + (Math.random() > 0.5 ? ' Let\'s go!' : ' Yes!');
    }
    
    return {
      content: selectedResponse,
      confidence: 0.9,
      context: { 
        type: 'authentic-driver-response', 
        driver: driverName,
        morale: morale,
        isVeteran: isVeteran
      }
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