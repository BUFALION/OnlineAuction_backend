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
    companyId: number;
    
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    buyerId: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    price: number;
}