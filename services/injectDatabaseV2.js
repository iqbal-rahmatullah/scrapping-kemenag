import prisma from "../prisma/db.js"
import { getFileJson } from "../utils/functions.js"
import { v4 as uuidv4 } from "uuid"

const injectRegionFromPraytime = async () => {
  const prayTime = await getFileJson("jadwal-sholat/2024.json")
  const fileIsNotNeedSpace = [
    "KOTA TANJUNG PINANG",
    "KOTA PANGKAL PINANG",
    "KAB. TOLI-TOLI",
    "KOTA BAU-BAU",
  ]
  const replaceNameNotSpace = [
    "KOTA TANJUNGPINANG",
    "KOTA PANGKALPINANG",
    "KAB. TOLITOLI",
    "KOTA BAUBAU",
  ]
  const changeName = ["KAB. MAMUJU UTARA"]
  const replaceChangeName = ["KAB. PASANGKAYU"]

  for (let pray of prayTime) {
    if (fileIsNotNeedSpace.includes(pray.kota)) {
      const index = fileIsNotNeedSpace.indexOf(pray.kota)
      pray.kota = replaceNameNotSpace[index]
    } else if (changeName.includes(pray.kota)) {
      const index = changeName.indexOf(pray.kota)
      pray.kota = replaceChangeName[index]
    }

    const kabupaten = pray.kota
      .replace(/ /g, "-")
      .replace(/\./g, "")
      .toLowerCase()

    await prisma.region.create({
      data: {
        id: uuidv4(),
        name: kabupaten,
      },
    })
  }
}

injectRegionFromPraytime()
