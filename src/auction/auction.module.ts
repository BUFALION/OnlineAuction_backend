import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { DbModule } from 'src/db/db.module';
import { CarModule } from 'src/car/car.module';
import { HttpModule } from '@nestjs/axios';
import { BidModule } from 'src/bid/bid.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [DbModule, CarModule, HttpModule,NotificationModule],
  providers: [AuctionService],
  controllers: [AuctionController],
  exports: [AuctionService]
  
})
export class AuctionModule {}
