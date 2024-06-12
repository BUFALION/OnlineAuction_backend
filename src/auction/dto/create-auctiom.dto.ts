import { ApiProperty } from "@nestjs/swagger";
import { Drivetrain } from "@prisma/client";
import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional } from "class-validator";

export class CreateAuctionDto {
  @ApiProperty({
    example: '2024-04-20T12:00:00',
    description: 'The start date and time of the auction.'
  })
  @IsDateString()
  dateStart: Date;

  @ApiProperty({
    example: '2024-04-25T12:00:00',
    description: 'The end date and time of the auction.'
  })
  @IsDateString()
  dateEnd: Date;

  @ApiProperty({
    example: 1000,
    description: 'The starting price of the auction.'
  })
  @IsInt()
  @IsOptional()
  startPrice?: number;

  // @ApiProperty({
  //   example: true,
  //   description: 'Indicates whether offers are allowed on the auction.'
  // })
  // @IsBoolean()
  // @IsOptional()
  // offer?: boolean;


}