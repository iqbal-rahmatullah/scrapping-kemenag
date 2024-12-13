import {
  getFileJson,
  ObjToEncodedBody,
  saveJadwalSholat,
} from "../utils/functions.js"
import generateCookie from "./generateCookie.js"

const RED = "\x1b[31m"
const YELLOW = "\x1b[33m"
const RESET = "\x1b[0m"
const BLUE = "\x1b[34m"

const getJadwalSholat = async () => {
  const BASE_URL = "https://bimasislam.kemenag.go.id/ajax/getShalatbln"
  const dataKabupaten = await getFileJson("kabupaten.json")
  const year = 2026

  for (let provinsi of dataKabupaten) {
    for (let kabupaten of provinsi.kabupaten) {
      for (let i = 1; i <= 12; i++) {
        const MAX_RETRIES = 10000
        let retries = 0
        let dataFetched = false

        while (!dataFetched && retries < MAX_RETRIES) {
          try {
            const cookie = await generateCookie()
            const jadwal = await fetch(BASE_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie: cookie,
              },
              body: ObjToEncodedBody({
                x: provinsi.provinsi_id,
                y: kabupaten.value,
                bln: i,
                thn: year,
              }),
            })

            const tempData = await jadwal.json()
            if (tempData.status != 1) {
              console.log(
                `Empty result for ${BLUE}${provinsi.provinsi} - ${kabupaten.label} - Bulan ${i}${RESET} - ${YELLOW}Attempt : ${retries}${RESET}.`
              )
              retries++
              await new Promise((resolve) => setTimeout(resolve, 2000))
              continue
            }

            console.log(tempData)
            saveJadwalSholat(`${year}.json`, tempData)
            dataFetched = true
          } catch (error) {
            console.error(
              `${RED}ERROR: ${RESET} fetching data for ${BLUE}${provinsi.provinsi} - ${kabupaten.label} - Bulan ${i}${RESET}: ${RED}${error.message}${RESET} - ${YELLOW}Attempt : ${retries}${RESET}`
            )
            retries++
            await new Promise((resolve) => setTimeout(resolve, 2000))
          }
        }
      }
    }
  }
}

getJadwalSholat()
