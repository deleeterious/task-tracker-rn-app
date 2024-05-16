import { getActiveTask, getTasks } from '@/api/api';
import Layout from '@/components/Layout';
import { Route } from '@/routes/types';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Task } from '@/services/types';
import TaskListItem from './components/TaskListItem';
import TimeSpend from '@/components/TimeSpend';
import { useStore } from '@/store';

const TaskList = () => {
  const { activeTask, updateActiveTask } = useStore();
  const [tasks, setTasks] = useState<Task[]>([]);

  const navigation = useNavigation<any>();

  const isFocused = useIsFocused();

  const handleAddTask = () => {
    navigation.navigate(Route.CreateTask);
  };

  useEffect(() => {
    const getData = async () => {
      if (isFocused) {
        const tasksData = await getTasks();

        setTasks(tasksData);
      }
    };

    getData();
  }, [isFocused]);

  return (
    <Layout title='Tasks'>
      {tasks.length ? (
        <FlatList
          style={{ flex: 1 }}
          key='id'
          data={tasks}
          renderItem={({ item }) => {
            return <TaskListItem updateTasksList={setTasks} data={item} />;
          }}
        />
      ) : (
        <View style={style.container}>
          <Text variant='bodySmall'>You don't have tasks recently added</Text>
          <Text variant='bodySmall' style={{ textDecorationLine: 'underline' }}>
            Generate list of tasks
          </Text>
        </View>
      )}
      <View style={style.buttonContainer}>
        <Button mode='contained' onPress={handleAddTask}>
          Add task
        </Button>
      </View>

      {activeTask && (
        <View style={style.activeTaskContainer}>
          <Text>{activeTask.title}</Text>
          <TimeSpend startTime={activeTask.startTime ?? ''} isActive={true} initialTime={activeTask.timeSpend} />
        </View>
      )}
    </Layout>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingVertical: 16,
  },
  activeTaskContainer: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default TaskList;
