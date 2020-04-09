const express = require('express')
const playwright = require('playwright')
const AWS = require('aws-sdk')
const app = express()

const { PORT = 3000 } = process.env

app.get('/', async (req, res) => {
  let url = req.query.url
  if (!url) {
    res.status(400).end()
    return
  }

  const browser = await playwright['firefox'].launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(url)
  const screenshotBuffer = await page.screenshot()
  await browser.close()

  var credentials = new AWS.SharedIniFileCredentials({profile: 'mine'})
  AWS.config.credentials = credentials

  AWS.config.getCredentials(function (err) {
    if (err) {
      console.log(err.stack)
      res.status(500).end()
    } else {
      console.log('Access key:', AWS.config.credentials.accessKeyId)
      console.log('Secret access key:', AWS.config.credentials.secretAccessKey)
      console.log('Region: ', AWS.config.region)
    }
  })

  var bucketName = 'dabase.com'
  var d = new Date()
  var yyyymmdd = d.toISOString().split('T')[0]
  var keyName = `${encodeURIComponent(url)}.png`

  var objectParams = {
    Bucket: bucketName,
    Key: `${yyyymmdd}/${keyName}`,
    Body: screenshotBuffer,
    ACL: 'public-read',
    ContentType: 'image/png'
  }

  console.log(`Uploading to ${objectParams.Key}`)

  var uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise()
  uploadPromise.then(
    function (data) {
      console.log('Successfully uploaded data to ' + objectParams.Key)
      res.redirect(`https://${bucketName}/${encodeURI(objectParams.Key)}`)
    }).catch(
    function (err) {
      console.error(err, err.stack)
      // How to res.pond?
      res.status(500).end()
    })
})

console.log('listening on %s', PORT)
app.listen(PORT)
