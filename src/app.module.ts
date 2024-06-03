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
import { CompanyModule } from './company/company.module';
import { TokenModule } from './token/token.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';  
import { PaymentStripeModule } from './payment-stripe/payment-stripe.module';
import configs from './config';
import { CacheModule } from '@nestjs/cache-manager';
import { AnalyticsModule } from './analytics/analytics.module';
import { ServerTimeModule } from './server-time/server-time.module';
import * as redisStore from 'cache-manager-redis-store'


@Module({
  controllers: [AppController],
  providers: [
    AppService,

  ],
  imports: [
    PaymentStripeModule,
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
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.REDIS_URL
    }),
    
    EventEmitterModule.forRoot({
      global: true,
    }),
    NotificationModule,
    DealModule,
    ReviewModule,
    CompanyModule,
    TokenModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs],
    }),
    AnalyticsModule,
    ServerTimeModule,
    
  ],
})
export class AppModule {}
