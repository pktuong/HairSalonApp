import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const logo = require("../../assets/images/logo.svg");
export default function TabsLayout() {
  return (
    <Tabs
    screenOptions={{
        tabBarActiveTintColor: '#0A3981',
    }}
    >    
      <Tabs.Screen 
      name="index"
      options={{
        headerShown:false,
        tabBarLabel : 'Trang chủ',
        tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
      }}
      />
      <Tabs.Screen name="hairList"
      options={{
        headerShown:false,
        tabBarLabel : 'Kiểu tóc',
        tabBarIcon: ({ color }) => <Ionicons name="cut" size={24} color={color} />,
      }}
      />
      <Tabs.Screen name="notification"
      options={{
        headerShown:false,
        tabBarLabel : 'Thông báo',
        tabBarIcon: ({ color }) => <Ionicons name="notifications" size={24} color={color} />,
      }}
      />
      <Tabs.Screen name="about"
      options={{
        headerShown:false,
        tabBarLabel : 'Tài khoản',
        tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
      }}
      />
      
      {/* <Tabs.Screen name="+not-found" options={{  }} /> */}
    </Tabs>
  );
}
