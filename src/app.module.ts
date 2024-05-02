import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { CarModule } from './car/car.module';
import { AuctionModule } from './auction/auction.module';
import { FavoriteModule } from './favorite/favorite.module';
import { BidModule } from './bid/bid.module';
import { ModelModule } from './model/model.module';
import { MakeModule } from './make/make.module';
import { GenerationModule } from './generation/generation.module';
import { DescriptionModule } from './description/description.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notification/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DealModule } from './deal/deal.module';
import { ReviewModule } from './review/review.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    AuthModule,
    UserModule,
    DbModule,
    CarModule,
    AuctionModule,
    FavoriteModule,
    BidModule,
    ModelModule,
    MakeModule,
    GenerationModule,
    DescriptionModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      global: true
    }),
    NotificationModule,
    DealModule,
    ReviewModule
    
  ],
})
export class AppModule {}
