import { useEffect, useMemo, useState } from "react";
import { View, Text, Modal, Pressable, ScrollView, TouchableOpacity } from "react-native";
import { getHijriCalendar, HijriDay } from "../utils/getHijriCalendar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Calendar } from 'react-native-calendars';
import moment from "moment";


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
    },[history])
    return (
        <Modal visible={visible} animationType="slide">
            <View className="flex-1 bg-teal-950 px-6 pt-16">

                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-white text-3xl font-bold">
                        Hijri Calendar
                    </Text>

                    <TouchableOpacity onPress={onClose}>
                        <MaterialCommunityIcons name="close"  size={30} color="white" />
                    </TouchableOpacity>
                </View>
                
                <Calendar 
                    markingType="custom"
                    markedDates={markedDates}
                    theme={{
                        backgroundColor: "#042f2e",
                        calendarBackground: "#042f2e",
                        dayTextColor: "#e5e7eb",
                        monthTextColor: "white",
                        arrowColor: "white",
                    }}  
                    onDayPress={(day) => {
                        const hijri = moment(day.dateString).format("iD-iM");
                        const label = IMPORTANT_HIJRI_DATES[hijri];

                        if (label) {
                            alert(label)
                        }
                    }}
                />

                <View className="mt-6">
                    <Text className="text-teal-200 mb-2">Legend</Text>
                    <Text className="text-white">🟢 5/5 prayers</Text>
                    <Text className="text-white">🟡 3–4 prayers</Text>
                    <Text className="text-white">⚫ 0–2 prayers</Text>
                </View>
            </View>
        </Modal>
    )
}