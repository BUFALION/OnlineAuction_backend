import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from 'class-validator';

export class CompanyUpdateDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    companyName?: string;
  
    @ApiProperty({ type: 'string', format: 'binary' })
    file?: any
}

export class CompanyUpdate {
    companyName?: string;
    imageUrl?: string
}