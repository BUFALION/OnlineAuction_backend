import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateCarDto } from './dto/create-car.dto';
import { CarDto } from './dto/car.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class CarService {
  private readonly logger = new Logger(CarService.name);

  constructor(
    private readonly db: DbService,
    private readonly httpService: HttpService,
  ) {}

  async getCarById(carId: number) {
    const car = await this.db.car.findUnique({ where: { id: carId } });

    if (!car) {
      throw new NotFoundException(`Car with id ${carId} not found`);
    }
    return car;
  }

  async getCarByCompanyId(companyId: number): Promise<CarDto[]> {
    const cars = await this.db.car.findMany({
      where: {
        companyId: companyId,
      },
    });
    return cars;
   
  }

  async getCars() {
    return await this.db.car.findMany();
  }

  async createCar(carCreateDto: CreateCarDto, companyId: number) {
    return await this.db.car.create({
      data: {
        ...carCreateDto,
        companyId: companyId
        
      },
    });
  }
  updateCar() {}
  deleteCar() {}



  async isCarOwner(carId: number, companyId: number): Promise<boolean> {
    const car = await this.getCarById(carId);
    return car.companyId === companyId;
  }

  async uploadPhotos(carId: number, photos: Array<Express.Multer.File>) {
    const car = await this.getCarById(carId);

    const imageUrls = [];
    for (const photo of photos) {
      const formData = new FormData();
      formData.append('image', photo.buffer.toString('base64'));

      try {
        this.logger.log(`Uploading photo for car ID: ${carId} to external service`);
        const { data } = await firstValueFrom(
          this.httpService
            .post(
              `https://api.imgbb.com/1/upload?key=${process.env.IMG_API_KEY}`,
              formData,
            )
            .pipe(
              catchError((error: AxiosError) => {
                this.logger.error('Error uploading to external service', error.stack);
                throw error;
              }),
            ),
        );
        imageUrls.push(data.data.url);
        this.logger.log(`Photo uploaded successfully for car ID: ${carId}`);
      } catch (error) {
        this.logger.error(`Failed to upload photo for car ID: ${carId}`, error.stack);
        throw error;
      }
    }

    try {
      const result = await this.db.car.update({
        where: { id: carId },
        data: { photos: [...car.photos, ...imageUrls] },
      });
      this.logger.log(`Database update successful for car ID: ${carId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update database for car ID: ${carId}`, error.stack);
      throw error;
    }
  }
}
