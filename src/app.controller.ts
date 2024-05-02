import { Controller, Get } from '@nestjs/common';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { DbService } from './db/db.service';


class HelloWorldDto {
  @ApiProperty()
  message: string

}

@Controller()
export class AppController {
  
  constructor(private readonly db: DbService){}

  @Get()
  async getHello(): Promise<HelloWorldDto> {
    
    const users = await this.db.user.findMany({})
    console.log(users)
    return new HelloWorldDto()
  }
}
