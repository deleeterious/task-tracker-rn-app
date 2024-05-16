import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {
  CreateTaskRequestBody,
  CreateUserRequestBody,
  LogInUserRequestBody,
  PatchTaskRequestBody,
  PostStatistic,
  Statistic,
  Task,
  TaskStatus,
  User,
} from './types';

class AsyncStorageService {
  public userId: string | null = null;

  // Users

  async getUsers(): Promise<User[]> {
    const users = JSON.parse((await AsyncStorage.getItem('users')) ?? '');

    return users;
  }

  async createUser(data: CreateUserRequestBody) {
    try {
      const users = await this.getUsers();
      const id = uuid.v4().toString();

      await AsyncStorage.setItem('users', JSON.stringify([...users, { ...data, id }]));
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async logIn(data: LogInUserRequestBody) {
    try {
      const users = await this.getUsers();

      if (users.length) {
        const currentUser = await users.find((item) => item.email === data.email);

        if (currentUser) {
          if (currentUser.password === data.password) {
            this.userId = currentUser.id;
            return { allowLogin: true, userId: currentUser.id };
          }
          return { allowLogin: false, message: 'Incorrect password' };
        }

        return { allowLogin: false, massage: "Can't find user" };
      }

      return { allowLogin: false, massage: 'No users' };
    } catch (err: any) {
      throw new Error(err);
    }
  }

  // Tasks
  async createTask(data: CreateTaskRequestBody) {
    try {
      const tasks = await this.getTasks();
      const id = uuid.v4().toString();

      if (this.userId) {
        await AsyncStorage.setItem('tasks', JSON.stringify([...tasks, { ...data, id, userId: this.userId }]));
      }
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async getTasks(): Promise<Task[]> {
    const tasks = JSON.parse((await AsyncStorage.getItem('tasks')) ?? '');

    return tasks.filter((item: Task) => item.userId === this.userId);
  }

  async getTask(id: string) {
    const tasks = await this.getTasks();

    return tasks.find((item) => item.id === id);
  }

  async patchTask(id: string, data: PatchTaskRequestBody) {
    const tasks = await this.getTasks();

    const tasksCopy = [...tasks];

    const patchItemIndex = tasksCopy.findIndex((item) => item.id === id);

    if (patchItemIndex > -1) {
      tasksCopy[patchItemIndex] = {
        ...tasksCopy[patchItemIndex],
        ...data,
      };
    }

    await AsyncStorage.setItem('tasks', JSON.stringify(tasksCopy));

    return tasksCopy[patchItemIndex];
  }

  async getStatistic() {
    const data = await AsyncStorage.getItem('statistics');

    const statistic = JSON.parse(data || '[]');

    return statistic?.filter((item: Statistic) => item.userId === this.userId);
  }

  async postStatistic(data: PostStatistic) {
    const statistics = await this.getStatistic();

    const statisticCopy = [...(statistics || []), data];

    await AsyncStorage.setItem('statistics', JSON.stringify(statisticCopy));
  }

  async getActiveTask() {
    const tasks = await this.getTasks();
    return tasks.find((item) => item.status === TaskStatus.ACTIVE);
  }

  async deleteTask(id: string) {
    const tasks = await this.getTasks();

    await AsyncStorage.setItem('tasks', JSON.stringify(tasks.filter((item) => item.id !== id)));
  }
}

const api = new AsyncStorageService();

export default api;
