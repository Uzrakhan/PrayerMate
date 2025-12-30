import axios from "axios";

export interface HijriDay {
    gregorian: {
        date: string;
    },
    hijri: {
        day: string;
        month: { en: string };
        year: string;
        holidays: string[];
    };
}

export async function getHijriCalendar(month: number, year: number) {
    const res = await axios.get(
        `http://api.aladhan.com/v1/gToHCalendar/${month}/${year}`
    );
    return res.data.data as HijriDay[]
}