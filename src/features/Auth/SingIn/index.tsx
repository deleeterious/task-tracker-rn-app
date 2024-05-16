import { Pressable, StyleSheet, View } from 'react-native';
import Layout from '@/components/Layout';
import { Button, Text } from 'react-native-paper';
import TextInput from '@/components/TextInput';
import { Route } from '@/routes/types';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { verifyUser } from '@/api/api';
import { useStore } from '@/store';

interface FormValues {
  email: string;
  password: string;
}

const SingIn = () => {
  const { updateUser } = useStore();
  const form = useForm<FormValues>();
  const navigation = useNavigation<any>();

  const handlePressSingUp = () => {
    navigation.replace(Route.SingUp);
  };

  const onSubmit = async (data: FormValues) => {
    const res = await verifyUser(data);

    if (res?.allowLogin && res.userId) {
      updateUser(res.userId);
    }
  };

  return (
    <Layout title='Sing-in'>
      <View style={style.container}>
        <View style={style.inputContainer}>
          <TextInput label='Email' name='email' control={form.control} />
        </View>

        <View style={style.inputContainer}>
          <TextInput label='Password' name='password' control={form.control} />
        </View>

        <Button mode='contained' onPress={form.handleSubmit(onSubmit)}>
          Sing in
        </Button>
      </View>

      <View style={style.footer}>
        <Pressable onPress={handlePressSingUp}>
          <Text variant='bodySmall'>
            Don’t have an account yet?{' '}
            <Text variant='bodySmall' style={{ color: 'blue' }}>
              Sign Up
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

export default SingIn;
