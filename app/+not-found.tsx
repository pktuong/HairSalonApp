import { Link, Stack } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View>
    <Stack.Screen options={{title:"NotFound"}}></Stack.Screen>
    <View style={styles.container}>
      <Link href="/" style={styles.button}>
      Go to Home screen
      </Link>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
    button: {
        backgroundColor: '#61dafb',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
});
