import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateAuctionDto } from './dto/create-auctiom.dto';
import { CarService } from 'src/car/car.service';
import { AuctionDto } from './dto/auction.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { NotificationService } from 'src/notification/notification.service';
import { PaginatorTypes, paginator } from '@nodeteam/nestjs-prisma-pagination';
import { PaginatedOutputDto } from 'src/shared/dto/pagination.dto';
import { DealService } from 'src/deal/deal.service';
import { StateMachine } from 'src/shared/state-machine/state-machine';
import { AuctionStatus, NotificationInfo } from '@prisma/client';
import { auctionMachine } from './auction-state-machine';
import { EventEmitter2 } from '@nestjs/event-emitter';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 10 });

export type AuctionFilter = {
  yearRange?: [number, number] | number[];
  makeId?: number;
  modelId?: number;
  search?: string
};

@Injectable()
export class AuctionService {
  private readonly logger = new Logger(AuctionService.name);
  private stateMachine: StateMachine<AuctionStatus>;

  constructor(
    private readonly db: DbService,
    private readonly carService: CarService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly notificationService: NotificationService,
    private readonly dealService: DealService,
    private readonly eventEmitter: EventEmitter2
  ) {
    this.stateMachine = new StateMachine(auctionMachine);
  }

  async create(
    createAuctionDto: CreateAuctionDto,
    carId: number,
    companyId: number,
  ) {
    const car = await this.carService.getCarById(carId);

    if (car.companyId !== companyId) {
      throw new UnauthorizedException(
        'You are not authorized to create an auction for this car.',
      );
    }

    if (createAuctionDto.dateEnd <= createAuctionDto.dateStart) {
      throw new BadRequestException('End date must be greater than start date');
    }

    if (createAuctionDto.dateStart < new Date()) {
      throw new BadRequestException('Start date must be in the future');
    }

    const auction = await this.db.auction.create({
      data: {
        ...createAuctionDto,
        carId: car.id,
        dateStart: new Date(createAuctionDto.dateStart),
        dateEnd: new Date(createAuctionDto.dateEnd),
      },
    });

    this.scheduleAuction(auction, companyId);
    return auction;
  }

  async findAuctionsByComapnyId(companyId: number) {
    return await this.db.auction.findMany({
      where: {
        car: {
          companyId,
        },
      },
      include: {
        car: {
          include: {
            generation: {
              include: {
                model: {
                  include: {
                    make: true
                  }
                }
              }
            }
          }
        }
      },
    });
  }

