import { getFileJson } from "../utils/functions.js"
import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const formattingJadwalByRegionOneYear = async () => {
  const year = process.argv[2]
  const prayTime = await getFileJson(`jadwal-sholat/${year}.json`)
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

    for (let time in pray.data) {
      const monthFile = time.split("-")
      const checkFile = path.join(
        __dirname,
        "../data/final" + `/${year}/${monthFile[1]}/`
      )

      if (!fs.existsSync(checkFile)) {
        fs.mkdirSync(checkFile, { recursive: true })
      }

      const filePath = path.join(
        __dirname,
        "../data/final" +
          `/${year}/${monthFile[1]}/` +
          kabupaten +
          `-${monthFile[1]}-${monthFile[0]}` +
          ".json"
      )

      let oldData = []

      if (fs.existsSync(filePath)) {
        oldData = JSON.parse(fs.readFileSync(filePath, "utf-8"))
      }

      oldData.push(pray.data[time])

      fs.writeFileSync(filePath, JSON.stringify(oldData, null, 2), "utf-8")
      console.log("Data inserted successfully:", kabupaten)
    }
  }
}

formattingJadwalByRegionOneYear()
