
export class StateMachine<T> {
    private readonly machine: IStateMachine;
  
    constructor(stateMachine: IStateMachine) {
      this.machine = stateMachine;
    }
  
    transition(currentState: string, action: string): T | null {
      const availableTransitions = this.machine.states[currentState]?.on;
  
      // if (availableTransitions && availableTransitions[action]) {
      //   return availableTransitions[action];
      // } else {
      //   throw new BadRequestException(
      //     `Invalid action "${action}" for state "${currentState}"`,
      //   );
      // }
      return availableTransitions?.[action] as T ?? null;
    }
  }