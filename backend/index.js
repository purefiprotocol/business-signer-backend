const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { 
  PureFI,
  PureFIErrorCodes,
  PureFIError
 } = require('@purefi/verifier-sdk');

dotenv.config({
  path: '../.env',
});

const app = express();
app.use(cors())
app.use(bodyParser.json());

const port = +process.env.APP_BACK_PORT;
const purefiApiKey = process.env.APP_PUREFI_API_KEY;

// Env parameters validation
if(!port) {
  throw new Error('Invalid app port in env');
}

if(!purefiApiKey) {
  throw new Error('Invalid purefi api key')
}

// Endpoints
app.post('/verify/rule', async (req, res) => {

  // Body parameters validation
  if(!req?.body?.message) {
    return res.status(400).send('Message is required');
  }
  if(!req?.body?.signature) {
    return res.status(400).send('Signature is required');
  }

  const payload = {
    message: req.body.message,
    signature: req.body.signature,
  };

  try {
    const data = await PureFI.verifyRule(payload, purefiApiKey);
    return res.send(data);
  } catch(err) {
    switch (err.code) {
      case PureFIErrorCodes.VALIDATION: {
        return res.status(400).send(err.message);
      }
      case PureFIErrorCodes.FORBIDDEN: {
        return res.status(403).send(err.message);
      }
      default: {
        return res.status(400).send(err);
      }
    }
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})