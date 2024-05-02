import { ApiProperty } from "@nestjs/swagger"

export class GenerationDto {
    @ApiProperty()
    id: number
    @ApiProperty()
    modelId: number
    @ApiProperty()
    image: string
    @ApiProperty()
    generationName: string
    @ApiProperty()
    generationYear: number

}