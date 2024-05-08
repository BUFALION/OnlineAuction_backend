import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateCarDto } from './dto/create-car.dto';
import { CarDto } from './dto/car.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class CarService {
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

    
    const imageUrls = []

    for(const photo of photos) {
      const formData = new FormData()
      formData.append('image', photo.buffer.toString('base64'))

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
      imageUrls.push(data.data.url)
    }
    return this.db.car.update({
      where: {
        id: carId
      },
      data: {
        photos: [...car.photos, ...imageUrls]
      }
    })
  }
}
