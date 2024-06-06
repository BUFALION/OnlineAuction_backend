import { Summarizable } from '../interfaces/summarizable.interface';

export const getDailyData = <T extends Summarizable>(data: T[]) =>
  formatData(data);

function formatData<T extends Summarizable>(
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
