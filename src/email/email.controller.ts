import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiProperty } from '@nestjs/swagger';

class Test {
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string
}

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('create')
  @ApiProperty({
    type: {
      Test
    }
  })
  welcomeEmail(@Body() test: Test){
    this.emailService.welcomeEmail(test)
  }
}
