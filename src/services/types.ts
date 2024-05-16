// User

export interface User {
  email: string;
  password: string;
  id: string;
}

export interface CreateUserRequestBody extends Omit<User, 'id'> {}

export interface LogInUserRequestBody extends Omit<User, 'id'> {}

// Task

export interface Tag {
  id: string;
  title: string;
}

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  project: string;
  status: TaskStatus;
  firstTimeStart?: string;
  startTime?: string;
  endTime?: string;
  timeSpend?: number;
  tags?: Tag[];
  file?: string;
}

export interface Statistic {
  date: string;
  value: number;
  userId: string;
}

export interface PostStatistic extends Statistic {}

export interface CreateTaskRequestBody extends Omit<Task, 'id' | 'userId'> {}

export interface PatchTaskRequestBody extends Partial<Omit<Task, 'id' | 'userId'>> {}
