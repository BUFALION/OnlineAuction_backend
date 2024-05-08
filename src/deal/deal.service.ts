import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { dealMachine } from './deal-state-machine';
import { CreateDealDto } from './dto/create-deal.dto';
import { DealDto } from './dto/deal.dto';
import { StateMachine } from 'src/shared/state-machine/state-machine';
import { DealStatus } from '@prisma/client';
import { PaymentStripeService } from 'src/payment-stripe/payment-stripe.service';


@Injectable()
export class DealService {

  private stateMachine: StateMachine<DealStatus>;

  constructor(
    private readonly db: DbService,
    private readonly paymentStripe: PaymentStripeService
  ) {
    this.stateMachine = new StateMachine(dealMachine);
  }

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

  async changeStatus(id: number, event: string) {
    const deal = await this.findById(id);

    const currentState = deal.status;

    const state = this.stateMachine.transition(currentState, event)

    if(!state){
      throw new BadRequestException(
        `Invalid action "${event}" for state "${currentState}". Check the allowed transitions.`
      );
    }
    return await this.db.deal.update({
      where: {
        id: deal.id
      },
      data: {
        status: state
      }
    })

    // const service = interpret(dealMachine).start();

    // // dealMachine.transition(deal.status.toLowerCase(), {type: event})
    // service.transition(deal.status.toLowerCase(),{ type: event });


  }

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
    
    this.paymentStripe.createCheck(deal.id,deal.price)

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
