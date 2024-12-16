import { uid } from "uid"
import prisma from "../prisma/db.js"
import { getFileJson } from "../utils/functions.js"

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
        id: uid(32),
        name: kabupaten,
      },
    })
  }
}

injectRegionFromPraytime()
