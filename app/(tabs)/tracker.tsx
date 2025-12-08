import React, { useState } from "react";
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native";

// Enable animation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Tracker() {
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const [status, setStatus] = useState({
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  });

  const togglePrayer = (name: string) => {
    LayoutAnimation.easeInEaseOut();
    setStatus((prev) => ({
      ...prev,
      [name as keyof typeof prev]: !prev[name as keyof typeof prev],
    }));
  };

  const resetAll = () => {
    LayoutAnimation.easeInEaseOut();
    setStatus({
      Fajr: false,
      Dhuhr: false,
      Asr: false,
      Maghrib: false,
      Isha: false,
    });
  };

  const completedCount = Object.values(status).filter(Boolean).length;

  return (
    <View className="flex-1 bg-slate-900 px-6 pt-12">
      {/* Title */}
      <Text className="text-white text-3xl font-bold text-center">
        Namaz Tracker
      </Text>

      <Text className="text-slate-400 text-center text-base mt-1 mb-6">
        Track today's Salah progress
      </Text>

      {/* Today Date */}
      <Text className="text-slate-200 text-center mb-4">
        {new Date().toDateString()}
      </Text>

      {/* Tracker List */}
      {prayers.map((prayer) => {
        const completed = status[prayer];

        return (
          <TouchableOpacity
            key={prayer}
            onPress={() => togglePrayer(prayer)}
            className={`flex-row items-center justify-between p-4 mb-3 rounded-xl
            ${completed ? "bg-emerald-600" : "bg-slate-800"}`}
          >
            <Text className="text-white text-xl font-medium">{prayer}</Text>

            <Text
              className={`text-2xl font-bold ${
                completed ? "text-white" : "text-slate-500"
              }`}
            >
              {completed ? "✔" : "○"}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* Completed Count */}
      <Text className="text-center text-slate-300 text-lg mt-4">
        Completed: {completedCount} / 5
      </Text>

      {/* Reset Button */}
      <TouchableOpacity
        onPress={resetAll}
        className="bg-red-600 p-4 rounded-xl mt-6 mx-10"
      >
        <Text className="text-white font-semibold text-center text-lg">
          Reset All
        </Text>
      </TouchableOpacity>
    </View>
  );
}
