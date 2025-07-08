import { RaceState, Driver, Team, RaceEvent, VoiceCommand, WeatherCondition } from '../types';

export class RaceEngine {
  private raceState: RaceState;
  private intervalId: number | null = null;
  private lapDuration: number = 5000; // 5 seconds per lap in demo mode
  private isRunning: boolean = false;
  private eventHandlers: Map<string, (data: any) => void> = new Map();

  constructor(initialState: RaceState) {
    this.raceState = { ...initialState };
  }

  // TODO: Computer 3 - Implement race simulation engine
  // This should:
  // - Simulate race progression over time
  // - Handle driver position changes
  // - Manage tyre degradation and pit stops
  // - Trigger random events (crashes, weather, etc.)
  // - Calculate lap times based on tyre compound and condition
  // - Manage fuel consumption
  // - Handle driver morale and aggression effects

  public start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.raceState.isActive = true;
    
    this.intervalId = window.setInterval(() => {
      this.updateRaceState();
    }, this.lapDuration);
    
    this.emit('raceStarted', this.raceState);
  }

  public pause(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    this.raceState.isPaused = true;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.emit('racePaused', this.raceState);
  }

  public resume(): void {
    if (this.isRunning) return;
    
    this.raceState.isPaused = false;
    this.start();
    this.emit('raceResumed', this.raceState);
  }

  public stop(): void {
    this.isRunning = false;
    this.raceState.isActive = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.emit('raceEnded', this.raceState);
  }

  public executeCommand(command: VoiceCommand): void {
    // TODO: Computer 3 - Implement command execution
    // This should:
    // - Parse and validate commands
    // - Execute pit stops
    // - Change driver behavior (push/conserve)
    // - Swap driver positions
    // - Update driver morale based on command success
    
    switch (command.type) {
      case 'pit-stop':
        this.executePitStop(command);
        break;
      case 'push':
        this.executeDriverPush(command);
        break;
      case 'conserve':
        this.executeDriverConserve(command);
        break;
      case 'swap-positions':
        this.executePositionSwap(command);
        break;
      case 'defend':
        this.executeDefend(command);
        break;
      case 'attack':
        this.executeAttack(command);
        break;
      default:
        console.warn('Unknown command type:', command.type);
    }
    
    this.emit('commandExecuted', { command, raceState: this.raceState });
  }

  private updateRaceState(): void {
    // TODO: Computer 3 - Implement race state updates
    // This should be called every lap interval to:
    // - Advance current lap
    // - Update driver positions
    // - Degrade tyres
    // - Consume fuel
    // - Check for random events
    // - Update weather conditions
    
    this.raceState.currentLap++;
    this.raceState.raceTime += this.lapDuration / 1000;
    
    // Update driver lap times and positions
    this.updateDriverPerformance();
    
    // Check for random events
    this.checkForRandomEvents();
    
    // Update weather
    this.updateWeather();
    
    // Check for race completion
    if (this.raceState.currentLap >= this.raceState.totalLaps) {
      this.stop();
      return;
    }
    
    this.emit('raceStateUpdated', this.raceState);
  }

  private updateDriverPerformance(): void {
    // TODO: Computer 3 - Implement driver performance calculations
    // This should:
    // - Calculate lap times based on tyre compound and degradation
    // - Apply weather effects
    // - Factor in driver morale and aggression
    // - Update positions based on performance
    
    this.raceState.drivers.forEach(driver => {
      // Calculate base lap time
      let baseLapTime = this.calculateBaseLapTime(driver);
      
      // Apply tyre degradation
      baseLapTime += this.getTyreDegradationPenalty(driver);
      
      // Apply weather effects
      baseLapTime += this.getWeatherPenalty(driver);
      
      // Apply driver morale/aggression
      baseLapTime += this.getDriverPerformanceModifier(driver);
      
      // Update driver data
      driver.lapTime = baseLapTime;
      driver.tyreAge++;
      driver.fuel = Math.max(0, driver.fuel - this.getFuelConsumption(driver));
      
      // Update best lap if needed
      if (baseLapTime < driver.bestLap) {
        driver.bestLap = baseLapTime;
      }
    });
    
    // Update positions based on performance
    this.updatePositions();
  }

  private calculateBaseLapTime(driver: Driver): number {
    // TODO: Computer 3 - Implement realistic lap time calculation
    // Base lap time should depend on:
    // - Tyre compound performance
    // - Driver skill level
    // - Team performance
    
    const baseTime = 87.0; // Base lap time in seconds
    const compoundModifier = {
      'soft': 0.0,
      'medium': 0.5,
      'hard': 1.0,
      'intermediate': 1.5,
      'wet': 2.0
    };
    
    return baseTime + compoundModifier[driver.tyreCompound] + (Math.random() - 0.5) * 0.5;
  }

  private getTyreDegradationPenalty(driver: Driver): number {
    // TODO: Computer 3 - Implement tyre degradation model
    const degradationRates = {
      'soft': 0.05,
      'medium': 0.03,
      'hard': 0.02,
      'intermediate': 0.04,
      'wet': 0.03
    };
    
    return driver.tyreAge * degradationRates[driver.tyreCompound];
  }

  private getWeatherPenalty(driver: Driver): number {
    // TODO: Computer 3 - Implement weather effects
    const weatherPenalties = {
      'sunny': 0,
      'cloudy': 0.1,
      'light-rain': 0.5,
      'heavy-rain': 1.2,
      'storm': 2.0
    };
    
    // Wrong tyre compound for conditions
    if (this.raceState.weather === 'light-rain' && driver.tyreCompound !== 'intermediate') {
      return 2.0;
    }
    if (this.raceState.weather === 'heavy-rain' && driver.tyreCompound !== 'wet') {
      return 3.0;
    }
    
    return weatherPenalties[this.raceState.weather] || 0;
  }

  private getDriverPerformanceModifier(driver: Driver): number {
    // TODO: Computer 3 - Implement driver psychology effects
    // Higher morale = better performance
    // Higher aggression = faster but more risky
    
    const moraleBonus = (driver.morale - 50) * 0.01;
    const aggressionEffect = driver.aggression > 80 ? -0.2 : 0; // Risk vs reward
    
    return moraleBonus + aggressionEffect;
  }

  private getFuelConsumption(driver: Driver): number {
    // TODO: Computer 3 - Implement fuel consumption model
    return 1.5; // kg per lap
  }

  private updatePositions(): void {
    // TODO: Computer 3 - Implement position updates
    // Sort drivers by total race time (or lap time for simplicity)
    this.raceState.drivers.sort((a, b) => a.lapTime - b.lapTime);
    
    // Update positions
    this.raceState.drivers.forEach((driver, index) => {
      driver.position = index + 1;
    });
  }

  private checkForRandomEvents(): void {
    // TODO: Computer 3 - Implement random event system
    // This should randomly trigger:
    // - Mechanical failures
    // - Crashes
    // - Safety cars
    // - Virtual safety cars
    // - Weather changes
    
    const eventChance = 0.15; // 15% chance per lap
    if (Math.random() < eventChance) {
      this.triggerRandomEvent();
    }
  }

  private triggerRandomEvent(): void {
    const events = [
      { type: 'mechanical', message: 'Mechanical issue for a rival team' },
      { type: 'crash', message: 'Yellow flag - incident at turn 3' },
      { type: 'weather', message: 'Weather conditions changing' },
      { type: 'flag', message: 'Safety car deployed' }
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    
    const raceEvent: RaceEvent = {
      id: `event-${Date.now()}`,
      type: randomEvent.type as any,
      lap: this.raceState.currentLap,
      message: randomEvent.message,
      severity: 'warning',
      timestamp: Date.now()
    };
    
    this.raceState.events.push(raceEvent);
    this.emit('eventTriggered', raceEvent);
  }

  private updateWeather(): void {
    // TODO: Computer 3 - Implement weather progression
    // Weather should change based on forecast and randomness
    
    const weatherChance = 0.1; // 10% chance per lap
    if (Math.random() < weatherChance) {
      const weatherOptions: WeatherCondition[] = ['sunny', 'cloudy', 'light-rain', 'heavy-rain'];
      const newWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      
      if (newWeather !== this.raceState.weather) {
        this.raceState.weather = newWeather;
        this.raceState.trackCondition = newWeather.includes('rain') ? 'wet' : 'dry';
        
        this.addEvent({
          type: 'weather',
          message: `Weather changed to ${newWeather}`,
          severity: 'info'
        });
      }
    }
  }

  private executePitStop(command: VoiceCommand): void {
    // TODO: Computer 3 - Implement pit stop logic
    const targetDrivers = this.getTargetDrivers(command);
    
    targetDrivers.forEach(driver => {
      driver.tyreAge = 0;
      driver.tyreCompound = command.params.tyreCompound || 'medium';
      driver.fuel = 100;
      driver.status = 'racing';
      
      // Pit stop time penalty
      driver.lapTime += 25; // 25 second pit stop
      
      this.addEvent({
        type: 'pit-stop',
        message: `${driver.name} pits for ${driver.tyreCompound} tyres`,
        severity: 'info'
      });
    });
  }

  private executeDriverPush(command: VoiceCommand): void {
    // TODO: Computer 3 - Implement push mode
    const targetDrivers = this.getTargetDrivers(command);
    
    targetDrivers.forEach(driver => {
      driver.aggression = Math.min(100, driver.aggression + 10);
      driver.morale = Math.min(100, driver.morale + 5);
    });
  }

  private executeDriverConserve(command: VoiceCommand): void {
    // TODO: Computer 3 - Implement conserve mode
    const targetDrivers = this.getTargetDrivers(command);
    
    targetDrivers.forEach(driver => {
      driver.aggression = Math.max(0, driver.aggression - 10);
    });
  }

  private executePositionSwap(command: VoiceCommand): void {
    // TODO: Computer 3 - Implement position swap
    const playerDrivers = this.raceState.drivers.filter(d => d.isPlayer);
    
    if (playerDrivers.length >= 2) {
      const temp = playerDrivers[0].position;
      playerDrivers[0].position = playerDrivers[1].position;
      playerDrivers[1].position = temp;
      
      this.addEvent({
        type: 'pit-stop',
        message: 'Team orders: drivers swap positions',
        severity: 'info'
      });
    }
  }

  private executeDefend(command: VoiceCommand): void {
    // TODO: Computer 3 - Implement defend mode
    const targetDrivers = this.getTargetDrivers(command);
    
    targetDrivers.forEach(driver => {
      driver.aggression = Math.max(0, driver.aggression - 5);
    });
  }

  private executeAttack(command: VoiceCommand): void {
    // TODO: Computer 3 - Implement attack mode
    const targetDrivers = this.getTargetDrivers(command);
    
    targetDrivers.forEach(driver => {
      driver.aggression = Math.min(100, driver.aggression + 15);
    });
  }

  private getTargetDrivers(command: VoiceCommand): Driver[] {
    if (command.target === 'both') {
      return this.raceState.drivers.filter(d => d.isPlayer);
    }
    
    const driver = this.raceState.drivers.find(d => d.id === command.target);
    return driver ? [driver] : [];
  }

  private addEvent(params: { type: string; message: string; severity: 'info' | 'warning' | 'critical' }): void {
    const event: RaceEvent = {
      id: `event-${Date.now()}`,
      type: params.type as any,
      lap: this.raceState.currentLap,
      message: params.message,
      severity: params.severity,
      timestamp: Date.now()
    };
    
    this.raceState.events.push(event);
    this.emit('eventTriggered', event);
  }

  private emit(event: string, data: any): void {
    const handler = this.eventHandlers.get(event);
    if (handler) {
      handler(data);
    }
  }

  public on(event: string, handler: (data: any) => void): void {
    this.eventHandlers.set(event, handler);
  }

  public off(event: string): void {
    this.eventHandlers.delete(event);
  }

  public getRaceState(): RaceState {
    return { ...this.raceState };
  }

  public setLapDuration(duration: number): void {
    this.lapDuration = duration;
  }
}

export default RaceEngine; 