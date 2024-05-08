import { Module, forwardRef } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { DbModule } from 'src/db/db.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [DbModule, EmailModule],
  providers: [TokenService],
  controllers: [TokenController],
  exports:[TokenService]
})
export class TokenModule {}
