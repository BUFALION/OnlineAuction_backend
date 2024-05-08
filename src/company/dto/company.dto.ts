import { ApiProperty } from "@nestjs/swagger";

export class CompanyDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    creatorId: number;

    @ApiProperty()
    companyName: string;

    @ApiProperty()
    createdAt: Date
}