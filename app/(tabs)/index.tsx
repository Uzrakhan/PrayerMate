import { View,Text } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-green-800 items-center justify-center">
      <Text className="text-5xl font-bold text-white">
        Namaz App Home
      </Text>
      <Text className="text-gray-200 font-medium text-2xl">
        Welcome! Swipe to explore.
      </Text>
    </View>
  )
}