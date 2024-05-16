import { Control, useController } from 'react-hook-form';
import { TextInput as PaperTextInput, TextInputProps as PaperTextInputProps } from 'react-native-paper';

interface TextInputProps extends PaperTextInputProps {
  name: string;
  control: Control<any>;
}

const TextInput = ({ name, control, ...props }: TextInputProps) => {
  const { field } = useController({ name, control });

  return <PaperTextInput value={field.value} onChangeText={field.onChange} mode='outlined' {...props} />;
};

export default TextInput;
