import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto } from './dto/create-company.dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { CompanyDto } from './dto/company.dto';

@Controller('company')
@ApiTags('companys')
export class CompanyController {
  constructor(private readonly companySrvice: CompanyService) {}


  @ApiProperty({
    type: CompanyDto
  })
  @Get(':id')
  async findCompanyById(@Param('id', ParseIntPipe) id: number){
    return await this.companySrvice.findCompanyById(id)
  }

  @ApiProperty({
    type: [CompanyDto]
  })
  @Get()
  async findAllCompany(){
    return this.companySrvice.findAllCompany()
  }



  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: CompanyDto
  })
  @Post()
  async createCompany(
    @Body() body: CreateCompanyDto,
    @SessionInfo() session: GetSessionDto,
  ) {
    return this.companySrvice.createCompany(body,session.id)
  }
}
