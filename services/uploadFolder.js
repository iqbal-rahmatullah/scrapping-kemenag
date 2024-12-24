import { Storage } from "@google-cloud/storage"
import fs from "fs"
import path from "path"

async function uploadFolderToGCS(bucketName, folderPath, destinationFolder) {
  const storage = new Storage({
    keyFilename: "big-masjid.json",
  })
  const bucket = storage.bucket(bucketName)

  async function uploadFile(filePath, destinationPath) {
    await bucket.upload(filePath, {
      destination: destinationPath,
    })
    console.log(`Uploaded ${filePath} to ${destinationPath}`)
  }

  async function uploadFolder(dirPath, destPath) {
    const filesAndDirs = fs.readdirSync(dirPath, { withFileTypes: true })

    for (const item of filesAndDirs) {
      const fullPath = path.join(dirPath, item.name)
      const destination = path.join(destPath, item.name)

      if (item.isDirectory()) {
        await uploadFolder(fullPath, destination)
      } else if (item.isFile()) {
        await uploadFile(fullPath, destination)
      }
    }
  }

  await uploadFolder(folderPath, destinationFolder)
  console.log("Folder upload complete.")
}

const main = (startYear, endYear) => {
  const bucketName = "big-masjid.appspot.com"

  for (let i = startYear; i <= endYear; i++) {
    const folderPath = "data/final/" + i
    const destinationFolder = "pray_time/prod/" + i

    uploadFolderToGCS(bucketName, folderPath, destinationFolder)
      .then(() => console.log("Upload completed successfully."))
      .catch((err) => console.error("Error uploading folder:", err))
  }
}

main(2028, 2034)
