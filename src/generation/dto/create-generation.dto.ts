import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateGenerationDto {
    @ApiProperty()
    @IsNotEmpty()
    modelId: number

    @ApiProperty()
    @IsNotEmpty()
    image: string 

    @ApiProperty()
    @IsNotEmpty()
    generationName: string

    @ApiProperty()
    @IsNotEmpty()
    generationYear: number
}