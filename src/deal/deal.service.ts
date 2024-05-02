import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { DealStateMachine, dealMachine } from './deal-state-machine';
import { CreateDealDto } from './dto/create-deal.dto';
import { DealDto } from './dto/deal.dto';

@Injectable()
export class DealService {
  constructor(
    private readonly db: DbService,
  ) {}

  async findById(id: number) {
    const deal = await this.db.deal.findUnique({
      where: { id: id },
    });

    if (!deal) {
      throw new NotFoundException(`Deal with id ${deal} not found`);
    }
    return deal;
  }

  async findAllDeals(){
    return this.db.deal.findMany();
  }

//   async changeStatus(id: number, event: string) {
//     const deal = await this.findById(id);

//     const currentState = deal.status.toLowerCase();

//     const newState = this.dealStateMachine.transition(event);
//     const new
//   }

  async create(createDealDto: CreateDealDto): Promise<DealDto> {

    const existingDeal = await this.db.deal.findUnique({
      where: {
        auctionId: createDealDto.auctionId
      },
    });

    if (existingDeal) {
      throw new ConflictException(`A deal with auctionId ${createDealDto.auctionId} already exists.`);
    }
    
    const deal =  await this.db.deal.create({
      data: {
        ...createDealDto
      },
    });
    
    return deal
  }

  async findByBuyerId(buyerId: number) {
    return this.db.deal.findMany({
      where:{
        buyerId: buyerId
      }
    })
  }

  async findBySellerId(sellerId: number){
    return await this.db.deal.findMany({
      where: {
        sellerId: sellerId
      }
    })
  }

}
