const HOSTURL = "http://localhost:3000";
export async function getCharacters() {
  try {
    const res = await fetch(`${HOSTURL}/api/characters`);
    const units = await res.json();
    return units;
  } catch (err) {
    console.error(err);
  }
}

export async function getCharacter(
  name,
  { sprite = false, banner = false } = {},
) {
  try {
    const res = await fetch(`${HOSTURL}/api/character/${name}`);
    const unit = await res.json();
    let imgs = [];
    let spriteData;
    if (sprite) {
      const spriteRes = await fetch(`${HOSTURL}/api/character/${name}/sprite`);
      spriteData = await spriteRes.blob();
      imgs.push({ sprite: spriteData });
    }
    let bannerData;
    if (banner) {
      const bannerRes = await fetch(`${HOSTURL}/api/character/${name}/banner`);
      bannerData = await bannerRes.blob();
      imgs.push({ banner: bannerData });
    }

    const unitData = {
      unit,
      ...(imgs.length > 0 ? { imgs } : null),
    };

    return unitData;
  } catch (err) {
    console.error(err);
  }
}
