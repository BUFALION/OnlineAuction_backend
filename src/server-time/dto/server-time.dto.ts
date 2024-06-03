import { ApiProperty } from "@nestjs/swagger";

export class ServerTimeDto {
    @ApiProperty({ type: String, format: 'date-time' })
    serverTime: string;
  }