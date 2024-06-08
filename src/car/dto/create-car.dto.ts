import { ApiProperty } from "@nestjs/swagger"
import { Drivetrain } from "@prisma/client"
import { IsNotEmpty } from "class-validator"

export class CreateCarDto {
    @ApiProperty()
    @IsNotEmpty()
    descriptionId: number

    @ApiProperty()
    @IsNotEmpty()
    generationId: number


    @ApiProperty()
    @IsNotEmpty()
    vin: string

    @ApiProperty()
    @IsNotEmpty()
    year: number

    @ApiProperty()
    @IsNotEmpty()
    mileage: number

    @ApiProperty()
    @IsNotEmpty()
    color: string
    
    @ApiProperty()
    @IsNotEmpty()
    engine: string

    @ApiProperty()
    @IsNotEmpty()
    type: string
    
    
    @IsNotEmpty()
    @ApiProperty()
    photos: string[]

    @ApiProperty({enum: Drivetrain})
    drivetrain: Drivetrain
}