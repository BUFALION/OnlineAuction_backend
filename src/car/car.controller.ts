import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Param,
  ParseIntPipe,
  Patch,
  UseInterceptors,
  UploadedFiles,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { CarService } from './car.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CarDto } from './dto/car.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesUploadDto } from 'src/shared/dto/files-upload.dto';
import { CompanyMemeberGuard } from 'src/company/guards/company-memeber/company-memeber.guard';

@Controller('car')
@ApiTags('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  @ApiOkResponse({
    type: [CarDto],
  })
  async getCars(): Promise<CarDto[]> {
    return await this.carService.getCars();
  }

  @UseGuards(AuthGuard)
  @Get('company/:companyId')
  @ApiOkResponse({
    type: [CarDto],
  })
  async getCarByCompanyId(
    @Param('companyId', ParseIntPipe) companyId: number,
  ): Promise<CarDto[]> {
    return await this.carService.getCarByCompanyId(companyId);
  }

  @Get(':carId')
  @ApiOkResponse({
    type: CarDto,
  })
  async getCarById(@Param('carId', ParseIntPipe) carId: number) {
    return await this.carService.getCarById(carId);
  }

  @UseGuards(AuthGuard,CompanyMemeberGuard)
  @Post('company/:companyId')
  @ApiOkResponse({
    type: CarDto,
  })
  async createCar(
    @Body() body: CreateCarDto,
    @Param('companyId', ParseIntPipe) companyId: number
  ) {
    return await this.carService.createCar(body, companyId);
  }

  @UseGuards(AuthGuard)
  @Patch('upload/:carId')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of car images',
    type: FilesUploadDto ,
  })
  async uploadPhotos(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({fileType: '.(png|jpeg|jpg)'}),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      })
    )
    files: Array<Express.Multer.File>,
    @Param('carId', ParseIntPipe) carId: number
  ) {
    return this.carService.uploadPhotos(carId,files)
  }
}
