import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { TotalCompanyDto } from './dto/total-company.dto';

interface Summarizable {
  amount: number;
  createdAt: Date;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly db: DbService) {}

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

    return this.getDailyData(dailyBids);
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

    return this.getDailyData(FormatedDailyPayments);
  }
  
  async getBidCountForCompany(companyId: number): Promise<number> {
    const bidCount = await this.db.bid.count({
      where: {
        auction:{
          car: {
            companyId
          }
        }
      },
    });

    return bidCount;
  }

  async getAuctionCountForCompany(companyId: number): Promise<number> {
    const auctionCount = await this.db.auction.count({
      where: {
        car: {
          companyId
        }
      }
    })
    return auctionCount
  }

  async getDealCountForCompany(companyId: number): Promise<number> {
    const dealCount = await this.db.deal.count({
      where: {
        companyId
      }
    })
    return dealCount
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
    return payment._sum.price || 0
  }

  async getTotalAnalyticsCompany(companyId: number): Promise<TotalCompanyDto> {
    return {
      dealCount: await this.getDealCountForCompany(companyId),
      auctionCount: await this.getAuctionCountForCompany(companyId),
      bidCount: await this.getBidCountForCompany(companyId),
      paymentSum: await this.getPaymentSumForCompany(companyId)
    }
  }


  private getDailyData = <T extends Summarizable>(data: T[]) =>
    this.formatData(data);

  private formatData<T extends Summarizable>(
    data: T[],
    dateStart: Date = new Date('2024-04-25'),
    dateEnd: Date = new Date(Date.now()),
  ) {
    const amountsByDay = data.reduce((acc, curr) => {
      const day = curr.createdAt.toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + curr.amount;
      return acc;
    }, {});

    const dates = [];
    let currentDate = new Date(dateStart);

    while (currentDate <= dateEnd) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates.map((date) => {
      const day = date.toISOString().split('T')[0];
      return {
        day,
        sum: amountsByDay[day] || 0,
      };
    });
  }
}
