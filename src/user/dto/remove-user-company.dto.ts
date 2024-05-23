import { ApiProperty } from "@nestjs/swagger";

export class RemoveUserCompanyDto {
    @ApiProperty()
    userId: number;
}
