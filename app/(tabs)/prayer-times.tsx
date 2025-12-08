import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, Alert } from "react-native";
import * as Location from "expo-location";

export default function PrayerTimesScreen() {
  const [timings, setTimings] = useState<any>(null);
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const mainPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  useEffect(() => {
    getLocation();
  }, []);

  async function getLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please enable location.");
        setCity("Delhi");
        setCountry("India");
        fetchPrayerTimes("Delhi", "India");
        return;
      }

      const loc = await Location.getCurrentPositionAsync();
      const reverse = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const detectedCity = reverse[0]?.city || reverse[0]?.subregion || "Delhi";
      const detectedCountry = reverse[0]?.country || "India";

      setCity(detectedCity);
      setCountry(detectedCountry);

      fetchPrayerTimes(detectedCity, detectedCountry);
    } catch (error) {
      console.log("Location Error:", error);
      setCity("Delhi");
      setCountry("India");
      fetchPrayerTimes("Delhi", "India");
    }
  }

  async function fetchPrayerTimes(city: string, country: string) {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`
      );

      const json = await response.json();
      setTimings(json.data.timings);
      setLoading(false);
    } catch (error) {
      console.log("Fetch Error:", error);
      setLoading(false);
    }
  }

  function getTimeDifference(currentTime: Date, prayerTimeStr: string) {
    const [hour, minute] = prayerTimeStr.split(":").map(Number);

    const prayerTime = new Date();
    prayerTime.setHours(hour, minute, 0, 0);

    if (prayerTime <= currentTime) return null;

    const diffMs = prayerTime.getTime() - currentTime.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return { hours, minutes };
  }

  // SAFETY CHECK — Don't render until timings exist
  if (loading || !timings) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-white mt-4">Loading prayer times...</Text>
      </View>
    );
  }

  // ⭐ NOW calculate next prayer safely
  const currentTime = new Date();
  let nextPrayerName = "";
  let nextPrayerTime = "";
  let nextPrayerDiff = null;

  for (let prayer of mainPrayers) {
    const diff = getTimeDifference(currentTime, timings[prayer]);
    if (diff) {
      nextPrayerName = prayer;
      nextPrayerTime = timings[prayer];
      nextPrayerDiff = diff;
      break;
    }
  }

  if (!nextPrayerName) {
    nextPrayerName = "Fajr (Tomorrow)";
    nextPrayerTime = timings["Fajr"];
    nextPrayerDiff = getTimeDifference(
      new Date(currentTime.getTime() + 24 * 60 * 60 * 1000),
      timings["Fajr"]
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-900 px-6 pt-10">
      <Text className="text-2xl font-bold text-white text-center">
        Prayer Times
      </Text>

      <Text className="text-slate-400 text-center mb-6">
        {city}, {country}
      </Text>

      {/* Next Upcoming Prayer */}
      <View className="bg-emerald-700 p-4 rounded-xl mb-6">
        <Text className="text-white font-semibold text-center text-lg">
          Next Prayer: {nextPrayerName}
        </Text>

        <Text className="text-emerald-200 text-center mt-1">
          Time: {nextPrayerTime}
        </Text>

        {nextPrayerDiff && (
          <Text className="text-emerald-100 text-center mt-1">
            In {nextPrayerDiff.hours}h {nextPrayerDiff.minutes}m
          </Text>
        )}
      </View>

      {mainPrayers.map((prayer) => (
        <View
          key={prayer}
          className="flex-row items-center justify-between bg-slate-800 p-4 rounded-xl mb-3"
        >
          <Text className="text-xl text-white">{prayer}</Text>
          <Text className="text-xl text-emerald-400">{timings[prayer]}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
