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

app.get('/token', async (req, res) => {
  try {
    const outgoingApplicationSid = config.twimlAppSid
    const identity = 'user'

    console.log(config.pushCredentialId)
    const clients = await client.newKeys.create()
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: outgoingApplicationSid,
      incomingAllow: true, // Optional: add to allow incoming calls
      pushCredentialSid: config.pushCredentialId,
    })

    // client.calls
    //   .create({
    //     url: 'http://demo.twilio.com/docs/voice.xml',
    //     to: '+6282285265855',
    //     from: '+19032074645',
    //   })
    //   .then(call => {
    //     console.log('call.sid')
    //     console.log(call.sid)
    //   }).catch(e => {
    //     console.log(e)
    //   })

    const token = new AccessToken(accountSid, clients.sid, clients.secret)

    token.addGrant(voiceGrant)
    token.identity = identity
    res.json({
      identity: identity,
      token: token.toJwt(),
    })

    // const capability = new ClientCapability({
    //   accountSid: accountSid,
    //   authToken: authToken,
    // })

    // capability.addScope(new ClientCapability.IncomingClientScope('user'))
    // capability.addScope(
    //   new ClientCapability.OutgoingClientScope({
    //     applicationSid: 'AP28cd350a2dfd7e4f09337ad11c17090c',
    //     clientName: 'user',
    //   })
    // )

    // const token = capability.toJwt()

    // res.set('Content-Type', 'application/jwt')
    // res.json({
    //   identity: identity,
    //   token: token,
    // })
  } catch (e) {
    throw e
  }
})

app.post('/voice', async (req, res) => {
  console.log(req.body)
  console.log('halo')
  // https://handler.twilio.com/twiml/EH9eb2091baed8d9c953303f1209df2ff0
  client.calls
    .create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: 'client:user',
      from: '+19032074645',
    })
    .then(call => console.log(call.sid))
})

app.post('/halo', async (req, res) => {
  console.log(req.body)
  console.log('halo')
  // https://handler.twilio.com/twiml/EH9eb2091baed8d9c953303f1209df2ff0
  // client.calls
  //   .create({
  //     url: 'http://demo.twilio.com/docs/voice.xml',
  //     to: 'client:user',
  //     from: '+19032074645',
  //   })
  //   .then(call => console.log(call.sid))
})

app.post('/voice-xml', (req, res) => {
  // res.type('application/xml')
  // res.set('Content-Type', 'text/xml')
  // var example5 = [
  //   {
  //     toys: [
  //       {_attr: {decade: '80s', locale: 'US'}},
  //       {rumah: 'Transformers'},
  //       {toy: [{_attr: {knowing: 'half the battle'}}, 'GI Joe']},
  //       {
  //         toy: [
  //           {name: 'He-man'},
  //           {description: {_cdata: '<strong>Master of the Universe!</strong>'}},
  //         ],
  //       },
  //     ],
  //   },
  // ]

  // res.send(xml(example5))

  // The recipient of the call, a phone number or a client
  let to = req.body.to;

  const voiceResponse = new VoiceResponse();

  // if (!to) {
    console.log(req.body);
    console.log(req.body.To);
    const dial = voiceResponse.dial();

    // dial.number('+6282288269666');
    dial.conference({
      record: 'record-from-start',
      recordingStatusCallback: 'https://3ce4d44c.ngrok.io/halo',
    }, 'Room 1234');

    // const dial = await voiceResponse.dial({
    //   callerId: 'client:OldSchoolTammyHanover',
    // });
    // dial.client('user');
  // } else if (isNumber(to)) {
  //   const dial = voiceResponse.dial({callerId: '+19032074645'});
  //   dial.number('+6282288269666');
  // } else {
  //   const dial = voiceResponse.dial({callerId: callerId});
  //   dial.client('client:user');
  // }
  console.log('Response:' + voiceResponse.toString());
  return res.send(voiceResponse.toString());
})

app.listen(port, function() {
  console.log('Express server running on *:' + port)
})
