import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { UserProvider } from "@/context/UserContext";

LogBox.ignoreAllLogs();

export default function RootLayout() {
  return (
    <UserProvider>
    <StatusBar style="light" />
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="+not-found" options={{ }} />
      <Stack.Screen name="hairDetail" options={{ }} />
      <Stack.Screen name="bookAppt" options={{ }} />
      <Stack.Screen name="detectFace" options={{ headerShown:false }} />
      <Stack.Screen name="login" options={{ headerShown:false }} />
      <Stack.Screen name="signup" options={{ headerShown:false }} />
    </Stack>
    </UserProvider>
  );
}
