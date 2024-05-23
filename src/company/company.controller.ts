import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCompanyDto } from './dto/create-company.dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { CompanyDto } from './dto/company.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompanyUpdateDto } from './dto/company-update.dto';

@Controller('company')
@ApiTags('companys')
export class CompanyController {
  constructor(private readonly companySrvice: CompanyService) {}

  @ApiProperty({
    type: CompanyDto,
  })
  @Get(':id')
  async findCompanyById(@Param('id', ParseIntPipe) id: number) {
    return await this.companySrvice.findCompanyById(id);
  }

  @ApiProperty({
    type: [CompanyDto],
  })
  @Get()
  async findAllCompany() {
    return this.companySrvice.findAllCompany();
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: CompanyDto,
  })
  @Post()
  async createCompany(
    @Body() body: CreateCompanyDto,
    @SessionInfo() session: GetSessionDto,
  ) {
    return this.companySrvice.createCompany(body, session.id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CompanyUpdateDto,
  })
  async updateCompany(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() companyUpdateDto: CompanyUpdateDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const imageUrl = await this.companySrvice.uploadFile(file);
    return this.companySrvice.updateCompany(id,{ ...companyUpdateDto, imageUrl })
  }
}