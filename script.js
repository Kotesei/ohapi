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
            const a4Acc = {itemName: unit[0][21], description: unit[1][23]}
            const skillsArray = [];
            let startRange;
            let endRange;
              console.log("====", unit[0][0], "====")
            // Loops through the rows in the unit array to get the details
            unit.map((row, pos) => {

               // Create the starting and end points for the unit's stats by finding which row can be used
                if (row[0] && row[0].includes("=HP")) {
                        startRange = pos
                     }
               if (row.includes("=SPD")) {
                  endRange = pos + 1
               }
          
               if (row.includes("EX")){
                  const skills = unit.slice(1, pos + 1)
                  skills.map(skill => {
                     // Skip any rows that are empty
                     if (!skill.length < 1) {            
                        if (skill[7]) {
                           const skillDescription = skill[7]
                           const spCost = skill[6]
                           // Get the index for SP cost that changes over the couse of leveling
                           const spCostReducedIndex = skill.findIndex(test => typeof test === "string" && test.includes("->") && test.includes("SP") && test.includes(":"))
                           
                           if (spCostReducedIndex > 0) {
                              console.log(skill, skill[spCostReducedIndex])
                           } else {
                              console.log(skill)
                           }
                           // [Make use of skillDescription for tasks below]
                           // To-do: Create a keyword list to apply types to skills based off if it's a Buff, Debuff, Heal, Attack skill
                           // To-do: Get the attack type of the skill and also try to tell if its a buff to allow a certain type of weak attack as a buff since this is not the same as attacking

                           // Include the EX skill condition, ignore the SP cost since EX skills are condition based not SP based.
                           if (skill.includes("EX")) {
                              const condition = {
                                 turns: skill[skill.indexOf("=Unlock") - 1],
                                 requirements: skill[skill.indexOf("=Unlock") + 1]
                              }
                              skillsArray.push({skillDescription, condition})
                           } else {
                              // If the array has the "TP" in the skill row then mark it true, otherwise continue as normal
                              if (skill.includes("TP")) {
                                 skillsArray.push({skillDescription, spCost, tpSkill: true})
                              } else {
                                 // Checks if there's anything to trigger the index for any skills that are upgraded via levels, otherwise continue as normal
                                 if (spCostReducedIndex > 0) {
                                    skillsArray.push({skillDescription, spCost, skillUpgrade: skill[spCostReducedIndex]})
                                 } else {
                                    skillsArray.push({skillDescription, spCost})
                                 }
                              }
                           }
                        }
                     }
                  })
               }
            })

            // Create the array for the stats using the ranges from earlier loop
            const statsArray = unit.slice(startRange, endRange)
            const stats = [];
            // Loop through each stat, clean anything that doesn't belong, and then store inside object
            statsArray.map((row, pos) => {
               const stat = row[0].replace("=", "");
               const statValues = {
                  stat,
                  lv100: row[1],
                  lv120: row[3]
               }
               stats.push(statValues)
            })

            // To-do Clean out any empty arrays from the unit array. 

            units.push({
               name: name,
               a4Acc,
               skills: skillsArray, 
               stats
               // Missing the Influence
               // Missing the Passives
               // Missing the Rarity
               // Missing the Release Date
               // Missing the VA
            })
         })

   } catch (error) {
      console.error("Error:", error)
   }
}

await fetchUnits(unitGroups)
console.log(units)