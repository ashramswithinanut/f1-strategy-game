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
        "BRILLIANT racing in these opening stages! Scuderia Volley looking strong!",
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
        contextualCommentaries.push("SCUDERIA VOLLEY LEADING! What a drive from the team!");
      } else if (playerPos <= 3) {
        contextualCommentaries.push("VOLLEY in the PODIUM positions! The championship fight is ON!");
      } else {
        contextualCommentaries.push("VOLLEY fighting hard in the points! Never give up attitude!");
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
    const isMarcoRossi = driverName.includes('Marco') || driverName.includes('Rossi') || driverName.includes('driver-1');
    const isAlexThunder = driverName.includes('Alex') || driverName.includes('Thunder') || driverName.includes('driver-2');
    
    // Marco Rossi - Veteran driver with something to prove
    const marcoResponses: Record<string, string[]> = {
      'pit-stop': morale > 70 ? [
        "Copy that. Let's make this count, I need those points!",
        "Box confirmed. Time to show them what experience brings!",
        "Roger, pitting now. We've got a championship to win!",
        "Copy. I've done this a thousand times - let's go!"
      ] : [
        "About time! I've been telling you these tyres are finished!",
        "Finally! I know when a pit stop is needed!",
        "Copy, but we should have done this laps ago!",
        "Roger... I hope this strategy works out!"
      ],
      
      'push': morale > 70 ? [
        "Maximum attack! Time to remind them who I am!",
        "Copy, pushing now! I didn't come here to settle!",
        "Roger! Let's show them veteran class!",
        "Understood! I've got unfinished business out here!"
      ] : [
        "I'm giving everything but the car's not responding!",
        "Copy, pushing hard but I need more from this machine!",
        "Roger, but this isn't the pace I'm used to!",
        "Understood, but I know I can do better than this!"
      ],
      
      'conserve': [
        "Copy, fuel saving. I know how to manage a race.",
        "Roger, lifting and coasting. Experience talking here.",
        "Understood, backing off. Trust the process.",
        "Copy that. I've won races with fuel management."
      ],
      
      'swap-positions': morale > 70 ? [
        "Copy, letting him through. Team first, always.",
        "Roger, moving aside. I respect the team decision.",
        "Understood, letting my teammate by. Professional choice.",
        "Copy that. I know when to be a team player."
      ] : [
        "Really? After all I've done? Fine, letting him past.",
        "This better be the right call... moving over now.",
        "Copy, but I'm not happy about this decision.",
        "Roger... I hope you know what you're doing."
      ],
      
      'defend': [
        "Defending position! I didn't get here by giving up!",
        "Copy, holding them off! Experience counts here!",
        "Roger, using all my racecraft to defend!",
        "Understood! They'll have to earn it past me!"
      ],
      
      'attack': [
        "Attack mode! Time to show them what I'm made of!",
        "Copy, going for it! I didn't come here to follow!",
        "Roger, sending it! This is why they pay me!",
        "Understood! Let's remind them why I'm here!"
      ],
      
      'radio-check': [
        "Radio check, all good. Ready to prove myself.",
        "Copy, receiving you clearly. Let's do this.",
        "Roger, radio working. Time to show my worth.",
        "Loud and clear. I'm here to win."
      ]
    };
    
    // Alex Thunder - Young, ambitious, but struggles under pressure
    const alexResponses: Record<string, string[]> = {
      'pit-stop': morale > 70 ? [
        "Copy that! Let's go let's go! Fresh rubber time!",
        "Box confirmed! I'm ready to charge through the field!",
        "Roger, pitting now! This is my chance to shine!",
        "Copy! I'm feeling good about this one!"
      ] : [
        "Okay okay, pitting now... hope this works out!",
        "Copy, but I'm worried about track position!",
        "Roger, but the pressure is really on now!",
        "Understood... really need this to go well!"
      ],
      
      'push': morale > 70 ? [
        "YES! Maximum attack! This is what I live for!",
        "Copy, pushing hard! Time to show my speed!",
        "Roger, going flat out! I've got nothing to lose!",
        "PUSH PUSH PUSH! I'm feeling it today!"
      ] : [
        "I'm trying but the pressure is getting to me!",
        "Copy, pushing but I'm making small mistakes!",
        "Roger, giving it everything but it's tough out here!",
        "Understood, but I need to calm down and focus!"
      ],
      
      'conserve': [
        "Copy, fuel saving... trying to stay calm and smooth.",
        "Roger, lifting and coasting. Need to be patient.",
        "Understood, backing off. Focus on the long game.",
        "Copy that, fuel save mode. Stay composed."
      ],
      
      'swap-positions': morale > 70 ? [
        "Copy, letting him through. Whatever helps the team!",
        "Roger, moving aside. I'll get my chance later!",
        "Understood, team strategy. I'm still learning!",
        "Copy that, letting my teammate by. Team first!"
      ] : [
        "Aww man, really? Okay, letting him past...",
        "This is tough to take but... moving over now.",
        "Copy, but this hurts. I wanted to prove myself.",
        "Roger... I hope I get another chance to show my pace."
      ],
      
      'defend': [
        "Defending position! I won't make it easy for them!",
        "Copy, holding them off! This is so intense!",
        "Roger, defending hard! My heart's racing!",
        "Understood! Come on, I can do this!"
      ],
      
      'attack': [
        "Attack mode! This is my moment to shine!",
        "Copy, going for it! I'm feeling brave today!",
        "Roger, sending it! Fortune favors the bold!",
        "YES! Time to show what young talent can do!"
      ],
      
      'radio-check': [
        "Radio check, all good! Ready to prove myself!",
        "Copy, receiving you! Let's make some magic happen!",
        "Roger, radio working! I'm so pumped for this!",
        "Loud and clear! Time to show what I can do!"
      ]
    };
    
    // Select appropriate response set
    const responseSet = isMarcoRossi ? marcoResponses : isAlexThunder ? alexResponses : marcoResponses;
    const responseOptions = responseSet[command.type] || ["Copy that, chief!"];
    let selectedResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];
    
    // Add personality-specific modifications
    if (isMarcoRossi) {
      // Marco: More measured, professional, but with underlying determination
      if (morale < 60 && Math.random() > 0.7) {
        selectedResponse = selectedResponse.replace(/!/g, '.').replace(/YES/g, 'Yes');
      }
    } else if (isAlexThunder) {
      // Alex: More enthusiastic when confident, more nervous when not
      if (morale > 75 && Math.random() > 0.5) {
        selectedResponse = selectedResponse + (Math.random() > 0.5 ? ' Come on!' : ' Let\'s do this!');
      } else if (morale < 60 && Math.random() > 0.6) {
        selectedResponse = selectedResponse.replace(/!/g, '...');
      }
    }
    
    return {
      content: selectedResponse,
      confidence: 0.9,
      context: { 
        type: 'personality-driven-response', 
        driver: driverName,
        morale: morale,
        personality: isMarcoRossi ? 'veteran-with-something-to-prove' : 'young-ambitious-pressure-sensitive'
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