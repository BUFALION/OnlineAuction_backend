import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { FavoriteDto } from './dto/favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(private readonly db: DbService) {}

  async findAll(): Promise<FavoriteDto[]> {
    return await this.db.favorite.findMany();
  }

  async isAuctionFavorite(aucitonId: number, userId: number): Promise<boolean> {
    const favorite = await this.db.favorite.findFirst({
      where: {
        auctionId: aucitonId,
        userId: userId
      }
    })
    return favorite !== null
  }

  async findAllByUserId(userId: number): Promise<FavoriteDto[]> {
    return await this.db.favorite.findMany({ 
      where: { userId: userId },
      include: { 
        auction: true 
      } 
    });
  }

  async create(userId: number, auctionId: number): Promise<FavoriteDto> {
    try {
      return await this.db.favorite.create({
        data: {
          userId: userId,
          auctionId: auctionId,
        },
        
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('This auction is already in favorites.');
      } else {
        throw new InternalServerErrorException('Something went wrong.');
      }
    }
  }

  async delete(userId: number, auctionId: number): Promise<FavoriteDto> {
    const favorite = await this.db.favorite.findFirst({
      where: { auctionId: auctionId, userId: userId },
    });

    if (!favorite) throw new NotFoundException('Favorite not found.');

    return await this.db.favorite.delete({
      where: {
        id: favorite.id,
      },
    });
  }
}
