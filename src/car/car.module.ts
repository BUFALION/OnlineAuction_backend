import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { DbModule } from 'src/db/db.module';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DbModule, HttpModule],
  providers: [CarService],
  controllers: [CarController],
  exports: [CarService],
})
export class CarModule {}
