import { getActiveTask } from '@/api/api';
import { Task } from '@/services/types';
import { User } from '@/types/user';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface StoreValue {
  userId: string | null;
  activeTask: Task | null;
  updateUser: (user: string | null) => void;
  updateActiveTask: (task: Task | null) => void;
}

interface StoreProviderProps {
  children: ReactNode;
}

const StoreContext = createContext<StoreValue>({} as StoreValue);

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [userId, setUser] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const updateUser = (userId: string | null) => {
    setUser(userId);
  };

  const updateActiveTask = (task: Task | null) => {
    setActiveTask(task);
  };

  useEffect(() => {
    const init = async () => {
      const activeTaskData = await getActiveTask();

      if (activeTaskData) {
        setActiveTask(activeTaskData);
      }
    };

    init();
  }, [userId]);

  return (
    <StoreContext.Provider value={{ userId, activeTask, updateUser, updateActiveTask }}>
      {children}
    </StoreContext.Provider>
  );
};
