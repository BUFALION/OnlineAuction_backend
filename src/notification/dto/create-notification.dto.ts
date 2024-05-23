import { ApiProperty } from "@nestjs/swagger";
import { NotificationInfo, NotificationStatus } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;
  
    @ApiProperty({ enum: NotificationInfo })
    statusInfo: NotificationInfo
  }