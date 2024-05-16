import api from '../services/asyncStorage';
import {
  CreateTaskRequestBody,
  CreateUserRequestBody,
  LogInUserRequestBody,
  PatchTaskRequestBody,
  PostStatistic,
  User,
} from '../services/types';

export const createUser = async (data: CreateUserRequestBody) => {
  return await api.createUser(data);
};

export const verifyUser = async (data: LogInUserRequestBody) => {
  return await api.logIn(data);
};

export const createTask = async (data: CreateTaskRequestBody) => {
  return await api.createTask(data);
};

export const getTasks = async () => {
  return await api.getTasks();
};

export const getTask = async (id: string) => {
  return await api.getTask(id);
};

export const patchTask = async (id: string, data: PatchTaskRequestBody) => {
  return await api.patchTask(id, data);
};

export const patchStatistic = async (id: string, data: PatchTaskRequestBody) => {
  return await api.patchTask(id, data);
};

export const deleteTask = async (id: string) => {
  return await api.deleteTask(id);
};

export const getActiveTask = async () => {
  return await api.getActiveTask();
};

export const postStatistic = async (data: PostStatistic) => {
  return await api.postStatistic(data);
};

export const getStatistics = async () => {
  return await api.getStatistic();
};
