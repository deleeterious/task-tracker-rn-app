import { getStatistics } from '@/api/api';
import { Statistic } from '@/services/types';
import { useStore } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Dimensions, View } from 'react-native';
import { groupDataByDate } from './helpers';
import moment from 'moment';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { SVGRenderer, SkiaChart } from '@wuba/react-native-echarts';
import WeekSwitch from './components/WeekSwitch';
import { Text } from 'react-native-paper';
import Layout from '@/components/Layout';

echarts.use([SVGRenderer, LineChart, GridComponent]);

const Statistics = () => {
  const isFocused = useIsFocused();

  const { userId } = useStore();

  const [statisticsData, setStatisticsData] = useState([]);

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(7, 'days').startOf('day').toDate(),
    endDate: moment().endOf('day').toDate(),
  });

  const preparedData = useMemo(
    () =>
      Object.entries(groupDataByDate(statisticsData))
        .map((item) =>
          item[1].reduce<any>(
            (acc, groupItem) => {
              return { date: item[0], value: acc.value + groupItem.value };
            },
            { value: 0 },
          ),
        )
        .filter((item) =>
          moment(item.date).isBetween(moment(selectedDateRange.startDate), moment(selectedDateRange.endDate)),
        ),
    [statisticsData, selectedDateRange],
  );

  const handleSwitchForward = () => {
    setSelectedDateRange((prev) => ({
      startDate: moment(prev.startDate).add(7, 'days').startOf('day').toDate(),
      endDate: moment(prev.endDate).add(7, 'days').endOf('day').toDate(),
    }));
  };
  const handleSwitchBack = () => {
    setSelectedDateRange((prev) => ({
      startDate: moment(prev.startDate).subtract(7, 'days').startOf('day').toDate(),
      endDate: moment(prev.endDate).subtract(7, 'days').endOf('day').toDate(),
    }));
  };

  const skiaRef = useRef<any>(null);
  useEffect(() => {
    const option = {
      xAxis: {
        type: 'category',
        data: preparedData.map((item) => moment(item.date).format('DD.MM')),
      },
      yAxis: {
        type: 'value',
        data: preparedData.map((item) => item.value),
        axisLabel: {
          formatter: (value: number) => {
            const duration = moment.utc(value).format('HH:mm');

            return duration;
          },
        },
      },
      series: [
        {
          data: preparedData.map((item) => item.value),
          type: 'line',
        },
      ],
    };
    let chart: any;
    if (skiaRef.current) {
      chart = echarts.init(skiaRef.current, 'light', {
        renderer: 'svg',
        width: 400,
        height: 300,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, [preparedData]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getStatistics();

        setStatisticsData(res);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, [isFocused, userId]);

  return (
    <Layout title='Statistic'>
      <WeekSwitch
        onSwitchBack={handleSwitchBack}
        onSwitchForward={handleSwitchForward}
        currentRange={selectedDateRange}
      />
      {preparedData.length ? <SkiaChart ref={skiaRef} /> : <Text>No data recorded</Text>}
    </Layout>
  );
};

export default Statistics;
