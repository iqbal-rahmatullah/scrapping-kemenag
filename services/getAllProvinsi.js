import puppeteer from "puppeteer"

const scrapeOptions = async (url, selectSelector, maxRetries = 100) => {
    let retries = 0
    while (retries < maxRetries) {
        try {
            const browser = await puppeteer.launch({ headless: true })
            const page = await browser.newPage()

            await page.goto(url, { waitUntil: "networkidle2" })

            await page.waitForFunction(
                (selectSelector) => {
                    const selectElement = document.querySelector(selectSelector)
                    return selectElement && selectElement.options.length > 1
                },
                {},
                selectSelector
            )

            const options = await page.evaluate((selectSelector) => {
                const selectElement = document.querySelector(selectSelector)
                const optionsArray = Array.from(selectElement.options)
                return optionsArray.map((option) => ({
                    value: option.value,
                    name: option.textContent.trim(),
                }))
            }, selectSelector)

            console.log("Scraping successful:", options)

            await browser.close()
            return options
        } catch (error) {
            retries++
            console.error(`Attempt ${retries} failed:`, error.message)

            if (retries >= maxRetries) {
                console.error("Max retries reached. Scraping failed.")
                throw error
            }
        }
    }
}

scrapeOptions("https://bimasislam.kemenag.go.id/jadwalshalat", "#search_prov")
    .then((options) => console.log("Final Result:", options))
    .catch((err) => console.error("Scraping failed:", err.message))
