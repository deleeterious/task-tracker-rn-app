import { Pressable, StyleSheet, View } from 'react-native';
import Layout from '@/components/Layout';
import { Button, Text } from 'react-native-paper';
import TextInput from '@/components/TextInput';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { createUser } from '@/api/api';
import { Route } from '@/routes/types';

interface FormValues {
  email: string;
  password: string;
  repeatPassword: string;
}

const SingUp = () => {
  const form = useForm<FormValues>();

  const navigation = useNavigation<any>();

  const onSubmit = async (data: FormValues) => {
    await createUser(data);
    navigation.navigate(Route.SingIn);
  };

  const handlePressSingIn = () => {
    navigation.navigate(Route.SingIn);
  };

  return (
    <Layout title='Sing-up'>
      <View style={style.container}>
        <View style={style.inputContainer}>
          <TextInput label='Email' name='email' control={form.control} />
        </View>

        <View style={style.inputContainer}>
          <TextInput label='Password' name='password' control={form.control} />
        </View>

        <View style={style.inputContainer}>
          <TextInput label='Repeat password' name='repeatPassword' control={form.control} />
        </View>

        <Button mode='contained' onPress={form.handleSubmit(onSubmit)}>
          Sing UP
        </Button>
      </View>

      <View style={style.footer}>
        <Pressable onPress={handlePressSingIn}>
          <Text variant='bodySmall'>
            Already have an account?{' '}
            <Text variant='bodySmall' style={{ color: 'blue' }}>
              Sign In
            </Text>
          </Text>
        </Pressable>
      </View>
    </Layout>
  );
};

const style = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  container: {
    flex: 1,
    marginTop: 56,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default SingUp;
