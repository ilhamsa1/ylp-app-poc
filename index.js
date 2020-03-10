const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const cors = require('cors')
var xml = require('xml')

const callerId = 'client:quick_start'
// Use a valid Twilio number by adding to your account via https://www.twilio.com/console/phone-numbers/verified
const callerNumber = '+19032074645'

const isNumber = to => {
  if (to.length === 1) {
    if (!isNaN(to)) {
      console.log('It is a 1 digit long number' + to)
      return true
    }
  } else if (String(to).charAt(0) == '+') {
    let number = to.substring(1)
    if (!isNaN(number)) {
      // eslint-disable-next-line no-console
      console.log('It is a number ' + to)
      return true
    }
  } else if (!isNaN(to)) {
    console.log('It is a number ' + to);
    return true;
  }
  console.log('not a number')
  return false
}

const port = config.port
// Create Express webapp
const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))

const accountSid = config.accountSid
const authToken = config.authToken

const AccessToken = require('twilio').jwt.AccessToken
const client = require('twilio')(accountSid, authToken)
const VoiceGrant = AccessToken.VoiceGrant

const ClientCapability = require('twilio').jwt.ClientCapability
const VoiceResponse = require('twilio').twiml.VoiceResponse

// Create http server and run it

app.post('/call-service/recorder-status', async (req, res) => {
  // todo: save recorder url to database

  const recording = client.recordings(req.body.RecordingSid)
    .fetch()

  console.log(recording)

  res.json({
    response: 'Recorder saved',
  })
})

app.post('/call-service/conference-call', (req, res) => {
  const { room } = req.body

  const voiceResponse = new VoiceResponse()

  const dial = voiceResponse.dial()

  dial.conference({
    record: 'record-from-start',
    recordingStatusCallback: `${config.mainUrl}/call-service/recorder-status`,
  }, '1234')

  // console.log(`Response:${voiceResponse.toString()}`)

  res.send(voiceResponse.toString())
})

app.listen(port, function() {
  console.log('Express server running on *:' + port)
})
