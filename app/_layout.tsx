import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { UserProvider } from "@/context/UserContext";
import { BookingProvider } from "@/context/BookingContext";

LogBox.ignoreAllLogs();

export default function RootLayout() {
  return (
    <UserProvider>
      <BookingProvider>
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
      <Stack.Screen name="pickFace" options={{ headerShown:false }} />
      <Stack.Screen name="login" options={{ headerShown:false }} />
      <Stack.Screen name="signup" options={{ headerShown:false }} />
      <Stack.Screen name="selectService" options={{ headerShown:false }} />
      <Stack.Screen name="selectHair" options={{ headerShown:false }} />
      <Stack.Screen name="apptDetail" options={{ headerShown:false }} />
      <Stack.Screen name="wishHairList" options={{ headerTitle:"Kiểu tóc yêu thích", headerTitleAlign:"center"}} />
      <Stack.Screen name="posterDetail" options={{ headerShown:false }} />
      <Stack.Screen name="momoPayment" options={{ headerShown: false }} />
      <Stack.Screen name="hairSuggest" options={{ headerShown: false }} />
    </Stack>
    </BookingProvider>
    </UserProvider>
  );
}
