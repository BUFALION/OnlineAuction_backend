import {
  Body,
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
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { TokenInviteUserDto } from './dto/token-invite-user.dto';
import { RemoveUserCompanyDto } from './dto/remove-user-company.dto';
import { CompanyMemeberGuard } from 'src/company/guards/company-memeber/company-memeber.guard';
import { CompanyOwnerGuard } from 'src/company/guards/company-memeber/company-owner.guard';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUser(@SessionInfo() session: GetSessionDto) {
    return await this.userService.getUser(session.id);
  }

  @Get(':email')
  async getUserById(@Param('email') email: string) {
    return await this.userService.findByEmail(email);
  }

  @UseGuards(AuthGuard)
  @Get('company/:companyId')
  async findAllUsersByCompanyId(
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return this.userService.findAllUsersByCompanyId(companyId);
  }

  @UseGuards(AuthGuard)
  @Put('company')
  async changeCompany(
    @Body() token: TokenInviteUserDto,
    @SessionInfo() session: GetSessionDto,
  ) {
    return await this.userService.changeUserCompany(session, token.token);
  }

  @UseGuards(AuthGuard, CompanyOwnerGuard)
  @ApiOkResponse()
  @Put('company/:companyId')
  async removeCompanyUser(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Body() removeUserCompnay: RemoveUserCompanyDto,
  ) {
    this.userService.removeUserCompany(removeUserCompnay.userId,companyId)
  }
}