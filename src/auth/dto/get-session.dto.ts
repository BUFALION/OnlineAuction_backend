import { ApiProperty } from "@nestjs/swagger";

export class GetSessionDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    email:string

    @ApiProperty()
    "lat": number;

    @ApiProperty()
    "exp": number;
}