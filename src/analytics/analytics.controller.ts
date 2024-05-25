import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { DbService } from 'src/db/db.service';
import { AnalyticsService } from './analytics.service';
import { TotalCompanyDto } from './dto/total-company.dto';

@Controller('analytics')
@ApiTags('analytics')
export class AnalyticsController {
  jwtClient: any;
  private config: any;

  private analyticsDataClient;
  constructor(
    private readonly db: DbService,
    private readonly analyticsService: AnalyticsService,
  ) {
    this.analyticsDataClient = new BetaAnalyticsDataClient();
  }

  @Get()
  async getAuctionsByUser(userId = 1): Promise<any> {
    try {
      const propertyId = 441851623;
      const auctionIds = ['1', '2', '3']; // Массив идентификаторов аукционов

      const allAuctionData = [];

      for (const auctionId of auctionIds) {
        const [response] = await this.analyticsDataClient.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [
            {
              startDate: '2023-01-01',
              endDate: '2023-12-31',
            },
          ],
          dimensions: [
            {
              name: 'eventCategory',
            },
            {
              name: 'eventLabel',
            },
          ],
          metrics: [
            {
              name: 'eventCount', // Обратите внимание на корректное имя метрики
            },
          ],
          dimensionFilter: {
            filter: {
              fieldName: 'eventLabel',
              stringFilter: {
                matchType: 'EXACT',
                value: `auction_id_${auctionId}`,
              },
            },
          },
        });

        allAuctionData.push(response);
      }

      return allAuctionData;
    } catch (error) {
      console.error('Error retrieving data from Google Analytics:', error);
      throw error;
    }
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

  // async generateRandomBids(auctionId = 1, numberOfBids = 100) {
  //   const bids = [];
  //   const nextDay = new Date();
  //   nextDay.setDate(nextDay.getDate() + 1);
  //   for (let i = 0; i < numberOfBids; i++) {
  //     const amount = Math.random() * 1000; // Генерация случайной суммы ставки

  //     const createdBid = await this.db.bid.create({
  //       data: {
  //         amount,
  //         userId: 1, // Здесь вы должны указать ID пользователя, сделавшего ставку
  //         auctionId,
  //         createdAt: nextDay,
  //       },
  //     });

  //     bids.push(createdBid);
  //   }

  //   return bids;
  // }
}
