const express = require('express')
const playwright = require('playwright')
// const { Logger } = require('up')
const app = express()

const { PORT = 3000 } = process.env

// const log = new Logger()

app.get('/', async (req, res) => {
  let url = req.query.url
  if (!url) {
    res.status(400).end()
    return
  }

  // log.info('screenshot', { url })

  const browser = await playwright['firefox'].launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(url)
  const screenshotBuffer = await page.screenshot()
  await browser.close()
  // const img = screenshotBuffer.toString('base64')

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': screenshotBuffer.length
  })
  res.end(screenshotBuffer)
})

console.log('listening on %s', PORT)
app.listen(PORT)
