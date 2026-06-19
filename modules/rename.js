import unitGroups from "../tabs.json" with { type: "json" };
export async function renameImgs(units) {
  const unitsImgs = [];
  try {
    await Promise.all(
      unitGroups.map(async (tab) => {
        const res = await fetch(`./Resources/${tab}.html`);
        const data = await res.text();
        const parser = new DOMParser();

        if (tab.includes("Characters")) return;

        const doc = parser.parseFromString(data, "text/html");
        const elements = Array.from(doc.querySelectorAll("td"));
        const target = elements.find((el) => {
          if (el.innerHTML === "SP") {
            const name = el.parentElement.querySelector("td").innerHTML;
            const unitImg =
              el.parentElement.nextElementSibling.querySelector("img").src;
            const bannerImg =
              el.parentElement.nextElementSibling.childNodes[
                el.parentElement.nextElementSibling.childNodes.length - 1
              ].querySelector("img").src;

            const unit = {
              name,
              unitImg,
              bannerImg,
              rename: [`${name}_small.jpg`, `${name}_big.jpg`],
            };

            unitsImgs.push(unit);
          }
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`HTTP ${res.status}\n${body}`);
        }
      }),
    );

    // Used to check if unit's images was not found and if found then skip
    // units.map((unit) => {
    //   let skip = false;
    //   unitsImgs.map((unitImg) => {
    //     if (unit.name === unitImg.name) skip = true;
    //   });
    //   if (skip) return;
    //   console.log(unit);
    // });
    sendJsonData(unitsImgs);
  } catch (err) {
    console.error(err);
  }
}

export async function sendJsonData(imgData) {
  const url = "http://localhost:3000/rename";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imgData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Error sending data:", error);
  }
}
