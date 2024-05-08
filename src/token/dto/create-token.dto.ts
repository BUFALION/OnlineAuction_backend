import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator"

export class CreateTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    companyId: number
}