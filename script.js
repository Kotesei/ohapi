"use strict";
// For testing / updating parseUnits.js
import unitGroups from "./tabs.json" with { type: "json" };
import { parseUnits } from "./modules/parseUnits.js";
const URL_LINK = "https://sheets.googleapis.com/v4/spreadsheets/";
const SHEET_ID = "1PoEvfvSYw7QG0DXA62jUAhhKHi4srHHrB-zYPDsnP9g";

async function fetchUnits(groups) {
  try {
    let res = await fetch("http://localhost:3000/");
    let data = await res.text();
    const API_KEY = data;
    const endpoint = `${URL_LINK}${SHEET_ID}/values/${groups[4]}?valueRenderOption=FORMULA&key=${API_KEY}`;
    res = await fetch(endpoint);
    data = await res.json();
    console.log(parseUnits(data));
  } catch (error) {
    console.error("Error:", error);
  }
}

await fetchUnits(unitGroups);
