import {DateTime} from 'luxon';

export function getElapsedDays(date: string): string {
  if (!date) {
    return '1';
  }
  const datetime = DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss');
  // 0시 0분 0초를 기준으로 사용
  datetime.set({hour: 0, minute: 0, second: 0, millisecond: 0});

  const startOfDay = datetime.startOf('day');
  // @ts-ignore
  const elapsed = datetime.diff(startOfDay, 'days').toObject().days + 1;

  return Math.ceil(elapsed).toString();
}
