import { ApiProperty } from "@nestjs/swagger";

export class CreateMakeDto {
    @ApiProperty()
    makeName: string
}