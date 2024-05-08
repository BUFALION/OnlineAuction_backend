import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Body,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { GetSessionDto } from './dto/get-session.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CookieService } from './cookie.service';
import { AuthGuard } from './guard/auth.guard';
import { SessionInfo } from './session-info.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('sign-up')
  @ApiCreatedResponse()
  async signUp(
    @Body() body: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signUp(
      body.email,
      body.password,
    );
    this.cookieService.setToken(res, accessToken);
  }

  @Post('sign-in')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signIn(
      body.email,
      body.password,
    );
    
    this.cookieService.setToken(res, accessToken);
  }

  @Post('sign-out')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  signOut(@Res({ passthrough: true }) res: Response) {
    this.cookieService.removeToken(res);
  }

  @Get('session')
  @ApiOkResponse({
    type: GetSessionDto,
  })
  @UseGuards(AuthGuard)
  getSessionInfo(@SessionInfo() session: GetSessionDto) {
    return session;
  }
}
