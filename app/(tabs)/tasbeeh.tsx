import { useEffect, useState } from "react";
import { View, Text, Pressable, Vibration } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DHIKR_LIST = [
  { id: "subhanallah", label: "SubhanAllah" },
  { id: "alhamdulillah", label: "Alhamdulillah" },
  { id: "allahuakbar", label: "Allahu Akbar" },
];

const STORAGE_KEY = "TASBEEH_STATE";

export default function TasbeehScreen() {
  const [count, setCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState(DHIKR_LIST[0]);

  // Load saved data
  useEffect(() => {
    async function loadSavedState() {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCount(parsed.count ?? 0);
        setSelectedDhikr(parsed.selectedDhikr ?? DHIKR_LIST[0]);
      }
    }
    loadSavedState();
  }, []);

  // Save data
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ count, selectedDhikr })
    );
  }, [count, selectedDhikr]);

  function selectDhikr(dhikr: any) {
    setSelectedDhikr(dhikr);
    setCount(0);
  }

  return (
    <View className="flex-1 bg-teal-950 px-6 pt-16">

      {/* DHIKR SELECTION */}
      <View className="flex-row justify-center mt-20 gap-2 ">
        {DHIKR_LIST.map((dhikr) => {
          const isActive = selectedDhikr.id === dhikr.id;
          return (
            <Pressable
              key={dhikr.id}
              onPress={() => selectDhikr(dhikr)}
              className={`px-4 py-4 rounded-full border ${
                isActive
                  ? "bg-teal-600 border-teal-400"
                  : "border-teal-700"
              }`}
            >
              <Text
                className={`text-lg font-medium ${
                  isActive ? "text-white" : "text-teal-300"
                }`}
              >
                {dhikr.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* COUNTER AREA (ONLY THIS IS PRESSABLE) */}
      <Pressable
        className="flex-1 items-center justify-center"
        onPress={() => {
          setCount((c) => {
            const next = c + 1;
            if (next % 10 === 0) {
              Vibration.vibrate(10);
            }
            return next;
          });
        }}
      >
        <Text className="text-white text-7xl font-bold tracking-wider">
          {count}
        </Text>
        <Text className="text-teal-400 text-sm mt-2">
          Tap to count
        </Text>
      </Pressable>

      {/* RESET BUTTON */}
      <View className="items-center pb-12">
        <Pressable
          onPress={() => setCount(0)}
          className="border border-teal-400 px-10 py-3 rounded-full"
        >
          <Text className="text-teal-300 text-lg font-medium">
            Reset
          </Text>
        </Pressable>
      </View>

    </View>
  );
}
