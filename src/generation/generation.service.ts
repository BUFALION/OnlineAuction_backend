import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateGenerationDto } from './dto/create-generation.dto';
import { GenerationDto } from './dto/generation.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class GenerationService {
  constructor(
    private readonly db: DbService,
    private readonly httpService: HttpService,
  ) {}

  async create(
    createGenerationDto: CreateGenerationDto,
  ): Promise<GenerationDto> {
    return await this.db.generation.create({
      data: { ...createGenerationDto },
    });
  }
  async findAll(): Promise<GenerationDto[]> {
    return await this.db.generation.findMany();
  }

  async findById(generationId: number) {
    const generation = await this.db.generation.findUnique({ 
      where: { id: generationId }, 
      include: { 
        model: { 
          include: { 
            make: true // Включаем свойство make модели
          } 
        } 
      }
    })

    if (!generation) {
      throw new NotFoundException(`Generation with id ${generationId} not found`);
    }
    return generation;
  }

  async findByModelId(modelId: number) {
    return await this.db.generation.findMany({
      where: {modelId: modelId }
    })
  }

  async deleteById(generationId: number){
    this.db.generation.delete({
        where:{ id: generationId}
    })
  }

  async uploadImage(generationId: number, photo: Express.Multer.File) {
    const generation = await this.findById(generationId);

    const formData = new FormData();
    formData.append('image', photo.buffer.toString('base64'));

    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `https://api.imgbb.com/1/upload?key=${process.env.IMG_API_KEY}`,
          formData,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );

    return this.db.generation.update({
        where: {id: generation.id},
        data: {
            image: data.data.url
        }
    })
  }
}
