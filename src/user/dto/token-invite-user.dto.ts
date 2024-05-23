import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TokenInviteUserDto {
    @ApiProperty()
    @IsString()
    token: string
}