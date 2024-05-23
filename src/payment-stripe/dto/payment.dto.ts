import { ApiProperty } from "@nestjs/swagger";
import { PaymentStatus } from "@prisma/client";
import { DealDto } from "src/deal/dto/deal.dto";

export class PaymentDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    url: string;

    @ApiProperty()
    dealId: number;
    
    @ApiProperty()
    createdAt: Date;

    @ApiProperty({enum:PaymentStatus })
    status: PaymentStatus;

    deal?: DealDto
}