  //TODO CAN I REFACTORING THIS
  async findAll(
    page: number,
    perPage: number,
    filter: AuctionFilter,
  ): Promise<PaginatedOutputDto<AuctionDto>> {
    const { yearRange, makeId, modelId,search } = filter;
    return await paginate(
      this.db.auction,
      {
        where: {
          OR: [
            { car: { company: { companyName: search } } },
            { car: { description: { title: search } } },
            { car: { generation: { generationName: search } } },
            { car: { generation: { model: { modelName: search } } } },
            { car: { generation: { model: { make: { makeName: search } } } } },
          ],
          dateEnd: {
            gte: new Date(),
          },
          car: {
            generation: {
              model: {
                makeId: +makeId || undefined,
                id: +modelId || undefined,
              },
            },
            AND: [
              yearRange[0] && { year: { gte: yearRange[0] } },
              yearRange[1] && { year: { lte: yearRange[1] } },
            ].filter(Boolean),
          },
        
        },
        orderBy: {
          dateEnd: 'asc',
        },
        // [
        //   { car: { year: 'asc' } }, // Sort by car year in ascending order
        //   { car: { generation: { model: { make: { makeName: 'asc' } } } } }, // Then by make name
        //   { car: { generation: { model: { modelName: 'asc' } } } }, // Then by model name
        //   { car: { generation: { generationYear: 'asc' } } }, // Then by generation year
        // ],
        include: {
          car: {
            include: {
              company: true,
              generation: {
                include: {
                  model: {
                    include: {
                      make: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        page,
        perPage,
      },
    );
  }

  async getSortedAuctions(filter: AuctionFilter) {
    const { yearRange, makeId, modelId } = filter;
    const search = 'r';
    const auctions = await this.db.auction.findMany({
      where: {
      
        car: {
          generation: {
            model: {
              makeId: +makeId || undefined, // Use undefined to ignore the filter if makeId is not provided
              id: +modelId || undefined, // Use undefined to ignore the filter if modelId is not provided
            },
          },
          AND: [
            yearRange && { year: { gte: yearRange[0] } },
            yearRange && { year: { lte: yearRange[1] } },
            //  { year: { gte: 1700 } },
            //  { year: { lte: 200000 } },
          ].filter(Boolean),
        },
      },
      orderBy: [
        { createdAt: 'asc' },
        // { car: { year: 'asc' } }, // Sort by car year in ascending order
        // { car: { generation: { model: { make: { makeName: 'asc' } } } } }, // Then by make name
        // { car: { generation: { model: { modelName: 'asc' } } } }, // Then by model name
        // { car: { generation: { generationYear: 'asc' } } }, // Then by generation year
      ],
      include: {
        car: {
          include: {
            generation: {
              include: {
                model: {
                  include: {
                    make: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return auctions;
  }

  async findById(auctionId: number) {
    const auction = await this.db.auction.findUnique({
      where: { id: auctionId },
    });

    if (!auction) {
      throw new NotFoundException(`Auction with id ${auctionId} not found`);
    }
    return auction;
  }

  async getAuctionByUserBids(userId: number, filter: 'all' | 'active' | 'past') {
    let whereCondition: any = {
      bid: {
        some: {
          userId: userId,
        },
      },
    };

    const now = new Date();

    if (filter === 'active') {
      whereCondition.dateStart = { lte: now };
      whereCondition.dateEnd = { gte: now };
    } else if (filter === 'past') {
      whereCondition.dateEnd = { lt: now };
    }

    const auctions = await this.db.auction.findMany({
      where: whereCondition,
      include: {
        bid: {
          where: {
            userId: userId,
          },
        },
      },
    });

    if (!auctions || auctions.length === 0) {
      throw new NotFoundException(`No auctions found for user with ID ${userId}`);
    }

    return auctions;
  }

  // createAuctionCron(auctin: AuctionDto, companyId: number) {
  //   const cronName = `auction-${auctin.id}`;

  //   const job = new CronJob(auctin.dateEnd, async () => {
  //     this.logger.log(`Ending auction with ID ${auctin.id}`);
  //     const bid = await this.db.bid.findFirst({
  //       where: { auctionId: auctin.id },
  //       orderBy: { amount: 'desc' },
  //     });

  //     if (bid) {
  //       this.changeStatus(auctin.id, AuctionStatus.PLAYED);
  //       await this.notificationService.create(
  //         {
  //           title: `Вы выйграли аукцион ${bid.auctionId}`,
  //           description: `Ваша ставка: ${bid.amount}`,
  //           statusInfo: NotificationInfo.SUCCESS,
  //         },
  //         bid.userId,
  //       );

  //       await this.notificationService.create(
  //         {
  //           title: `Ваш аукцион был сыгран ${auctin.id}`,
  //           description: `Выигрышная ставка : ${bid.amount}`,
  //           statusInfo: NotificationInfo.SUCCESS,
  //         },
  //         companyId,
  //       );

  //       await this.dealService.create({
  //         auctionId: auctin.id,
  //         companyId: companyId,
  //         buyerId: bid.userId,
  //         price: bid.amount,
  //       });
  //     } else {
  //       this.changeStatus(auctin.id, AuctionStatus.CANCELLED);
  //       await this.notificationService.create(
  //         {
  //           title: `Ваш аукцион не был сыгран ${auctin.id}`,
  //           description: `Никто не сделал ставку`,
  //           statusInfo: NotificationInfo.ERROR,
  //         },
  //         companyId,
  //       );
  //     }
  //   });

  //   this.schedulerRegistry.addCronJob(cronName, job);

  //   job.start();
  //   this.changeStatus(auctin.id, AuctionStatus.IN_PROGRESS);
  //   this.logger.log(`Created cron for auction with ID ${auctin.id}`);
  // }

  private async scheduleAuction(auction: AuctionDto, companyId: number) {
    const cronJobAuctionEnd = new CronJob(
      auction.dateEnd,
      async () => await this.endAuction(auction, companyId),
    );

    const cronJobAuctionStart = new CronJob(auction.dateStart, async () => {
      await this.startAuction(auction, cronJobAuctionEnd);
    });

    this.schedulerRegistry.addCronJob(
      `start-auction-${auction.id}`,
      cronJobAuctionStart,
    );
    this.schedulerRegistry.addCronJob(
      `end-auction-${auction.id}`,
      cronJobAuctionEnd,
    );

    cronJobAuctionStart.start();
  }

  private startAuction(auction: AuctionDto, cronJobAuctionEnd: CronJob) {
    try {
      this.changeStatus(auction.id, AuctionStatus.IN_PROGRESS);
      this.eventEmitter.emit('auction.start', auction);

      this.logger.log(`Auction ${auction.id} started successfully`);
      cronJobAuctionEnd.start();
      this.logger.log(`Created cron for ending auction with ID ${auction.id}`);
    } catch (error) {
      this.logger.error(`Failed to start auction ${auction.id}`, error.stack);
    }
  }

  private async endAuction(auction: AuctionDto, companyId: number) {
    this.logger.log(`Ending auction with ID ${auction.id}`);
    this.eventEmitter.emit('auction.end', auction);
    const bid = await this.db.bid.findFirst({
      where: { auctionId: auction.id },
      orderBy: { amount: 'desc' },
    });

    if (bid) {
      this.changeStatus(auction.id, AuctionStatus.PLAYED);
      await this.notificationService.create(
        {
          title: `Вы выйграли аукцион ${bid.auctionId}`,
          description: `Ваша ставка: ${bid.amount}`,
          statusInfo: NotificationInfo.SUCCESS,
        },
        bid.userId,
      );

      await this.notificationService.create(
        {
          title: `Ваш аукцион был сыгран ${auction.id}`,
          description: `Выигрышная ставка : ${bid.amount}`,
          statusInfo: NotificationInfo.SUCCESS,
        },
        companyId,
      );

      await this.dealService.create({
        auctionId: auction.id,
        companyId: companyId,
        buyerId: bid.userId,
        price: bid.amount,
      });
    } else {
      this.changeStatus(auction.id, AuctionStatus.CANCELLED);
      await this.notificationService.create(
        {
          title: `Ваш аукцион не был сыгран ${auction.id}`,
          description: `Никто не сделал ставку`,
          statusInfo: NotificationInfo.ERROR,
        },
        companyId,
      );
    }
  }

  async checkAuctionExpiration(auctionId: number): Promise<boolean> {
    const auction = await this.findById(auctionId);

    const currentTime: Date = new Date();
    const auctionEndTime: Date = new Date(auction.dateEnd);
    console.log(currentTime);
    console.log(auctionEndTime);
    console.log(currentTime > auctionEndTime);
    return currentTime > auctionEndTime;
  }

  test() {
    console.log('test');
  }
  async changeStatus(id: number, event: string) {
    const auctin = await this.findById(id);

    const currentState = auctin.status;

    const state = this.stateMachine.transition(currentState, event);

    if (!state) {
      throw new BadRequestException(
        `Invalid action "${event}" for state "${currentState}". Check the allowed transitions.`,
      );
    }
    return await this.db.auction.update({
      where: {
        id: auctin.id,
      },
      data: {
        status: state,
      },
    });
  }
}
