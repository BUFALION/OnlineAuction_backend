import { ApiProperty } from "@nestjs/swagger"

export class MakeDto{
    @ApiProperty()
    id: number
    @ApiProperty()
    makeName: string

}