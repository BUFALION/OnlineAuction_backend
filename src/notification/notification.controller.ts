import { Body, Controller, Get, Post, Res, Session, Sse, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { NotificationDto } from './dto/notification.dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { Response } from 'express';
import { Observable, filter, interval, map } from 'rxjs';

@UseGuards(AuthGuard)
@Controller('notification')
export class NotificationController {


  constructor(private readonly notificationService: NotificationService) {}

  @ApiCreatedResponse({
    type: NotificationDto,
  })
  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @SessionInfo() session: GetSessionDto,
  ): Promise<NotificationDto> {
    return await this.notificationService.create(
      createNotificationDto,
      session.id,
    );
  }

  @ApiOkResponse({
    type: [NotificationDto],
  })
  @Get()
  async findByUserId(
    @SessionInfo() session: GetSessionDto,
  ): Promise<NotificationDto[]> {
    return await this.notificationService.findByUserId(session.id);
  }


  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((_) => ({ data: { hello: 'world' } }) as MessageEvent),
    );
  }

  @Sse('test')
  getNotificationByUser(@SessionInfo() session: GetSessionDto){

    // response.writeHead(200, {
    //   'Content-Type': 'text/event-stream',
    //   'Cache-Control': 'no-cache',
    //   'Connection': 'keep-alive',
    //   'Access-Control-Allow-Origin': 'http://localhost:4200', // Убедитесь, что домен вашего клиента указан здесь
    //   'Access-Control-Allow-Credentials': 'true' // Если необходимо разрешить передачу учетных данных через CORS
    // });
    // response.setHeader('Content-Type', 'text/event-stream');

    return this.notificationService.subscribeForUser(session.id)

  }
}
