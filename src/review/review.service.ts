import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { DealService } from 'src/deal/deal.service';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly db: DbService,
    private readonly dealService: DealService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    dealId: number,
    reviewrId: number,
  ): Promise<ReviewDto> {
    const deal = await this.dealService.findById(dealId);

    const reviewExists = await this.db.review.findUnique({
      where: { dealId: deal.id },
    });

    if (reviewExists) {
      throw new ConflictException(
        `A review with dealId ${reviewExists.id} already exists.`,
      );
    }
    if (deal.buyerId !== reviewrId) {
      throw new ForbiddenException(
        `Reviewer with ID ${reviewrId} is not authorized to review this deal.`,
      );
    }

    const review = await this.db.review.create({
      data: {
        ...createReviewDto,
        dealId: deal.id,
        reviwerId: reviewrId,
      },
    });
    return review;
  }

  async findAll(): Promise<ReviewDto[]> {
    return this.db.review.findMany();
  }

  //   const deals = await this.dealService.findBySellerId(sellerId)
  //REFACTORING
  async findByCompanyId(companyId: number) {
    const reviews = await this.db.review.findMany({
      where: {
        deal: {
          companyId: companyId,
        },
      },
      include: {
        reviewr: true
      }
    });

    return reviews
  }
}
