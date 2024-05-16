import { Statistic } from '@/services/types';
import groupBy from 'lodash.groupby';
import moment from 'moment';

export const groupDataByDate = (data: Statistic[]) => {
  return groupBy(data, (item) => {
    return moment(item.date).startOf('day').format();
  });
};
