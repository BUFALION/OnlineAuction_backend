import { Module } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { GenerationController } from './generation.controller';
import { DbModule } from 'src/db/db.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DbModule, HttpModule],
  providers: [GenerationService],
  controllers: [GenerationController]
})
export class GenerationModule {}
