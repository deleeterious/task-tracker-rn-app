import { deleteTask, getTask, patchTask, postStatistic } from '@/api/api';
import Layout from '@/components/Layout';
import TimeSpend from '@/components/TimeSpend';
import { Route } from '@/routes/types';
import { Task, TaskStatus } from '@/services/types';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, MD2Colors, Text } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useStore } from '@/store';
import { useForm } from 'react-hook-form';
import TextInput from '@/components/TextInput';

interface FormValues {
  title: string;
  project: string;
}

const useHeaderRight = (
  data: Task | null,
  isEdit: boolean,
  handlePressEdit: () => void,
  refreshTaskData: () => Promise<any>,
) => {
  const { updateActiveTask, userId } = useStore();
  const navigation = useNavigation<any>();

  const handlePressStart = async () => {
    if (data) {
      const res = await patchTask(data.id, {
        ...(data.status === TaskStatus.NOT_STARTED && { firstTimeStart: new Date().toISOString() }),
        startTime: new Date().toISOString(),
        status: TaskStatus.ACTIVE,
      });
      await refreshTaskData();
      updateActiveTask(res);
    }
  };

  const handlePressPause = async () => {
    if (data && userId) {
      await patchTask(data.id, {
        startTime: new Date().toISOString(),
        timeSpend: Number(new Date()) - Number(new Date(data.startTime ?? '')) + (data.timeSpend ?? 0),
        status: TaskStatus.PAUSED,
      });

      await postStatistic({
        date: new Date().toISOString(),
        value: Number(new Date()) - Number(new Date(data.startTime ?? '')),
        userId,
      });
      await refreshTaskData();
      updateActiveTask(null);
    }
  };

  const handleDeletePress = async () => {
    if (data) {
      await deleteTask(data?.id);
      navigation.navigate(Route.TaskList);
    }
  };

  if (!data) {
    return null;
  }

  if (isEdit) {
    return (
      <View>
        <Button mode='text' textColor='red' onPress={handleDeletePress}>
          Delete task
        </Button>
      </View>
    );
  }

  if (data.status === TaskStatus.ACTIVE) {
    return (
      <View style={style.headerRightContainer}>
        <Pressable onPress={handlePressEdit}>
          <Ionicons name='pencil-outline' size={32} color='black' />
        </Pressable>
        <Pressable onPress={handlePressPause}>
          <Ionicons name={'pause-circle-outline'} size={32} color='black' />
        </Pressable>
      </View>
    );
  }

  if (data.status === TaskStatus.PAUSED || data.status === TaskStatus.NOT_STARTED) {
    return (
      <View style={style.headerRightContainer}>
        <Pressable onPress={handlePressEdit}>
          <Ionicons name='pencil-outline' size={32} color='black' />
        </Pressable>
        <Pressable onPress={handlePressStart}>
          <Ionicons name={'play-circle-outline'} size={32} color='black' />
        </Pressable>
      </View>
    );
  }

  if (data.status === TaskStatus.COMPLETED) {
    return (
      <View>
        <Ionicons name='checkmark-done-circle-outline' size={32} color='black' />
      </View>
    );
  }

  return null;
};

const TaskDetails = () => {
  const [taskData, setTaskData] = useState<Task | null>(null);
  const isFocused = useIsFocused();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [editMode, setEditMode] = useState(Boolean(route.params.isEdit));
  const form = useForm<FormValues>();

  const refreshTaskData = async () => {
    const response = await getTask(route.params.taskId);

    if (response) {
      setTaskData(response);
    }
  };

  const handleDeletePress = async () => {
    if (taskData) {
      await deleteTask(taskData?.id);
      navigation.navigate(Route.TaskList);
    }
  };

  const handlePressEdit = () => {
    setEditMode(true);
  };

  const handleMarkAsDone = async () => {
    if (taskData)
      await patchTask(taskData!.id, {
        endTime: new Date().toISOString(),
        status: TaskStatus.COMPLETED,
        timeSpend: Number(new Date()) - Number(new Date(taskData.startTime ?? '')) + (taskData.timeSpend ?? 0),
      });
    await refreshTaskData();
  };

  const headerRight = useHeaderRight(taskData, editMode, handlePressEdit, refreshTaskData);

  const onSubmit = async (values: FormValues) => {
    await patchTask(taskData!.id, values);
    await refreshTaskData();
  };

  useEffect(() => {
    const getData = async () => {
      await refreshTaskData();
    };

    getData();
  }, [isFocused, route]);

  if (!taskData) {
    return (
      <Layout title='Task'>
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
      </Layout>
    );
  }

  return (
    <Layout title='Task' headerRight={headerRight}>
      <View style={{ paddingHorizontal: 16, flex: 1 }}>
        {editMode ? (
          <TextInput label='Title' name='title' control={form.control} />
        ) : (
          <View style={style.displayItem}>
            <Text variant='labelSmall'>Title</Text>
            <Text>{taskData.title}</Text>
          </View>
        )}
        {editMode ? (
          <TextInput label='Project' name='project' control={form.control} />
        ) : (
          <View style={style.displayItem}>
            <Text variant='labelSmall'>Project</Text>
            <Text>{taskData.project}</Text>
          </View>
        )}
        <View style={style.row}>
          {taskData.startTime && (
            <View style={style.displayItem}>
              <Text variant='labelSmall'>Start time</Text>
              <Text>{moment(taskData.firstTimeStart ?? undefined).format('DD.MM.YYYY, hh:mm:ss')}</Text>
            </View>
          )}
          {taskData.endTime && (
            <View style={style.displayItem}>
              <Text variant='labelSmall'>End time</Text>
              <Text>{moment(taskData.endTime ?? '').format('DD.MM.YYYY, hh:mm:ss')}</Text>
            </View>
          )}
        </View>

        <View style={style.displayItem}>
          <Text variant='labelSmall'>Duration</Text>
          <TimeSpend
            startTime={taskData.startTime ?? ''}
            isActive={taskData.status === TaskStatus.ACTIVE}
            initialTime={taskData.timeSpend}
          />
        </View>

        {!editMode && (
          <View style={{ alignItems: 'center' }}>
            <Button mode='text' textColor='red' onPress={handleDeletePress}>
              Delete task
            </Button>
          </View>
        )}
      </View>
      <View>
        {editMode ? (
          <Button mode='contained' onPress={form.handleSubmit(onSubmit)}>
            Update task
          </Button>
        ) : (
          taskData.status !== TaskStatus.COMPLETED && (
            <Button mode='contained' onPress={handleMarkAsDone}>
              Mark as completed
            </Button>
          )
        )}
      </View>
    </Layout>
  );
};

const style = StyleSheet.create({
  displayItem: {
    width: '50%',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
});

export default TaskDetails;
