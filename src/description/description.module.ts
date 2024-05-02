import { Module } from '@nestjs/common';
import { DescriptionController } from './description.controller';
import { DescriptionService } from './description.service';
import { DbService } from 'src/db/db.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [DescriptionController],
  providers: [DescriptionService]
})
export class DescriptionModule {}
