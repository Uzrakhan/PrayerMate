import { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { router } from "expo-router";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/home");  // Go to your Home tab
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-teal-950 items-center justify-center">

      {/* APP LOGO */}
      <Image
        source={require("../assets/images/icon.png")}
        className="w-40 h-40"
      />

      {/* APP NAME */}
      <Text className="text-white text-2xl font-bold mt-4">
        Prayer Mate
      </Text>

    </View>
  );
}
