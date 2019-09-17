import express from 'express';
import 'babel-polyfill';
import { getStarCount, localInit, networkInit } from './getSendData.js';
import { getDataAndType } from './utilities.js';
import {networkInit as getUserData} from './getUserData';


const app = express();
app.use(express.json())

app.get('/testTicks', async (req, res) => {
  const sendMap = await localInit();
  /* const stars = getStarCount(sendMap);
  const message = `You have sent ${stars} stars!`; */
  const sends = [];
  for (const key of sendMap.keys()) {
    sends.push(sendMap.get(key));
  }
  const message = sends;
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


app.post('/sendData', async (req, res) => {
  let message;
  if (req.body) {
    try {
      const [data, dataType] = getDataAndType(req.body);
      const sendMap = await networkInit(data, dataType);
      const sends = [];
      for (const key of sendMap.keys()) {
        sends.push(sendMap.get(key));
      }
      message = sends;
    }
    catch(e) {
      console.error(e);
      message = "Error fetching send stats";
      res.status(500);
    }
  } else {
    console.error("No userId or email");
    res.status(400)
  }
  res.send({
    message: JSON.stringify(message)
  });
})

export default app;
