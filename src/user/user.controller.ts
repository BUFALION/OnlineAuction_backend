import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { TokenDto } from 'src/token/dto/token.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUser(@SessionInfo() session: GetSessionDto) {
    return await this.userService.getUser(session.id);
  }

  @UseGuards(AuthGuard)
  @Put('company')
  async changeCompany(
    @Query('invitation-token') tokenUuid: string,
    @SessionInfo() session: GetSessionDto,
  ) {
    return await this.userService.changeUserCompany(session, tokenUuid);
  }

  @UseGuards(AuthGuard)
  @Get('company/:companyId')
  async findAllUsersByCompanyId(
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return this.userService.findAllUsersByCompanyId(companyId);
  }
}
