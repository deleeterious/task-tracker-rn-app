import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from 'react-native-paper';
import { FC } from 'react';
import moment from 'moment';

interface WeekSwitchProps {
  onSwitchForward: () => void;
  onSwitchBack: () => void;
  currentRange: { startDate: Date; endDate: Date };
}

const WeekSwitch: FC<WeekSwitchProps> = ({ currentRange, onSwitchBack, onSwitchForward }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
      <Pressable onPress={onSwitchBack}>
        <Ionicons name='arrow-back-circle' size={32} color='black' />
      </Pressable>
      <Text>
        {moment(currentRange.startDate).format('DD.MM')} - {moment(currentRange.endDate).format('DD.MM')}
      </Text>
      <Pressable onPress={onSwitchForward}>
        <Ionicons name='arrow-forward-circle' size={32} color='black' />
      </Pressable>
    </View>
  );
};

export default WeekSwitch;
