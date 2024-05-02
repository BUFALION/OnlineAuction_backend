import { ApiProperty } from "@nestjs/swagger";

export class BidCreateDto {
    @ApiProperty()
    amount: number
}