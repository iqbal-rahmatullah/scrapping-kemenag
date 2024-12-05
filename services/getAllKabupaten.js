import generateCookie from "./generateCookie.js"
import {
  getFileJson,
  ObjToEncodedBody,
  saveFileJson,
} from "../utils/functions.js"

const getAllKabupaten = async () => {
  const BASE_URL = "https://bimasislam.kemenag.go.id/ajax/getKabkoshalat"
  const dataProvinsi = await getFileJson("provinsi.json")

  for (let provinsi of dataProvinsi) {
    const MAX_RETRIES = 10000
    let retries = 0
    let dataFetched = false
    let finalData = null

    while (!dataFetched && retries < MAX_RETRIES) {
      try {
        const cookie = await generateCookie()
        console.log(`Start cookie ${cookie}`)
        console.log(`Start provinsi ${provinsi.value}, attempt ${retries + 1}`)

        const regency = await fetch(BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: cookie,
          },
          body: ObjToEncodedBody({
            x: provinsi.value,
          }),
        })

        const result = await regency.text()

        const toList = [
          ...result.matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g),
        ].map((item) => ({
          value: item[1],
          label: item[2],
        }))

        if (toList.length == 0) {
          console.log(`Empty result for ${provinsi.label}. Retrying...`)
          retries++
          await new Promise((resolve) => setTimeout(resolve, 2000))
          continue
        }

        finalData = {
          provinsi: provinsi.label,
          provinsi_id: provinsi.value,
          kabupaten: toList,
        }
        dataFetched = true
      } catch (error) {
        console.error(
          `Error fetching data for ${provinsi.label}:`,
          error.message
        )
        retries++
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    if (finalData) {
      console.log(`Final data ${provinsi.label} `, finalData)
      saveFileJson("kabupaten.json", finalData)
    } else {
      console.error(
        `Failed to fetch data for ${provinsi.label} after ${MAX_RETRIES} attempts.`
      )
    }
  }
}

getAllKabupaten()
