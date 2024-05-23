import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import Stripe from 'stripe';
import { PaymentStripeService } from './payment-stripe.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { PaymentDto } from './dto/payment.dto';

@ApiTags('payment')
@Controller('payment-stripe')
export class PaymentStripeController {


    constructor(private readonly paymentStripeService: PaymentStripeService) {}

    @Get()
    async getAllPayments(){
      return await this.paymentStripeService.getAllPayments();
    } 

    @UseGuards(AuthGuard)
    @ApiOkResponse({
      type: [PaymentDto]
  })
    @Get('user')
    async getAllUserPayment(@SessionInfo() session: GetSessionDto){
      return this.paymentStripeService.getUserPayments(session.id)
    }
    

    @Get('deal/:dealId')
    async GetPaymentByDealId(@Param('dealId', ParseIntPipe) dealId: number){
      return this.paymentStripeService.getPaymentByDealId(dealId)
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
