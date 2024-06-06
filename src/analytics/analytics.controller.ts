import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { TotalCompanyDto } from './dto/total-company.dto';

@Controller('analytics')
@ApiTags('analytics')
export class AnalyticsController {

  constructor(
    private readonly analyticsService: AnalyticsService) {}

  @Get('view/:companyId')
  async getCountCompnayAuctionsView(@Param('companyId', ParseIntPipe) companyId: number) {
    return await this.analyticsService.getCountCompnayAuctionsView(companyId)
  }

  @Get('company/:companyId')
  async getBidsByDay(@Param('companyId', ParseIntPipe) companyId: number) {
    return await this.analyticsService.getDailyBidsCompany(companyId);
  }

  @Get('payment/:companyId')
  async getDailyPaymentCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return await this.analyticsService.getDailyPaymentCompany(companyId);
  }

  @ApiOkResponse({
    type: TotalCompanyDto,
  })
  @Get('company/total/:companyId')
  async getTotalAnalyticsCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return await this.analyticsService.getTotalAnalyticsCompany(companyId);
  }
}
