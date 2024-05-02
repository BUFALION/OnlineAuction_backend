import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { DbModule } from 'src/db/db.module';
import { DealModule } from 'src/deal/deal.module';

@Module({
  imports: [DbModule, DealModule],
  providers: [ReviewService],
  controllers: [ReviewController]
})
export class ReviewModule {}
