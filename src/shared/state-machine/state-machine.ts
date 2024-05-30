
export class StateMachine<T> {
    private readonly machine: IStateMachine;
  
    constructor(stateMachine: IStateMachine) {
      this.machine = stateMachine;
    }
  
    transition(currentState: string, action: string): T | null {
      const availableTransitions = this.machine.states[currentState]?.on;
      return availableTransitions?.[action] as T ?? null;
    }
  }