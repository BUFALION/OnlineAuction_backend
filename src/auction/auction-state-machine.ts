import { AuctionStatus } from "@prisma/client";

export const auctionMachine = {
    id: 'auction',
    initial: AuctionStatus.NOT_PLAYED,
    states: {
      [AuctionStatus.NOT_PLAYED]: {
        on: {
          IN_PROGRESS: AuctionStatus.IN_PROGRESS,
          CANCELLED: AuctionStatus.CANCELLED,
        },
      },
      [AuctionStatus.IN_PROGRESS]: {
        on: {
          PLAYED: AuctionStatus.PLAYED,
          CANCELLED: AuctionStatus.CANCELLED,
        },
      },
      [AuctionStatus.PLAYED]: {
        on: {}, 
      },
      [AuctionStatus.CANCELLED]: {
        on: {}, 
      },
    },
  };
  
  
  