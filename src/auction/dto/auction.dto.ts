import { ApiProperty } from "@nestjs/swagger";
import { AuctionStatus } from "@prisma/client";
import { IsOptional } from "class-validator";
import { CarDto } from "src/car/dto/car.dto";

export class AuctionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  carId: number;
  
  @ApiProperty()
  dateStart: Date;
  
  @ApiProperty()
  dateEnd: Date;
  
  @ApiProperty()
  @IsOptional()
  startPrice?: number;
  
  // @ApiProperty()
  // @IsOptional()
  // offer?: boolean;
  
  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ enum: AuctionStatus })
  status: AuctionStatus;

  car?: CarDto
}