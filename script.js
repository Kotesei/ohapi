"use strict"
import unitGroups from "./pages.json" with {type: "json"};
const URL_LINK = "https://sheets.googleapis.com/v4/spreadsheets/";
const SHEET_ID = "1PoEvfvSYw7QG0DXA62jUAhhKHi4srHHrB-zYPDsnP9g";



const units = []


async function fetchUnits(groups) {

   try {
      let res = await fetch("http://localhost:3000/")
      let data = await res.json();
      const API_KEY = data.key
      // Loop through tabs to get all unit data
      // await Promise.all(
      // groups.map(async (group) => {
      //    const endpoint = `${URL_LINK}${SHEET_ID}/values/${group}?valueRenderOption=FORMULA&key=${API_KEY}`;
      //    res = await fetch(endpoint);
      //    data = await res.json();
      //    console.log(data)
      //    })
      // )
      // Create a structure for the data per tab before using the promie.all method above (Reduces amount of API calls while structuring)
         const endpoint = `${URL_LINK}${SHEET_ID}/values/${groups[1]}?valueRenderOption=FORMULA&key=${API_KEY}`;
         res = await fetch(endpoint);
         data = await res.json();
         console.log(data)


   } catch (error) {
      console.error("Error:", error)
   }
}

fetchUnits(unitGroups)
