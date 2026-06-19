import "dotenv/config";
import express from "express";
import cors from "cors";
import { parseUnits } from "./modules/parseUnits.js";
import * as fs from "node:fs";

const tabs = JSON.parse(fs.readFileSync("./tabs.json", "utf-8"));
const URL_LINK = "https://sheets.googleapis.com/v4/spreadsheets/";
const SHEET_ID = "1PoEvfvSYw7QG0DXA62jUAhhKHi4srHHrB-zYPDsnP9g";
const API_KEY = process.env.API_KEY;

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

let unitsData;
// If data isnt found then fetch it from the google sheet
if (!fs.existsSync("./units.json")) {
  console.log("Fetching Data from google sheet");
  await Promise.all(
    tabs.map(async (tab) => {
      const endpoint = `${URL_LINK}${SHEET_ID}/values/${tab}?valueRenderOption=FORMULA&key=${API_KEY}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      unitsData = parseUnits(data);
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`HTTP ${res.status}\n${body}`);
      }
    }),
  );

  fs.writeFileSync("./units.json", JSON.stringify(unitsData, null, 2));
  console.log("DONE!!");
} else {
  console.log("Loaded units.json file");
}

// Used for testing / updating purposes [THIS SHOULD NOT BE USED IN PRODUCTION, ONLY USE FOR FRONT END TESTING OR UPDATING THE PARSEUNITS FUNCTION!!!]
// app.get("/", (req, res) => res.end(API_KEY));

app.get("/api", (req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  const units = fs.readFileSync("./units.json", "utf-8");
  res.end(units);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Mostly used for renaming purposes and storing th unit's sprite/banner img in a folder neatly
app.post("/rename", (req, res) => {
  const { imgData } = req.body;
  imgData.map((unit) => {
    const { name, unitImg, bannerImg, rename } = unit;
    const [small, big] = rename;
    const spriteLocation = unitImg.replace(
      "http://127.0.0.1:5501/",
      "./Resources/",
    );
    const bannerLocation = bannerImg.replace(
      "http://127.0.0.1:5501/",
      "./Resources/",
    );
    const destPath = `./Resources/resources/${name}`;
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
      console.log(`Created missing directory: ${destPath}`);
      fs.copyFileSync(spriteLocation, `${destPath}/${small}`);
      fs.copyFileSync(bannerLocation, `${destPath}/${big}`);
    }
  });
});
