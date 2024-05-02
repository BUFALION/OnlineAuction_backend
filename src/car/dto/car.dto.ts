import { ApiProperty } from "@nestjs/swagger"

export class CarDto {
    @ApiProperty()
    id: number
    @ApiProperty()
    sellerId: number
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
}