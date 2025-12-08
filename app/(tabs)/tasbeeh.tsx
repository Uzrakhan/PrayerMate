import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [count, setCount] = useState(0);
  const target = 100;
  return (
    <View className="flex-1 justify-center items-center bg-green-900 px-6">
      <Text className="text-white text-5xl font-bold mb-2">
        Tasbeeh Counter
      </Text>
      <Text className="text-slate-400 font-medium">
        Tap the button to count your dhikr
      </Text>

      {/* counter circle */}
      <View className="w-40 h-40 rounded-full border-4 border-emerald-600 items-center justify-center mb-8 mt-5">
        <Text className="text-5xl text-emerald-300 font-bold">
          {count}
        </Text>
        <Text className="text-sm text-slate-300 mt-1">
          Target: {target}
        </Text>
      </View>

      {/** buttons */}
      <View className="flex-row gap-7">
        <TouchableOpacity
          onPress={() => setCount(count + 1)}
          className="bg-emerald-500 px-8 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold text-lg">
            +
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCount(0)}
          className="bg-slate-700 px-6 py-3 rounded-xl"
        >
          <Text className="text-slate-100 font-semibold text-lg">
            Reset
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
