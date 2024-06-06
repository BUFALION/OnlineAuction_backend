import { Summarizable } from '../interfaces/summarizable.interface';

export const transformDataGA4 = (data: ResponseGA4) => transform(data);

function transform(data: ResponseGA4): Summarizable[] {
  return data.rows.map((row) => {
    const dateStr = row.dimensionValues[0].value;
    const createdAt = new Date(
      `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6)}`,
    );
    const amount = parseInt(row.metricValues[0].value, 10);
    return { createdAt: createdAt, amount: amount };
  });
}
