import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateDealDto {
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    auctionId: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    sellerId: number;
    
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    buyerId: number;
}