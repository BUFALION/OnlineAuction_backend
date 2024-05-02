import { ApiProperty } from "@nestjs/swagger"

export class CreateModelDto {
    @ApiProperty()
    makeId: number

    @ApiProperty()
    modelName: string
}