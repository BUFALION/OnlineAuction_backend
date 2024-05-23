import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Global, Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentStripeService {
  constructor(
    private readonly db: DbService,
    @InjectStripeClient() private stripe: Stripe,
  ) {}

  async getAllPayments() {
    return await this.db.payment.findMany()
  }

  async getUserPayments(id: number) {
    return await this.db.payment.findMany({
      where:{
        deal:{
          buyerId: id
        }
        
      },
      include:{
        deal: true,
        
       
      }
    })
  } 

  async getPaymentByDealId(dealId: number) {
    const payment = await this.db.payment.findUnique({where:{
      dealId: dealId
    }})

    if (!payment) {
      throw new NotFoundException(`Payment with id ${dealId} not found`);
    }
    return payment
  }

  async createCheck(dealId: number, amount: number, currency: string = 'usd') {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: { name: 'Deal Payment' },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        dealId: dealId.toString()
      },
     
      success_url: 'http://locahost:3000/good',
      cancel_url: 'http://locahost:3000/bad',
    });
 
    await this.db.payment.create({
        data: {
            url: session.url,
            dealId: dealId,
        }
    })
  }
}
