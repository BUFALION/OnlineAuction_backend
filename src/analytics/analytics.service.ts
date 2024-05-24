import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { DbService } from 'src/db/db.service';


interface Summarizable {
  amount : number;
  createdAt: Date;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly db: DbService) {}

  async getDailyBidsCompany(companyId: number) {
    const dailyBids = await this.getDailyData(() =>
      this.db.bid.findMany({
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
      }),
    );

    // const bids = await this.db.bid.findMany({
    //   where: {
    //     auction: {
    //       car: {
    //         companyId,
    //       },
    //     },
    //   },
    //   select: {
    //     amount: true,
    //     createdAt: true,
    //   },
    // });

    return dailyBids
  }

  async getDailyPaymentCompany(companyId: number) {
    
    const payments = await this.db.deal.findMany({
      
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
    return this.formateData(payments)
  }

  private formateData(object) {
    const amountsByDay = object.reduce((acc, curr) => {
      const day = curr.createdAt.toISOString().split('T')[0]; // Extracting date part
      acc[day] = (acc[day] || 0) + curr.price;
      return acc;
    }, {});

    return Object.keys(amountsByDay).map((day) => ({
      day,
      sum: amountsByDay[day],
    }));
  }



  async getDailyData<T extends Summarizable>(getDataFn: () => Promise<T[]>) {
    const data = await getDataFn();
    return this.formatData(data);
  }

  private formatData<T extends Summarizable>(data: T[]) {
    const amountsByDay = data.reduce((acc, curr) => {
      const day = curr.createdAt.toISOString().split('T')[0]; // Extracting date part
      acc[day] = (acc[day] || 0) + curr.amount;
      return acc;
    }, {});

    return Object.keys(amountsByDay).map((day) => ({
      day,
      sum: amountsByDay[day],
    }));
  }
}
