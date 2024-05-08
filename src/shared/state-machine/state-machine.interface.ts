interface IStateMachine {
    id: string;
    initial: string;
    states: {
      [state: string]: {
        on: {
          [action: string]: string;
        };
      };
    };
  }