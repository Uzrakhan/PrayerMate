import { useEffect, useMemo, useState } from "react";
import { View, Text, Modal, Pressable, ScrollView, TouchableOpacity } from "react-native";
import { getHijriCalendar, HijriDay } from "../utils/getHijriCalendar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Calendar } from 'react-native-calendars';
import moment from "moment-hijri";
import axios from "axios";


type DayStatus = Record<string, boolean>;
type History = Record<string, DayStatus>;

const IMPORTANT_HIJRI_DATES: Record<string, string> = {
  "1-1": "Islamic New Year",
  "10-1": "Ashura",
  "12-3": "Mawlid",
  "1-9": "Ramadan Begins",
  "27-9": "Laylat al-Qadr",
  "1-10": "Eid al-Fitr",
  "9-12": "Arafah",
  "10-12": "Eid al-Adha",
};


export default function HijriCalendarModal({
    visible,
    onClose,
    history,
}: {
    visible: boolean;
    onClose: () => void;
    history: History;
}) {
    
    const markedDates = useMemo(() => {
        const marks: any = {};

        Object.entries(history).forEach(([date, prayers]) => {
            const completed = Object.values(prayers).filter(Boolean).length;

            marks[date] = {
                customStyles: {
                    container: {
                        backgroundColor: 
                            completed === 5
                                ? "#22c55e"
                                : completed >= 3
                                ? "#0d9488"
                                : "#334155"
                    },
                    text: {
                        color: "white",
                        fontWeight: "bold"
                    }
                }
            }
        });

        return marks;
    },[history]);
    
    
    const [currentMonth, setCurrentMonth] = useState(moment());
    const [days,setDays] = useState([]);
    const [loading,setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(moment().format("DD-MM-YYYY"))
    const [events, setEvents] = useState<any[]>([])
    const selectedGregorian = moment(selectedDate, "DD-MM-YYYY");
    const selectedHijri = moment(selectedDate, "DD-MM-YYYY").locale("en");
    const todayHijri = moment().format("iD");
    const todayHijriMonth = moment().format("iM");
    const todayHijriYear = moment().format("iYYYY");


    async function loadMonth() {
        try {
            setLoading(true);

            const hijriYear = currentMonth.iYear();
            const hijriMonth = currentMonth.iMonth() + 1;
            console.log(moment().format("iD iMMMM iYYYY"));
            console.log(moment().iYear(), moment().iMonth()+1);

            const url = `https://api.aladhan.com/v1/hijriCalendarByCity/${hijriYear}/${hijriMonth}?city=Delhi&country=India&method=2`;
            console.log("Hijri API:", url);

            const res = await axios.get(url);

            setDays(res.data.data);

            //extract events
            const hijriEvents: any[] = [];

            res.data.data.forEach((d: any) => {
                const greg = d.date.gregorian.date;
                const hijri = `${d.date.hijri.day} ${d.date.hijri.month.en} ${d.date.hijri.year}`;

                d.date.hijri.holidays.forEach((name: string) => {
                    hijriEvents.push({
                        name,
                        greg,
                        hijri
                    })
                });
            });
            setEvents(hijriEvents);
        } catch(err) {
            console.log('Hijri error:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMonth()
    }, [currentMonth]);

    function nextMonth() {
        setCurrentMonth(prev => moment(prev).add(1, "iMonth"));
    }

    function prevMonth() {
        setCurrentMonth(prev => moment(prev).subtract(1, "iMonth"));
    }

    function getImportantLabel(d: { date: { hijri: any; }; }) {
        const hijri = d.date.hijri;

        if (hijri.month.number === 9 && hijri.day === "01") return "🌙 Ramadan Begins";
        if (hijri.month.number === 10 && hijri.day === "01") return "🎉 Eid al-Fitr";
        if (hijri.month.number === 12 && hijri.day === "09") return "🕋 Day of Arafah";
        if (hijri.month.number === 12 && hijri.day === "10") return "🎉 Eid al-Adha";
        if (hijri.month.number === 1 && hijri.day === "10") return "✨ Ashura";

        return null;
    }
    function prayersCount(gDate: string) {
        const record = history[gDate];
        if (!record) return 0;
        return Object.values(record).filter(Boolean).length;
    }

    

    return (
        <Modal visible={visible} animationType="slide">
            <View className="flex-1 bg-teal-950 px-6 pt-10">

                {/** HEADER */}
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity onPress={onClose}>
                        <MaterialCommunityIcons name="chevron-left"  size={40} color="white" />
                    </TouchableOpacity>
                    
                    <View className="mr-10">
                        <Text className="text-white text-xl font-bold mt-3">
                            {selectedHijri.format("iD iMMMM iYYYY")} AH
                        </Text>

                        <Text className="text-teal-300 text-lg ml-10">
                            {selectedGregorian.format("MMM D, YYYY")}
                        </Text>
                    </View>
                </View>

                {/**MONTH SWITCH */}
                <ScrollView>
                    <View className="bg-[#083b37] rounded-2xl p-4 flex-row justify-between items-center my-5">
                        <TouchableOpacity onPress={prevMonth}>
                            <MaterialCommunityIcons name="chevron-left" size={32} color="white" />
                        </TouchableOpacity>

                        <Text className="text-white text-xl font-bold">
                            {currentMonth.format("iMMMM iYYYY")}
                        </Text>

                        <TouchableOpacity onPress={nextMonth}>
                            <MaterialCommunityIcons name="chevron-right" size={32} color="white" />
                        </TouchableOpacity>
                    </View>


                    {/**CALENDAR */}
                    {loading ? (
                        <Text className="text-white">
                            Loading....
                        </Text>
                    ) : (
                        <View className="flex-row flex-wrap mt-4">
                            {days.map((d:any) => {
                                const hijri = d.date.hijri;
                                const greg = d.date.gregorian.date;   // yyyy-mm-dd
                                const done = prayersCount(greg);
                                const isToday = hijri.day == todayHijri && 
                                    hijri.month.number == Number(todayHijriMonth) &&
                                    hijri.year == Number(todayHijriYear)
                                const isSelected = greg === selectedDate;

                                return (
                                    <TouchableOpacity
                                        key={greg}
                                        onPress={() => setSelectedDate(greg)}
                                        style={{ width: "20.00%" }}
                                        className="items-center mb-4"
                                    >
                                        <View
                                            className={`
                                                w-12 h-12 rounded-full items-center justify-center
                                                ${done === 5 ? 'bg-green-600'
                                                    : done >= 3 ? 'bg-emerald-700/70'
                                                    : 'bg-transparent'
                                                }

                                                ${isToday ? 'border-2 border-yellow-400': ''}

                                                ${isSelected ? 'rounded-lg border-2 bg-emerald-800': ''}
                                                `}
                                        >
                                            <Text className="text-white font-bold text-lg text-center">
                                                {hijri.day}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    <View className="mt-6">
                        <Text className="text-white text-xl font-bold mb-3">
                            Important Islamic Dates
                        </Text>

                        {events.length === 0 && (
                            <Text className="text-teal-200">
                                No events this month
                            </Text>
                        )}

                        {events.map((e, idx) => (
                            <View
                                key={idx}
                                className="bg-[#083b37] rounded-xl p-4 mb-3"
                            >
                                <Text className="text-white text-lg font-semibold">
                                    {e.name}
                                </Text>

                                <Text className="text-teal-300">
                                    {e.hijri}
                                </Text>

                                <Text className="text-teal-300">
                                    {moment(e.greg, "DD-MM-YYYY").format("MMM D, YYYY")}
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}