import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

const Layout = ({ children, title, headerRight }: LayoutProps) => {
  return (
    <View style={[style.flex1, style.container]}>
      <View style={style.title}>
        <Text variant='headlineSmall'>{title}</Text>
        <View>{headerRight}</View>
      </View>

      <View style={style.flex1}>{children}</View>
    </View>
  );
};

const style = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    padding: 8,
  },
  title: {
    width: '100%',
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Layout;
