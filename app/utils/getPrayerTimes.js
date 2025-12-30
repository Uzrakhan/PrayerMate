import axios from 'axios';

export default async function getPrayerTimes(city = "Delhi", country = "India") {
    try {
        const response = await axios.get(
            `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`
        );

        return response.data.data.timings;
    }catch (error){
        console.error("Failed to load prayer timings:", error);
        return null;
    }
}