import moment from 'moment';
import { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';

interface TimeSpendProps {
  startTime: string;
  initialTime?: number;
  isActive: boolean;
}

const TimeSpend = ({ startTime, initialTime, isActive }: TimeSpendProps) => {
  const [time, setTime] = useState<number>(initialTime ?? 0);

  const duration = moment.duration(time, 'milliseconds');

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(
        () => setTime(Number(new Date()) - Number(new Date(startTime)) + (initialTime ?? 0)),
        1000,
      );

      return () => clearInterval(interval);
    }
  }, [startTime, isActive]);

  return <Text>{`${duration.days()}:${duration.hours()}:${duration.minutes()}:${duration.seconds()}`}</Text>;
};

export default TimeSpend;
