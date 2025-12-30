import { useEffect, useState } from "react";
import { View,Text, ActivityIndicator } from "react-native";
import  getPrayerTimes  from '../utils/getPrayerTimes'
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from "@expo/vector-icons";


interface PrayerTimings {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

interface NextPrayer {
    name: string;
    time: string;
}

const prayerIcons: any = {
    Fajr: "weather-night",
    Dhuhr: "white-balance-sunny",
    Asr: "weather-sunset-up",
    Maghrib: "weather-sunset-down",
    Isha: "moon-waning-crescent",
}

function getNextPrayer(timings: PrayerTimings) {
  if (!timings) {
    return { name: "N/A", time: "--:--" };
  }

  const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const now = new Date();

  for (let prayer of prayerOrder) {
    const time = timings[prayer as keyof PrayerTimings];

    if (!time || time === "--:--") continue;

    const [hour, minute] = time.split(":").map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hour, minute, 0);

    if (prayerTime > now) {
      return { name: prayer, time };
    }
  }

  return { name: "Fajr", time: timings.Fajr };
}


function getCountdown(prayerTime: string) {
    const now = new Date();

    const [hour, minute] = prayerTime.split(":").map(Number);
    const target = new Date();
    target.setHours(hour, minute, 0);

    let diff = target.getTime() - now.getTime();

    // if prayer is tomorrow 
    if (diff < 0) {
        target.setDate(target.getDate() + 1);
        diff = target.getTime() - now.getTime()
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

}

export default function HomeScreen() {
    const [timings, setTimings] = useState<PrayerTimings | null>(null);
    const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
    const [city, setCity] = useState("Loading...");
    const [country, setCountry] = useState("");
    const [countdown,setCountdown] = useState("");



    
    useEffect(() => {
        async function laod() {
            // ask for location permission
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setCity("Permission Denied");
                return;
            }

            // get coords
            let location = await Location.getCurrentPositionAsync({});

            //convert coords - city + country
            let geo = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            const address = geo[0];
            setCity(address.city ?? "Unknown");
            setCountry(address.country ?? "");

            // fetch real prayer timings
            const data = await getPrayerTimes(address.city ?? "Delhi", address.country ?? "India");

            if (!data || !data.Fajr) {
                console.warn("Invalid prayer timings received:", data);
                return;
            }

            setTimings(data);

            const next = getNextPrayer(data);
            setNextPrayer(next);
        }
        laod()
    },[]);

    useEffect(() => {
        if (!nextPrayer) return;
        const interval = setInterval(() => {
            setCountdown(getCountdown(nextPrayer.time));
        }, 1000);

        return () => clearInterval(interval)
    },[nextPrayer])


    if (!timings || !nextPrayer) {
        return (
            <View className="flex-1 bg-teal-950 items-center justify-center">
                <ActivityIndicator color="white" size="large"/>
                <Text className="text-white mt-3">
                    Loading prayer times...
                </Text>
            </View>
        )
    }
    return (
        <View className="flex-1 bg-teal-950 px-6 pt-20">

            {/*HEADER */}
            <Text className="text-white text-4xl font-extrabold tracking-tighter">
                PRAYERMATE
            </Text>
            
            {/** MAIN CARD */}
            <View className="bg-[#125550] mt-5 p-8 rounded-3xl shadow-xl">

                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-teal-300 text-xl tracking-wide ml-1">
                            Next Prayer
                        </Text>

                        <Text className="text-white text-4xl font-bold mt-1 ml-1">
                            {nextPrayer.name}
                        </Text>

                        <View className="flex-row items-center justify-center mt-1 mr-2">
                            <MaterialCommunityIcons 
                                name="pin"
                                color="#ffffff"
                                size={20}
                            />
                            <Text className="text-teal-300 text-2xl font-semibold">
                                {city}
                            </Text>
                        </View>
                    </View>

                    <View className="items-end">
                        <Text className="text-teal-200 font-bold text-4xl mt-10">
                            {nextPrayer.time}
                        </Text>
                        <Text className="text-teal-100 text-xl font-medium">
                            Starts in {countdown}
                        </Text>
                    </View>
                </View>
            </View>

            {/**PRAYER TIMES CARD */}
            <View className="bg-[#125550] mt-8 p-5 rounded-3xl">
                <View className="flex-row items-start justify-start gap-2">
                    <MaterialCommunityIcons 
                        name={"calendar"}
                        size={25}
                        color="#ffffff"
                    />
                    <Text className="text-white font-bold text-2xl mb-3">
                        Today's Timings
                    </Text>
                </View>

                {Object.entries({
                    Fajr: timings.Fajr,
                    Dhuhr: timings.Dhuhr,
                    Asr: timings.Asr,
                    Maghrib: timings.Maghrib,
                    Isha: timings.Isha,
                }).map(([name, time]) => (
                    <View
                        key={name}
                        className="flex-row items-center justify-between py-4 border-b border-white"
                    >
                        <View className="flex-row items-center gap-3 space-x-3">
                            <Text className="text-teal-200 text-2xl font-medium">
                                {name}
                            </Text>
                            <MaterialCommunityIcons 
                                name={prayerIcons[name]}
                                size={28}
                                color="#ffffff"
                            />
                        </View>
                        
                        <Text className="text-white font-semibold text-2xl">
                            {time}
                        </Text>
                    </View>
                ))}
            </View>
            

            <Text className="text-teal-200 text-center italic mt-6 px-4 text-xl">
                “Indeed, prayer restrains from immorality and wrongdoing.”
            </Text>
            <Text className="text-teal-400 text-center text-l mt-1">
                — Quran 29:45
            </Text>

        </View>
    )
}