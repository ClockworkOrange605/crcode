import puppeteer from 'puppeteer'
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'
import ffmpeg from 'fluent-ffmpeg'

//TODO: refactor on production like resources
const recordPage = async (url, path) => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: {
      deviceScaleFactor: 1,
      width: 1920, height: 1080,
      // width: 1280, height: 720,
    }
  })

  console.time('video')

  const page = await browser.newPage()
  const recorder = new PuppeteerScreenRecorder(page)
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  await recorder.start(`${path}demo.mp4`)
  await page.waitForTimeout(1000 * 5)
  await recorder.stop()

  await browser.close()

  console.timeEnd('video')

  console.time('frames')

  //TODO: make sure that return after screenshots
  ffmpeg(`${path}demo.mp4`)
    .screenshots({
      folder: path,
      filename: 'preview.png',
      count: 9,
    })
    .on('end', function () {
      console.timeEnd('frames')
      return true
    })
}

export { recordPage }