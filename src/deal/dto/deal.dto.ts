import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DealStatus } from '@prisma/client';
import { AuctionDto } from 'src/auction/dto/auction.dto';
import { PaymentDto } from 'src/payment-stripe/dto/payment.dto';

export class DealDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  auctionId: number;
  @ApiProperty()
  companyId: number;
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

  @ApiProperty({
    description: 'Payment details (optional)',
    required: false,
    type: PaymentDto,
  })
  payment?: PaymentDto;
  Auction?: AuctionDto
}
