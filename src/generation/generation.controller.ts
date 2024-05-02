import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GenerationDto } from './dto/generation.dto';
import { CreateGenerationDto } from './dto/create-generation.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from 'src/shared/dto/files-upload.dto';
import { GenerationService } from './generation.service';

@Controller('generation')
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Get()
  @ApiCreatedResponse({
    type: [GenerationDto],
  })
  async getAll(): Promise<GenerationDto[]> {
    return this.generationService.findAll();
  }

  @Get(':generationId')
  @ApiOkResponse({
    type: GenerationDto,
  })
  async findById(@Param('generationId', ParseIntPipe) generationId: number) {
    return await this.generationService.findById(generationId);
  }

  @Get('model/:modelId')
  @ApiOkResponse({
    type: [GenerationDto],
  })
  async findByModelId(@Param('modelId', ParseIntPipe) modelId: number) {
    return await this.generationService.findByModelId(modelId);
  }

  @Post()
  @ApiCreatedResponse({
    type: GenerationDto,
  })
  async create(
    @Body() createMakeDto: CreateGenerationDto,
  ): Promise<GenerationDto> {
    return this.generationService.create(createMakeDto);
  }

  @Patch('upload/:generationId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  async uploadPhoto(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('generationId', ParseIntPipe) generationId: number,
  ) {
    return this.generationService.uploadImage(generationId, file);
  }

  @Delete(':generationId')
  @ApiOkResponse()
  deleteById(@Param('generationId', ParseIntPipe) generationId: number ) {
    this.generationService.deleteById(generationId)
  }
}
