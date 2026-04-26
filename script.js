"use strict"
const URL_LINK = "https://sheets.googleapis.com/v4/spreadsheets/";
const SHEET_ID = "1PoEvfvSYw7QG0DXA62jUAhhKHi4srHHrB-zYPDsnP9g";
const categories = [
    "🔍 Characters Index", "⚔️ Warriors ⭐5", "🔱 Merchants ⭐5","🔪 Thieves ⭐5","🪓 Apothecaries ⭐5", "🏹 Hunters ⭐5","🧙🏻‍♂️ Clerics ⭐5","📖 Scholars ⭐5","💃 Dancers ⭐5","Warriors (Swords) 3✯ & 4✯","Merchants (Spears) 3✯ & 4✯","Thieves (Daggers) 3✯ & 4✯","Apothecaries (Axes) 3✯ & 4✯","Hunters (Bows) 3✯ & 4✯","Clerics (Staves) 3✯ & 4✯","Scholars (Tomes) 3✯ & 4✯","Dancers (Fans) 3✯ & 4✯"
]

const units = []

async function fetchUnits(url) {
   categories.map(category => {
    console.log(category)
   })
//    const endpoint = `${URL_LINK}${SHEET_ID}/values/${url}?valueRenderOption=FORMULA&key=${API_KEY}`;


//     try {
//         console.log('test')
//         let res = await fetch(endpoint);
//         console.log('test2')
//         let data = await res.json();
//         console.log(data)
//     } catch (error) {
//         console.error("Error:", error);
//     }
}

fetchUnits(categories)
