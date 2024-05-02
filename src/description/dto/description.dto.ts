import { ApiProperty } from "@nestjs/swagger"

export class DescriptionDto{
    @ApiProperty()
    id: number
    @ApiProperty()
    title: string
    @ApiProperty()
    description: string
}