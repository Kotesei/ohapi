const units = [];
export function parseUnits(data) {
  let job;
  switch (true) {
    case data.range.includes("Warriors"):
      job = "Warrior";
      break;
    case data.range.includes("Merchants"):
      job = "Merchant";
      break;
    case data.range.includes("Thieves"):
      job = "Thief";
      break;
    case data.range.includes("Apothecaries"):
      job = "Apothecary";
      break;
    case data.range.includes("Hunters"):
      job = "Hunter";
      break;
    case data.range.includes("Clerics"):
      job = "Cleric";
      break;
    case data.range.includes("Scholars"):
      job = "Scholar";
      break;
    case data.range.includes("Dancers"):
      job = "Dancer";
      break;
    default:
      return;
  }

  let unitDataStartingPoints = [];
  let unitDataEndingPoints = [];
  const unitData = [];

  // Create starting and end points for the units
  data.values.map((row, pos) => {
    if (row.includes("Splash Art")) {
      unitDataStartingPoints.push(pos);
    }
    if (
      row.length < 1 &&
      data.values[pos + 1][0] &&
      !data.values[pos + 1][0].includes("=")
    ) {
      unitDataEndingPoints.push(pos);
    }
  });
  // Push the last index value for the last unit in the sheet
  unitDataEndingPoints.push(data.values.length);

  // Push the unit data by using the slice method to seperate them into their own array since there is no seperator pattern found.
  unitDataStartingPoints.map((_, pos) => {
    unitData.push(
      data.values.slice(unitDataStartingPoints[pos], unitDataEndingPoints[pos]),
    );
  });

  unitData.map((unit) => {
    const name = unit[0][0];
    const a4Acc = { itemName: unit[0][21], description: unit[1][23] };
    const skillsArray = [];
    const passives = [];
    const resists = [];
    const stats = [];
    let ultimate;
    const unitCleaned = unit.filter((row) => row.length > 0);

    // Loops through the rows in the unit array to get the details
    unitCleaned.map((row, pos) => {
      if (row.includes("Resists")) {
        const resistsData = unitCleaned
          .slice(pos)
          .filter((row) => row[0].includes("="));
        resistsData.map((resist) =>
          resists.push({
            amount: resist[1],
            type: resist[0].replace("=", "").split("_")[0],
          }),
        );
      }

      if (row.includes("Passive")) {
        unitCleaned.slice(pos + 1).map((row) => {
          if (row[5]) {
            const passive = {
              rank: row[5],
              description: row[6],
            };
            passives.push(passive);
          } else return;
        });
      }

      //   Used for starting point for stats
      if (row[0] && row[0].includes("=HP")) {
        const start = unitCleaned.slice(pos);
        start.map((row, pos) => {
          if (row[0].includes("SPD")) {
            const statValues = start.slice(0, pos + 1);
            statValues.map((row, pos) => {
              const stat = row[0].replace("=", "");
              const statValues = {
                stat,
                lv100: row[1],
                lv120: row[3],
              };
              stats.push(statValues);
            });
          }
        });
      }

      //   Used for skills
      if (row.includes("EX")) {
        const skills = unit.slice(1, pos + 1);
        skills.map((skill) => {
          // Skip any rows that are empty
          if (!skill.length < 1) {
            if (skill[7]) {
              const skillDescription = skill[7];
              const spCost = skill[6];
              // Get the index for SP cost that changes over the couse of leveling
              const spCostReducedIndex = skill.findIndex(
                (test) =>
                  typeof test === "string" &&
                  test.includes("->") &&
                  test.includes("SP") &&
                  test.includes(":"),
              );

              let skillObj = {
                skillDescription,
                ...(spCost ? { spCost } : null),
              };
              const skillRank = skill[5];
              switch (skillRank) {
                case "2*":
                  skillObj.rank = 2;
                  break;

                case "3*":
                  skillObj.rank = 3;
                  break;

                case "4*":
                  skillObj.rank = 4;
                  break;

                case "5*":
                  skillObj.rank = 5;
                  break;
              }

              // Include the EX skill condition, ignore the SP cost since EX skills are condition based not SP based.
              if (skill.includes("EX")) {
                const condition = {
                  turns: skill[skill.indexOf("=Unlock") - 1],
                  requirements: skill[skill.indexOf("=Unlock") + 1],
                };
                skillObj.condition = condition;
                skillObj.exSkill = true;
                skillsArray.push(skillObj);
              } else {
                // If the array has the "TP" in the skill row then mark it true, otherwise continue as normal
                if (skill.includes("TP")) {
                  skillObj.tpSkill = true;
                  skillsArray.push(skillObj);
                } else {
                  // Checks if there's anything to trigger the index for any skills that are upgraded via levels, otherwise continue as normal
                  if (spCostReducedIndex > 0) {
                    skillObj.skillUpgrade = skill[spCostReducedIndex];
                    skillsArray.push(skillObj);
                  } else {
                    skillsArray.push(skillObj);
                  }
                }
              }
            }
          }
        });
      }

      if (row[5]?.includes("Lv20")) {
        ultimate = row[7];
      }
    });

    units.push({
      name: name,
      a4Acc,
      skills: skillsArray,
      stats,
      ultimate,
      passives,
      resists,
      job,
    });
  });
  return units;
}
