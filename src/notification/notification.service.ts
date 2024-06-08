import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { filter, fromEvent } from 'rxjs';
import { EventEmitter } from 'events';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {
  private readonly emitter = new EventEmitter();

  constructor(
    private readonly db: DbService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async create(
    createNotificationDto: CreateNotificationDto,
    userId: number,
  ): Promise<NotificationDto> {
    const notification: NotificationDto = await this.db.notification.create({
      data: { ...createNotificationDto, userId: userId },
    });
    this.emit(notification);
    return notification;
  }
  public async findByUserId(userId: number): Promise<NotificationDto[]> {
    return await this.db.notification.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  emit(notification: NotificationDto) {
    this.eventEmitter.emit('test', JSON.stringify(notification));
  }

  subscribeForUser(userId: number) {
    return fromEvent(this.eventEmitter, 'test').pipe(
      filter(
        (notification: string) => JSON.parse(notification)?.userId === userId,
      ),
    );
  }
}
