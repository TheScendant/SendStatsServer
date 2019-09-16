import express from 'express';
import 'babel-polyfill';
import { getStarCount, localInit, networkInit } from './getSendData.js';
import { DATA_TYPE_ENUM } from './utilities.js';
import {networkInit as getUserData} from './getUserData';


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



app.post('/userData', async (req, res) => {
  let message;
  try {
    const userData = await getUserData();
    // add some checking here
    message = userData;
  } catch(e) {
    res.status(500);
    message = "Error fetching user data";
  }
  res.send({
    message: JSON.stringify(message)
  })
})

// dosomething, combine these into 1 ep that picks
// data type enum based on req body contents
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
      res.status(500);
    }

  } else {
    message = "No userId found";
    res.status(400);
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
      res.status(500);
    }

  } else {
    message = "No email in request";
    res.status(400);
  }
  res.send({
    message: JSON.stringify(message)
  });
});
export default app;
