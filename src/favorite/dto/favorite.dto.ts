import { ApiProperty } from '@nestjs/swagger';

export class FavoriteDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  auctionId: number;
}
