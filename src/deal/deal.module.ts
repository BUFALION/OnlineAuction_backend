import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { DealService } from './deal.service';
import { DealController } from './deal.controller';

@Module({
    imports: [DbModule],
    providers: [DealService],
    controllers: [DealController],
    exports:[DealService]
  })
export class DealModule {}
