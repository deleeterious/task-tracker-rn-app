import { Pressable, StyleSheet, View } from 'react-native';
import { Task, TaskStatus } from '@/services/types';
import { Text } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Route } from '@/routes/types';
import { deleteTask, getTasks, patchTask, postStatistic } from '@/api/api';
import TimeSpend from '@/components/TimeSpend';
import { useStore } from '@/store';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface TaskListItemProps {
  data: Task;
  updateTasksList: (tasks: Task[]) => void;
}

const useRenderRightAction = (taskId: string, updateTasksList: (tasks: Task[]) => void) => {
  const navigation = useNavigation<any>();

  const handleEdit = () => {
    navigation.navigate(Route.TaskDetails, { isEdit: true, taskId: taskId });
  };

  const handleDeletePress = async () => {
    if (taskId) {
      await deleteTask(taskId);
      navigation.navigate(Route.TaskList);

      const tasks = await getTasks();
      updateTasksList(tasks);
    }
  };

  return () => (
    <View style={style.swipeActionsContainer}>
      <Pressable onPress={handleEdit}>
        <Ionicons name='pencil-outline' size={32} color='black' />
      </Pressable>
      <Pressable onPress={handleDeletePress}>
        <Ionicons name={'trash-outline'} size={32} color='black' />
      </Pressable>
    </View>
  );
};

const TaskListItem = ({ data, updateTasksList }: TaskListItemProps) => {
  const navigation = useNavigation<any>();

  const { updateActiveTask, userId } = useStore();

  const renderRightAction = useRenderRightAction(data.id, updateTasksList);

  const isActive = data.status === TaskStatus.ACTIVE;

  const handlePressItem = () => {
    navigation.navigate(Route.TaskDetails, {
      taskId: data.id,
    });
  };

  const handlePressStart = async () => {
    const res = await patchTask(data.id, {
      ...(data.status === TaskStatus.NOT_STARTED && { firstTimeStart: new Date().toISOString() }),
      startTime: new Date().toISOString(),
      status: TaskStatus.ACTIVE,
    });
    const tasks = await getTasks();

    updateTasksList(tasks);

    updateActiveTask(res);
  };

  const handlePressPause = async () => {
    await patchTask(data.id, {
      startTime: new Date().toISOString(),
      timeSpend: Number(new Date()) - Number(new Date(data.startTime ?? '')) + (data.timeSpend ?? 0),
      status: TaskStatus.PAUSED,
    });
    const tasks = await getTasks();

    await postStatistic({
      date: new Date().toISOString(),
      value: Number(new Date()) - Number(new Date(data.startTime ?? '')),
      userId: userId!,
    });

    updateTasksList(tasks);

    updateActiveTask(null);
  };

  return (
    <Swipeable renderRightActions={renderRightAction}>
      <Pressable onPress={handlePressItem}>
        <View style={style.container}>
          <Text>{data.title}</Text>
          <View style={style.rightContainer}>
            {data.startTime ? (
              <TimeSpend startTime={data.startTime} initialTime={data.timeSpend} isActive={isActive} />
            ) : null}
            {data.status === TaskStatus.COMPLETED ? (
              <Ionicons name='checkmark-circle-outline' size={32} color='black' />
            ) : (
              <Pressable onPress={isActive ? handlePressPause : handlePressStart}>
                <Ionicons name={isActive ? 'pause-circle-outline' : 'play-circle-outline'} size={32} color='black' />
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

const style = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  swipeActionsContainer: {
    flexDirection: 'row',
  },
});

export default TaskListItem;
