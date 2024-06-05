import { ApiProperty } from "@nestjs/swagger"
import { Drivetrain } from "@prisma/client"

export class CarDto {
    @ApiProperty()
    id: number
    @ApiProperty()
    companyId: number
    @ApiProperty()
    descriptionId: number
    @ApiProperty()
    year: number
    @ApiProperty()
    mileage: number
    @ApiProperty()
    color: string
    @ApiProperty()
    engine: string
    @ApiProperty({ 
        type: String,
        isArray: true 
    })
    photos: string[]

    @ApiProperty({enum: Drivetrain})
    drivetrain: Drivetrain
}