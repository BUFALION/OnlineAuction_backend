import {
  InjectStripeClient,
  StripeWebhookHandler,
} from '@golevelup/nestjs-stripe';
import { Injectable, Logger } from '@nestjs/common';
import { DealStatus, PaymentStatus } from '@prisma/client';
import { DealService } from 'src/deal/deal.service';
import Stripe from 'stripe';
import { PaymentStripeService } from './payment-stripe.service';
import { DbService } from 'src/db/db.service';
@Injectable()
export class PaymentStripeWebhookService {
  private readonly logger = new Logger(PaymentStripeWebhookService.name);

  constructor(
    @InjectStripeClient() private stripe: Stripe,
    private readonly dealService: DealService,
    private readonly paymentStripeService: PaymentStripeService,
    private readonly db: DbService,
  ) {}
  @StripeWebhookHandler('checkout.session.completed')
  async handleSubscriptionUpdate(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;
    this.logger.log(`Checkout Session completed: ${session.id}`);
    console.log(session.metadata);
    try {
      const dealId = parseInt(session.metadata.dealId, 10);
      if (isNaN(dealId)) {
        throw new Error('Invalid deal ID');
      }

      const payment =
        await this.paymentStripeService.getPaymentByDealId(dealId);
      if (!payment) {
        throw new Error(`Payment for deal with ID ${dealId} not found`);
      }

      this.dealService.changeStatus(dealId, DealStatus.PAID);

      await this.db.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PAID,
      
        },
      });

      this.logger.log(`Payment for deal ID ${dealId} updated to PAID`);
    } catch (error) {
      this.logger.error(
        `Error handling checkout.session.completed: ${error.message}`,
      );
      throw error;
    }
  }
  //   @StripeWebhookHandler('customer.subscription.deleted')
  //   // implement here subscription delete in our Database
  //   async handleSubscriptionDelete(event: Stripe.Event): Promise<void> {
  //     const dataObject = event.data.object as Stripe.Subscription;
  //     this.logger.log(`Checkout Session completed: ${dataObject}`);
  //     // ...
  //   }
}
