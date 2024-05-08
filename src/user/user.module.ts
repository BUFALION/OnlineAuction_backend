import { Global, Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from 'src/db/db.module';
import { TokenModule } from 'src/token/token.module';

@Global()
@Module({
  imports: [DbModule, forwardRef(() => TokenModule)],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {

}
