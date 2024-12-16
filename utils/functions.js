import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const ObjToEncodedBody = (obj) => {
  if (typeof obj !== "object") return ""

  return new URLSearchParams(Object.entries(obj))
}

export const getFileJson = async (fileName) => {
  const filePath = path.join(__dirname, "../data", fileName)

  const rawData = fs.readFileSync(filePath, "utf-8")
  const jsonData = JSON.parse(rawData)

  return jsonData
}

export const saveFileJson = (fileName, newData) => {
  const filePath = path.join(__dirname, "../data", fileName)

  let data = []

  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, "utf-8")
    data = JSON.parse(rawData)
  }

  let provinsiIndex = data.findIndex(
    (item) => item.provinsi_id === newData.provinsi_id
  )

  if (provinsiIndex === -1) {
    data.push({
      provinsi: newData.provinsi,
      provinsi_id: newData.provinsi_id,
      kabupaten: newData.kabupaten.map((kab) => ({
        value: kab.value,
        label: kab.label,
      })),
    })
  } else {
    const existingKabupaten = data[provinsiIndex].kabupaten.map(
      (kab) => kab.label
    )
    const newKabupaten = newData.kabupaten.filter(
      (kab) => !existingKabupaten.includes(kab.label)
    )

    data[provinsiIndex].kabupaten.push(
      ...newKabupaten.map((kab) => ({
        value: kab.value,
        label: kab.label,
      }))
    )
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
}

export const saveJadwalSholat = (fileName, newData) => {
  const filePath = path.join(__dirname, "../data/jadwal-sholat/", fileName)

  const dirPath = path.dirname(filePath)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf-8")
  }

  let data = JSON.parse(fs.readFileSync(filePath, "utf-8"))

  let provinsiIndex = data.findIndex(
    (item) => item.provinsi === newData.prov && item.kota === newData.kabko
  )

  if (provinsiIndex === -1) {
    data.push({
      provinsi: newData.prov,
      kota: newData.kabko,
      data: newData.data,
    })
  } else {
    const existingDates = Object.keys(data[provinsiIndex].data)
    const newDates = Object.keys(newData.data).filter(
      (date) => !existingDates.includes(date)
    )

    newDates.forEach((date) => {
      data[provinsiIndex].data[date] = newData.data[date]
    })
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
}

export const formattingJadwalByRegion = async (originFile, year) => {
  const prayTime = await getFileJson(originFile)

  for (let pray of prayTime) {
    const kabupaten = pray.kota
      .replace(/ /g, "-")
      .replace(/\./g, "")
      .toLowerCase()

    const monthFile = Object.keys(pray.data)[0].split("-")
    const filePath = path.join(
      __dirname,
      "../data/final" +
        `/${year}/` +
        kabupaten +
        `-${monthFile[1]}-${monthFile[0]}` +
        ".json"
    )

    const dirPath = path.dirname(filePath)
    let oldData = []

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })

      oldData = JSON.parse(fs.readFileSync(filePath, "utf-8"))
    }

    for (let time in pray.data) {
      for (let timePray in pray.data[time]) {
        if (timePray !== "tanggal") {
          const finalData = {
            date: time,
            name: timePray,
            time: pray.data[time][timePray],
          }
          let attempts = 0
          const maxAttempts = 100000
          oldData.push(finalData)

          while (attempts < maxAttempts) {
            try {
              fs.writeFileSync(
                filePath,
                JSON.stringify(oldData, null, 2),
                "utf-8"
              )
              console.log("Data inserted successfully:", finalData.name)
              break
            } catch (error) {
              attempts++
              console.error(
                `Attempt ${attempts} failed for ID: ${finalData.id}. Error:`,
                error
              )
              if (attempts >= maxAttempts) {
                console.error(
                  `Failed to insert data after ${maxAttempts} attempts. Skipping ID: ${finalData.id}`
                )
              } else {
                console.log(
                  `Retrying to insert data for ID: ${finalData.id}...`
                )
              }
            }
          }
        }
      }
    }
  }
}

export const formattingJadwalByRegionOneYear = async (originFile) => {
  const prayTime = await getFileJson(originFile)

  for (let pray of prayTime) {
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

// formattingJadwalByRegionOneYear("jadwal-sholat/2024.old.json", "2024")
