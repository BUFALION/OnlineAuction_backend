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
import { promises } from 'dns';
import { PaginatedOutputDto } from 'src/shared/dto/pagination.dto';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class AuctionService {
  private readonly logger = new Logger(AuctionService.name);

  constructor(
    private readonly db: DbService,
    private readonly carService: CarService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    createAuctionDto: CreateAuctionDto,
    carId: number,
    sellerId: number,
  ) {
    const car = await this.carService.getCarById(carId);

    if (car.sellerId !== sellerId) {
      throw new UnauthorizedException(
        'You are not authorized to create an auction for this car.',
      );
    }

    if (createAuctionDto.dateEnd <= createAuctionDto.dateStart) {
      throw new BadRequestException('End date must be greater than start date');
    }

    const auction = await this.db.auction.create({
      data: {
        ...createAuctionDto,
        carId: car.id,
        dateStart: new Date(createAuctionDto.dateStart),
        dateEnd: new Date(createAuctionDto.dateEnd),
      },
    });

    this.createAuctionCron(auction, sellerId);
    return auction;
  }
  //TODO CAN I REFACTORING THIS
  async findAll(page: number, perPage: number): Promise<PaginatedOutputDto<AuctionDto>> {
    return await paginate(
      this.db.auction,
      {},
      {
        page,
        perPage,
      },
    );

    // return await this.db.auction.findMany();
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

  async getAuctionByUserBids(userId: number) {
    const auctions = await this.db.auction.findMany({
      where: {
        bid: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        bid: {
          where: {
            userId: userId,
          },
        },
      },
    });

    if (!auctions) {
      throw new NotFoundException(
        `No auctions found for user with ID ${userId}`,
      );
    }

    return auctions;
  }

  createAuctionCron(auctin: AuctionDto, sellerId: number) {
    const cronName = `auction-${auctin.id}`;

    const job = new CronJob(auctin.dateEnd, async () => {
      this.logger.log(`Ending auction with ID ${auctin.id}`);
      const bid = await this.db.bid.findFirst({
        where: { auctionId: auctin.id },
        orderBy: { amount: 'desc' },
      });
      if (bid) {
        await this.notificationService.create(
          {
            title: `Вы выйграли аукцион ${bid.auctionId}`,
            description: `Ваша ставка: ${bid.amount}`,
          },
          bid.userId,
        );
        await this.notificationService.create(
          {
            title: `Ваш аукцион был сыгран ${bid.auctionId}`,
            description: `Выигрышная ставка : ${bid.amount}`,
          },
          sellerId,
        );
      } else {
        await this.notificationService.create(
          {
            title: `Ваш аукцион не был сыгран ${bid.auctionId}`,
            description: `Никто не сделал ставку`,
          },
          sellerId,
        );
      }
    });

    this.schedulerRegistry.addCronJob(cronName, job);

    job.start();
    this.logger.log(`Created cron for auction with ID ${auctin.id}`);
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
}
