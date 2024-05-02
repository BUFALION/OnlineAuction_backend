import { ApiProperty } from "@nestjs/swagger";
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
  
  }