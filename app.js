const AWS = require('aws-sdk')
const express = require('express')
const playwright = require('playwright-firefox')

const app = express()
const { PORT = 3000 } = process.env

// console.log(process.env)

app.get('/', async (req, res) => {
  res.send(`<h1>Web screenshot</h1>
  <form action=/screenshot>
  <input type=url name=url>
  <input type=submit>
  </form>`)
})

app.get('/screenshot', async (req, res, next) => {
  let url = req.query.url
  if (!url) {
    res.status(400).send('Bad Request: no url provided')
    return
  }

  try {
    const browser = await playwright['firefox'].launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(url)
    const screenshotBuffer = await page.screenshot()
    await browser.close()

    const bucketName = process.env.BUCKET || 'dabase.com'
    const yyyymmdd = new Date().toISOString().split('T')[0]
    const keyName = `${encodeURIComponent(url)}.png`

    const objectParams = {
      Bucket: bucketName,
      Key: `${yyyymmdd}/${keyName}`,
      Body: screenshotBuffer,
      ACL: 'public-read',
      ContentType: 'image/png'
    }

    console.log(`Uploading to ${objectParams.Key}`)

    await new AWS.S3().putObject(objectParams).promise()
    res.redirect(`https://${bucketName}/${encodeURI(objectParams.Key)}`)
  } catch (error) {
    next(error)
  }
})

console.log('listening on %s', PORT)
app.listen(PORT)
