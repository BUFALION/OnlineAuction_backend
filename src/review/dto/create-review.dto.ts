import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
      @ApiProperty({
        description: 'Рейтинг, который ставит пользователь (от 1 до 5)',
      })
      @IsInt()
      @Min(1)
      @Max(5)
      rating: number;
    
      @ApiProperty()
      @IsString()
      title: string;

      @ApiProperty()
      @IsString()
      description: string;
}