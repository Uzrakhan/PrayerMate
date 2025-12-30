import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: "bold"
        },
        headerStyle: { backgroundColor: "#00262D" }, //change this to bg-green-800 hex code
        headerTintColor: "#ffffff",
        tabBarStyle: { backgroundColor: "#065f46" },
        tabBarActiveTintColor: "#34d339", // Tailwind emerald-500
        tabBarInactiveTintColor: "#d1d5db"
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tasbeeh"
        options={{
          title: "Tasbeeh",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="finger-print-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen 
        name="tracker"
        options={{
          title: "Tracker",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle-outline" size={size} color={color} />
          )
        }}
      />
    </Tabs>

    
  );
}
