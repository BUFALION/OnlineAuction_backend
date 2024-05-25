import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { TokenDto } from 'src/token/dto/token.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { TokenInviteUserDto } from './dto/token-invite-user.dto';
import { RemoveUserCompanyDto } from './dto/remove-user-company.dto';
import { CompanyMemeberGuard } from 'src/company/guards/company-memeber/company-memeber.guard';
import { CompanyOwnerGuard } from 'src/company/guards/company-memeber/company-owner.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

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
    this.userService.removeUserCompany(removeUserCompnay.userId, companyId);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse()
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiOkResponse({
    type: UserDto
  })
  @Put('')
  async updateUser(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @SessionInfo() session: GetSessionDto,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const imageUrl = await this.userService.uploadFile(file);
    return this.userService.updateUser(session.id,{ ...updateUserDto, imageUrl })
  }
}
