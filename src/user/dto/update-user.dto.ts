import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ type: 'string', format: 'binary',required: false })
    @IsOptional()
    file?: Express.Multer.File;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNotEmpty({ message: 'First name cannot be empty' })
    firstName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNotEmpty({ message: 'Second name cannot be empty' })
    secondName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsPhoneNumber(null, { message: 'Invalid phone number format' })
    phoneNumber?: string;
}

export class UpdateUser {
    imageUrl?: string;
    firstName?: string;
    secondName?: string;
    phoneNumber?: string;
}