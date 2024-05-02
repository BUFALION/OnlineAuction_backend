import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { DbModule } from 'src/db/db.module';
import { AuctionModule } from 'src/auction/auction.module';
import { BidGateway } from '../websockets/bid.gateway';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [DbModule, AuctionModule, NotificationModule],
  providers: [BidService, BidGateway],
  controllers: [BidController],
  exports: [BidService]
})
export class BidModule {}
