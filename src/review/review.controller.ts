import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReviewDto } from './dto/review.dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('review')
@ApiTags('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // @UseGuards(AuthGuard)
  @Get()
  @ApiOkResponse({
    type: [ReviewDto],
  })
  async findAll(): Promise<ReviewDto[]> {
    return await this.reviewService.findAll();
  }

  @Get('company/:companyId')
  @ApiOkResponse({
    type: [ReviewDto],
  })
  async findAllBySellerId(@Param('companyId', ParseIntPipe)companyId: number): Promise<ReviewDto[]> {
    return await this.reviewService.findByCompanyId(companyId);
  }

  
  @UseGuards(AuthGuard)
  @Post('deal/:dealId')
  @ApiOkResponse({
    type: ReviewDto,
  })
  async create(
    @Body() reviewCreateDto: CreateReviewDto,
    @SessionInfo() session: GetSessionDto,
    @Param('dealId', ParseIntPipe) dealId: number,
  ):Promise<ReviewDto> {
    return await this.reviewService.create(reviewCreateDto,dealId,session.id)
  }
}
