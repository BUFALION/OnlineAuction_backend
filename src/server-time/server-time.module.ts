import { Module } from '@nestjs/common';
import { ServerTimeController } from './server-time.controller';

@Module({
  controllers: [ServerTimeController]
})
export class ServerTimeModule {}
