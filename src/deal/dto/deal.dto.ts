import { ApiProperty } from '@nestjs/swagger';
import { DealStatus } from '@prisma/client';

export class DealDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  auctionId: number;
  @ApiProperty()
  sellerId: number;
  @ApiProperty()
  buyerId: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  paymentAt?: Date;
  @ApiProperty()
  confirmedAt?: Date;
  @ApiProperty({ enum: DealStatus })
  status: DealStatus;
}
