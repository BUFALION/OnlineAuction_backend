import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { TotalCompanyDto } from './dto/total-company.dto';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { Summarizable } from './interfaces/summarizable.interface';
import { transformDataGA4 } from './helpers/transformDataGA4';
import { getDailyData } from './helpers/transfromDailyData';
import { AuctionService } from 'src/auction/auction.service';

@Injectable()
export class AnalyticsService {
  private analyticsDataClient;
  constructor(
    private readonly db: DbService,
    
    private readonly auctionService: AuctionService
  ) {
    this.analyticsDataClient = new BetaAnalyticsDataClient()
  }

  async getDailyBidsCompany(companyId: number) {
    const dailyBids = await this.db.bid.findMany({
      where: {
        auction: {
          car: {
            companyId,
          },
        },
      },
      select: {
        amount: true,
        createdAt: true,
      },
    });

    return getDailyData(dailyBids);
  }
  
  async getDailyPaymentCompany(companyId: number) {
    const dailyPayments = await this.db.deal.findMany({
      where: {
        companyId,
        payment: {
          status: PaymentStatus.PAID,
        },
      },
      select: {
        price: true,
        createdAt: true,
      },
    });

    const FormatedDailyPayments: Summarizable[] = dailyPayments.map(
      (payment) => ({
        amount: payment.price,
        createdAt: payment.createdAt,
      }),
    );

    return getDailyData(FormatedDailyPayments);
  }

  async getBidCountForCompany(companyId: number): Promise<number> {
    const bidCount = await this.db.bid.count({
      where: {
        auction: {
          car: {
            companyId,
          },
        },
      },
    });

    return bidCount;
  }

  async getAuctionCountForCompany(companyId: number): Promise<number> {
    const auctionCount = await this.db.auction.count({
      where: {
        car: {
          companyId,
        },
      },
    });
    return auctionCount;
  }

  async getDealCountForCompany(companyId: number): Promise<number> {
    const dealCount = await this.db.deal.count({
      where: {
        companyId,
      },
    });
    return dealCount;
  }

  async getPaymentSumForCompany(companyId: number): Promise<number> {
    const payment = await this.db.deal.aggregate({
      where: {
        companyId: companyId,
        payment: {
          status: PaymentStatus.PAID,
        },
      },
      _sum: {
        price: true,
      },
    });
    return payment._sum.price || 0;
  }

  async getTotalAnalyticsCompany(companyId: number): Promise<TotalCompanyDto> {
    return {
      dealCount: await this.getDealCountForCompany(companyId),
      auctionCount: await this.getAuctionCountForCompany(companyId),
      bidCount: await this.getBidCountForCompany(companyId),
      paymentSum: await this.getPaymentSumForCompany(companyId),
    };
  }

  async getCountCompnayAuctionsView(companyId: number) {
    const propertyId = 441851623;
    
    const auctionUrls = (await this.auctionService.findAuctionsByComapnyId(companyId)).map(
      auction => `/auction/details/${auction.id}`
    ) 
    // @ts-ignore CONVERT TO GOOGLE INTERFACE
    const [response]: [ResponseGA4] = await this.analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'yesterday',
        },
      ],
      dimensions: [
        {
          name: 'date',
        },
      ],
      metrics: [
        {
          name: 'screenPageViews',
        },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          inListFilter: {
            values: auctionUrls,
          },
        },
      },
      orderBys: [
        {
          dimension: {
            orderType: 'ALPHANUMERIC',
            dimensionName: 'date',
          },
        },
      ],
      keepEmptyRows: true,
    });

    const transformData = transformDataGA4(response);

    return getDailyData(transformData);
  }
}
