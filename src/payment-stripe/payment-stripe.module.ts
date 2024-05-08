import { Module, forwardRef } from '@nestjs/common';
import { PaymentStripeController } from './payment-stripe.controller';
import { PaymentStripeService } from './payment-stripe.service';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbModule } from 'src/db/db.module';
import { PaymentStripeWebhookService } from './payment-stripe-webhook.service';
import { DealModule } from 'src/deal/deal.module';
@Module({
  imports: [
    StripeModule.forRootAsync(StripeModule, {
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('STRIPE_CONFIG'),
      inject: [ConfigService],
    }),
    DbModule,
    forwardRef(() => DealModule),
  ],
  controllers: [PaymentStripeController],
  providers: [PaymentStripeService, PaymentStripeWebhookService],
  exports: [PaymentStripeService],
})
export class PaymentStripeModule {}
