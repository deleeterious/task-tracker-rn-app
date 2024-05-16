import { createTask } from '@/api/api';
import Layout from '@/components/Layout';
import TextInput from '@/components/TextInput';
import { Route } from '@/routes/types';
import { TaskStatus } from '@/services/types';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

interface FormValues {
  title: string;
  projectName: string;
}

const CreateTask = () => {
  const navigation = useNavigation<any>();

  const { handleSubmit, control } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    await createTask({ title: data.title, project: data.projectName, status: TaskStatus.NOT_STARTED });
    navigation.replace(Route.TaskList);
  };

  return (
    <Layout title='New task'>
      <View style={style.container}>
        <View>
          <TextInput label='Title' name='title' control={control} />
        </View>
        <View>
          <TextInput label='Project' name='projectName' control={control} />
        </View>
      </View>

      <View style={style.buttonContainer}>
        <Button mode='contained' onPress={handleSubmit(onSubmit)}>
          Start task
        </Button>
      </View>
    </Layout>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    paddingVertical: 16,
  },
});

export default CreateTask;
