import { Module } from '@nestjs/common';
import { MakeController } from './make.controller';
import { MakeService } from './make.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [MakeController],
  providers: [MakeService]

})
export class MakeModule {}
