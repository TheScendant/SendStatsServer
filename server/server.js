import express from 'express';
import 'babel-polyfill';
import getSendData from './getSendData.js';
const { getStarCount, localInit, networkInit } = getSendData;
import utilities from './utilities.js';
const { DATA_TYPE_ENUM } = utilities;


const app = express();
app.use(express.json())
app.get('/api', (req, res) => {
  res.send({
    message: JSON.stringify({ "message": 'This is a message' })
  });
});

app.get('/testTicks', async (req, res) => {
  const sendMap = await localInit();
  const stars = getStarCount(sendMap);
  const message = `You have sent ${stars} stars!`;
  res.send({
    message: message
  })
});

app.post('/userId', async (req, res) => {
  let message;
  if (req.body && req.body.userId) {
    try {
      const { userId } = req.body;
      const sendMap = await networkInit(userId, DATA_TYPE_ENUM.USER_ID);
      // const stars = getStarCount(sendMap);
      const sends = [];
      for (const key of sendMap.keys()) {
        sends.push(sendMap.get(key));
      }
      message = sends;
    } catch (e) {
      message = "Error fetching send stats";
    }

  } else {
    message = "No userId found";
  }
  res.send({
    message: JSON.stringify(message)
  });
});

app.post('/email', async (req, res) => {
  let message;
  if (req.body && req.body.email) {
    try {
      const { email } = req.body;
      const sendMap = await networkInit(email, DATA_TYPE_ENUM.EMAIL);
      // const stars = getStarCount(sendMap);
      const sends = [];
      for (const key of sendMap.keys()) {
        sends.push(sendMap.get(key));
      }
      message = sends;
    } catch (e) {
      message = "Error fetching send stats";
    }

  } else {
    message = "No email found";
  }
  res.send({
    message: JSON.stringify(message)
  });
});
export default app;
