import { ApiProperty } from '@nestjs/swagger';

export class ReviewDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  dealId: number;

  @ApiProperty()
  reviwerId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
