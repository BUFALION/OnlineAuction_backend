import { ApiProperty } from "@nestjs/swagger";

export class TokenDto {
    @ApiProperty()
    token: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    companyId: number;

    @ApiProperty()
    email: string;
}