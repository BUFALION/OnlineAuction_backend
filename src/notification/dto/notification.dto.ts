import { ApiProperty } from "@nestjs/swagger"
import { NotificationStatus } from "@prisma/client"

export class NotificationDto {
    @ApiProperty()
    id: number
    @ApiProperty()
    title: string
    @ApiProperty()
    description: string
    @ApiProperty()
    userId: number
    @ApiProperty()
    createdAt: Date
    @ApiProperty()
    status: NotificationStatus
}