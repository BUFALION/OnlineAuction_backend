import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { DbModule } from 'src/db/db.module';
import { AuctionModule } from 'src/auction/auction.module';

@Module({
  imports: [DbModule, AuctionModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}
