import { useStore } from '@/store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Route } from './types';
import SingIn from '@/features/Auth/SingIn';
import SingUp from '@/features/Auth/SingUp';
import TaskList from '@/features/Tasks/List';
import CreateTask from '@/features/Tasks/Create';
import TaskDetails from '@/features/Tasks/Details';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Statistic from '@/features/Statistic';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TaskRoutes = () => {
  const { userId } = useStore();
  const isLoggedIn = Boolean(userId);

  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? Route.TaskList : Route.SingIn}>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name={Route.TaskList} component={TaskList} />
        <Stack.Screen name={Route.CreateTask} component={CreateTask} />
        <Stack.Screen
          name={Route.TaskDetails}
          component={TaskDetails}
          options={{ headerShown: true, headerTitle: '' }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const Routes = () => {
  const { userId } = useStore();
  const isLoggedIn = Boolean(userId);

  return (
    <>
      {isLoggedIn ? (
        <Tab.Navigator initialRouteName={Route.TaskTab} screenOptions={{ headerShown: false }}>
          <Tab.Screen name={Route.TaskTab} component={TaskRoutes} />
          <Tab.Screen name={Route.StatisticTab} component={Statistic} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName={Route.SingIn}>
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Route.SingIn} component={SingIn} />
            <Stack.Screen name={Route.SingUp} component={SingUp} />
          </Stack.Group>
        </Stack.Navigator>
      )}
    </>
  );
};

export default Routes;
