import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { DbModule } from 'src/db/db.module';
import { CarModule } from 'src/car/car.module';
import { HttpModule } from '@nestjs/axios';
import { NotificationModule } from 'src/notification/notification.module';
import { DealModule } from 'src/deal/deal.module';

@Module({
  imports: [DbModule, CarModule, HttpModule,NotificationModule, DealModule],
  providers: [AuctionService],
  controllers: [AuctionController],
  exports: [AuctionService]
  
})
export class AuctionModule {}
