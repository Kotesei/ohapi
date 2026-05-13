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
      // Loop through tabs to get all unit data (Do NOT use yet)
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
         let unitDataStartingPoints = []
         let unitDataEndingPoints = []
         const unitData = []
        
         // Create starting and end points for the units
         data.values.map((row, pos) => {
            if (row.includes("Splash Art")){
               unitDataStartingPoints.push(pos)
            }
            if (row.length < 1 && data.values[pos + 1][0] && !data.values[pos + 1][0].includes("=")) {
               unitDataEndingPoints.push(pos)
            }
         })
         // Push the last index value for the last unit in the sheet
         unitDataEndingPoints.push(data.values.length)

         // Push the unit data by using the slice method to seperate them into their own array since there is no seperator pattern found.
         unitDataStartingPoints.map((_, pos) => {
            unitData.push(data.values.slice(unitDataStartingPoints[pos], unitDataEndingPoints[pos]))
         })

         unitData.map(unit => {
            const name = unit[0][0]
            const awakeningAccessoryName = unit[0][21]
            const awakeningAccessoryDecription = unit[1][23]
            const skillsArray = [];

            // Loops through skills to get the SP cost and description 
            // To-do: (probably label if skill is EX/TP or not in future)
            unit.map((row, pos) => {
               if (row.includes("EX")){
                  const skills = unit.slice(1, pos + 1)
                  skills.map(skill => {
                     // Skip any rows that are empty
                     if (!skill.length < 1) {
                        if (skill[7]) {
                           const skillDescription = skill[7]
                           const spCost = skill[6]
                           if (skill.includes("EX")) {
                              const condition = {
                                 turns: skill[skill.indexOf("=Unlock") - 1],
                                 requirements: skill[skill.indexOf("=Unlock") + 1]
                              }
                              skillsArray.push({skillDescription: skillDescription, condition: condition})
                           } else {
                              skillsArray.push({skillDescription: skillDescription, spCost: spCost})
                           }
                        }
                     }
                  })
               }
            })


            // Also create a relation-link object that understands parts like =HP =SP etc.. in the sheet
            // Clean out any empty arrays from the unit array. 

            units.push({
               name: name,
               awakeningAccessoryName: awakeningAccessoryName,
               awakeningAccessoryDecription: awakeningAccessoryDecription,
               skills: skillsArray
            })
         })

   } catch (error) {
      console.error("Error:", error)
   }
}

await fetchUnits(unitGroups)
console.log(units)