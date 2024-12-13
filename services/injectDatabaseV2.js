import { uid } from "uid"
import prisma from "../prisma/db.js"
import { getFileJson } from "../utils/functions.js"

const injectRegionFromPraytime = async () => {
  const prayTime = await getFileJson("jadwal-sholat/2024.old.json")

  for (let pray of prayTime) {
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
