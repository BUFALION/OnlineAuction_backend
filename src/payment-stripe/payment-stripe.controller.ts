import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import Stripe from 'stripe';
import { PaymentStripeService } from './payment-stripe.service';

@ApiTags('payment')
@Controller('payment-stripe')
export class PaymentStripeController {


    constructor(private readonly paymentStripeService: PaymentStripeService) {}

    @Get()
    async getAllPayments(){
      return await this.paymentStripeService.getAllPayments();
    } 


    // @Post() 
    // async test() {

    //     let dealId = 12
    //     const session = await this.stripe.checkout.sessions.create({
    //         line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Deal Payment' }, unit_amount: 1000 }, quantity: 1 }],
    //         mode: 'payment',
    //         payment_intent_data: {
    //           metadata: { dealId: dealId.toString() },
    //         },
    //         // customer: deal.buyer.stripeCustomerId, // Предполагается, что у пользователя есть Stripe Customer ID
    //         success_url: 'http://locahost:3000/good',
    //         cancel_url: 'http://locahost:3000/bad',
    //       });
    //   return session
    // }
}
