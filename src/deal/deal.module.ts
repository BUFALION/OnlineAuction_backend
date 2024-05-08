import { Module, forwardRef } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { DealService } from './deal.service';
import { DealController } from './deal.controller';
import { PaymentStripeModule } from 'src/payment-stripe/payment-stripe.module';

@Module({
    imports: [DbModule, forwardRef(() => PaymentStripeModule)],
    providers: [DealService],
    controllers: [DealController],
    exports:[DealService]
  })
export class DealModule {}
