import { getFileJson } from "../utils/functions.js"
import prisma from "../prisma/db.js"
import { uid } from "uid"

// const injectProvince = async () => {
//   const provinsi = await getFileJson("provinsi.json")

//   for (let prov of provinsi) {
//     const { label, value } = prov

//     await prisma.mstProvince.create({
//       data: {
//         id: value,
//         name: label,
//       },
//     })
//   }
// }

// const injectRegion = async () => {
//   const region = await getFileJson("kabupaten.json")

//   for (let reg of region) {
//     for (let kab of reg.kabupaten) {
//       const { label, value } = kab

//       await prisma.region.create({
//         data: {
//           id: value,
//           provinceId: reg.provinsi_id,
//           name: label,
//         },
//       })
//     }
//   }
// }

// const injectPrayTime = async () => {
//   const prayTime = await getFileJson("jadwal-sholat/2024.json")

//   for (let pray of prayTime) {
//     const kabupaten = await prisma.region.findFirst({
//       where: {
//         name: {
//           contains: pray.kota,
//         },
//       },
//     })

//     if (kabupaten == null) {
//       console.log("Kabupaten tidak ditemukan " + pray.kota)
//     }

//     for (let time in pray.data) {
//       for (let timePray in pray.data[time]) {
//         if (timePray !== "tanggal") {
//           const finalData = {
//             id: uid(36),
//             date: time,
//             name: timePray,
//             time: pray.data[time][timePray],
//             region_id: kabupaten.id,
//           }

//           let attempts = 0
//           const maxAttempts = 100000

//           while (attempts < maxAttempts) {
//             try {
//               await prisma.prayTime.create({
//                 data: {
//                   date: new Date(finalData.date).toISOString(),
//                   id: finalData.id,
//                   name: finalData.name,
//                   time: finalData.time,
//                   regionId: finalData.region_id,
//                 },
//               })
//               console.log("Data inserted successfully:", finalData.id)
//               break
//             } catch (error) {
//               attempts++
//               console.error(
//                 `Attempt ${attempts} failed for ID: ${finalData.id}. Error:`,
//                 error
//               )

//               if (attempts >= maxAttempts) {
//                 console.error(
//                   `Failed to insert data after ${maxAttempts} attempts. Skipping ID: ${finalData.id}`
//                 )
//               } else {
//                 console.log(
//                   `Retrying to insert data for ID: ${finalData.id}...`
//                 )
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }

const injectRegionFromPraytime = async () => {
  // const prayTime = await getFileJson("jadwal-sholat/2024.old.json")
  // for (let pray of prayTime) {
  //   const kabupaten = pray.kota
  //     .replace(/ /g, "-")
  //     .replace(/\./g, "")
  //     .toLowerCase()
  //   console.log(kabupaten)
  //   const province = await prisma.mstProvince.findFirst({
  //     where: {
  //       name: {
  //         contains: pray.provinsi,
  //       },
  //     },
  //   })
  //   if (province == null) {
  //     console.log("Provinsi tidak ditemukan " + pray.provinsi)
  //   }
  // await prisma.region.create({
  //   data: {
  //     name: kabupaten,
  //   },
  // })
  // }
}

// injectRegionFromPraytime()
