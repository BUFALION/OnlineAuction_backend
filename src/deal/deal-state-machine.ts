import { Injectable } from '@nestjs/common';
import { AnyEventObject, createActor, createMachine,  } from 'xstate';

@Injectable()
export class DealStateMachine {
  private machine = createMachine({
    id: 'deal',
    initial: 'created',
    states: {
      created: {
        on: {
          APPROVE: 'approved',
        },
      },
      approved: {
        on: {
          PAY: 'paid',
          CANCEL: 'cancelled',
        },
      },
      paid: {
        on: {
          COMPLETE: 'completed',
          
        },
      },
      cancelled: {},
      completed: {},
    },
  });
  private readonly actor = createActor(this.machine);

  constructor() {
    this.actor.start();
  }

  get currentState() {
    return this.actor.getSnapshot();
  }

  transition(action: string) {
    this.actor.send({type: action});
  }
}

export const dealMachine = createMachine({
  id: 'deal',
  initial: 'created',
  states: {
    created: {
      on: {
        APPROVE: 'approved',
      },
    },
    approved: {
      on: {
        PAY: 'paid',
        CANCEL: 'cancelled',
      },
    },
    paid: {
      on: {
        COMPLETE: 'completed',
      },
    },
    cancelled: {},
    completed: {},
  },
});
