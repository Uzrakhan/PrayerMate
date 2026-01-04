import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager, Modal, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment-hijri";
moment.locale("en");
moment.locale("en-SA")
import HijriCalendarModal from "../components/HijriCalendarModal";


// Enable animation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const STOARGE_KEY = "PRAYER_TRACKER_DATA";
const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

type DayStatus = Record<string, boolean>;
type History = Record<string, DayStatus>;

const emptyStatus: DayStatus = {
  Fajr: false,
  Dhuhr: false,
  Asr: false,
  Maghrib: false,
  Isha: false,
}

const todayKey = () => moment().format("YYYY-MM-DD");

const IMPORTANT_HIJRI_DAYS = [
  "01-09",

]

export default function Tracker() {
  const [ status, setStatus] = useState<DayStatus>(emptyStatus)
  const [history, setHistory] = useState<History>({});
  const [showPrayerHistory, setShowPrayerHistory] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    loadData()
  },[]);

  async function  loadData() {
    const stored = await AsyncStorage.getItem(STOARGE_KEY);
    const parsed: History = stored ? JSON.parse(stored) : {};

    const today = todayKey();

    setHistory(parsed);
    setStatus(parsed[today] ?? emptyStatus)
  }

  //save data
  useEffect(() => {
    const today = todayKey()
    const updated = { ...history, [today]: status };

    setHistory(updated);
    AsyncStorage.setItem(STOARGE_KEY, JSON.stringify(updated));

  }, [status])

  function  togglePrayer(name: string) {
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

  const hijriToday = moment().format("iD iMMMM iYYYY");

  return (
    <View className="flex-1 bg-teal-950 px-6 pt-16">
      {/* Title */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white text-3xl font-bold ml-1">
          Prayer Tracker
        </Text>

        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => setShowPrayerHistory(true)} className="mr-5">
            <MaterialCommunityIcons name="chart-timeline-variant" size={28} color="white" />
          </TouchableOpacity>


          <TouchableOpacity onPress={() => setShowCalendar(true)}>
            <MaterialCommunityIcons name="calendar-month-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Today Date */}
      <Text className="text-teal-300 mb-4 text-xl">
        {new Date().toLocaleDateString('en-US', { weekday: "long", month: "long", day: "numeric" })}
      </Text>
      <Text className="text-teal-400 text-l mb-6">
        {hijriToday}
      </Text>

      {/**STATS */}
      <View className="flex-row gap-6 mb-8">
        <View className="bg-[#125550] flex-1 rounded-2xl items-center p-5 text-center">
          <Text className="text-white font-bold text-4xl">
            {completedCount}/5
          </Text>
          <Text className="text-teal-200 font-medium text-xl">
            Completed
          </Text>
        </View>
        <View className="bg-[#125550] flex-1 rounded-2xl items-center p-5 text-center">
          <Text className="text-white font-bold text-4xl">
            {Math.round(completedCount) / 5 * 100}%
          </Text>
          <Text className="text-teal-200 text-xl font-medium">
            Today
          </Text>
        </View>
      </View>

      {/** PRAYER LIST */}
      {PRAYERS.map((prayer) => {
        const done  = status[prayer];

        return (
          <TouchableOpacity
            key={prayer}
            onPress={() => togglePrayer(prayer)}
            className={`flex-row justify-between items-center p-4 mb-4 rounded-xl ${
              done ? "bg-[#125550]" : "bg-teal-800"
            }`}
          >
            <Text className="text-white text-xl">
              {prayer}
            </Text>
            <Text className={`text-xl ${done ? "text-teal-200" : "text-teal-300"}`}>
              {done ? "✔ Prayed" : "○"}
            </Text>
          </TouchableOpacity>
        )
      })}

      {/** prayer hstory modal */}
      <Modal visible={showPrayerHistory} animationType="slide">
        <View className="flex-1 bg-teal-950 px-6 pt-16">
          <Text className="text-white text-3xl font-bold mb-6">
            Prayer History
          </Text>

          <ScrollView>
            {Object.entries(history)
              .reverse()
              .map(([date, day]) => {
                const count = Object.values(day).filter(Boolean).length;

                return (
                  <View
                    key={date}
                    className="bg-[#125550] p-4 rounded-xl mb-4"
                  >
                    <Text className="text-white text-lg font-semibold">
                      {date}
                    </Text>
                    <Text className="text-white text-lg font-semibold">
                      {count} / 5 prayers
                    </Text>
                  </View>
                )
              })
            }
          </ScrollView>

          <TouchableOpacity
            onPress={() => setShowPrayerHistory(false)}
            className="bg-teal-700 py-4 rounded-xl mt-6"
          >
            <Text className="text-white text-center text-lg font-semibold">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <HijriCalendarModal 
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        history={history}
      />

      {/* Tracker List */}
      {/*
      {prayers.map((prayer) => {
        const completed = status[prayer as keyof typeof status];

        return (
          <TouchableOpacity
            key={prayer}
            onPress={() => togglePrayer(prayer)}
            className={`flex-row items-center justify-between p-4 mb-4 mt-5 rounded-xl
            ${completed ? "bg-[#125550]" : "bg-teal-800"}`}
          >
            <Text className="text-white text-xl font-medium">{prayer}</Text>
            
            <Text
              className={`text-2xl font-medium ${
                completed ? "text-teal-200" : "text-teal-300"
              }`}
            >
              {completed ? "✔ Prayed" : "○"}
            </Text>
          </TouchableOpacity>
        );
      })}
      */}
      
      {/* Reset Button */}
      <TouchableOpacity
        onPress={resetAll}
        className="bg-red-600 px-1 py-4 rounded-xl mt-6"
      >
        <Text className="text-white font-semibold text-center text-lg">
          Reset All
        </Text>
      </TouchableOpacity>
    </View>
  );
}
