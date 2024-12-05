import { getFileJson } from "./utils/functions.js"

const app = async () => {
  const data = await getFileJson("kabupaten.json")

  console.log(data.length)
}

app()
