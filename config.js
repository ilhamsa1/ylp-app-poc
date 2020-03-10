const dotenv = require('dotenv')
const config = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  twimlAppSid: process.env.TWILIO_TWIML_APP_SID,
  callerId: process.env.TWILIO_CALLER_ID,
  pushCredentialId: process.env.TWILIO_PUSH_CREDINTIAL_SID,
  mainUrl: process.env.MAIN_URL,
  port: process.env.PORT || 5009,
}

module.exports = config
