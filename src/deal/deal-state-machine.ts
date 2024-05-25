import { DealStatus } from '@prisma/client';
export const dealMachine = {
  id: 'deal',
  initial: DealStatus.CREATED,
  states: {
    [DealStatus.CREATED]: {
      on: {
        CONFIRMED: DealStatus.CONFIRMED,
        CANCELLED: DealStatus.CANCELLED,
      },
    },
    [DealStatus.CONFIRMED]: {
      on: {
        PAID: DealStatus.PAID,
        CANCELLED: DealStatus.CANCELLED,
      },
    },
    [DealStatus.PAID]: {
      on: {
        COMPLETED: DealStatus.COMPLETED,
      },
    },
    [DealStatus.CANCELLED]: {
      on: {},
    },
    [DealStatus.COMPLETED]: {
      on: {},
    },
  },
};
