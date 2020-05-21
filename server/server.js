import express from 'express';
import 'babel-polyfill';
import { allGradesInit, getStarCount, localInit as gsdL, networkInit as gsdN } from './getSendData.js';
import { getDataAndType } from './utilities.js';
import {networkInit as gudN, localInit as gudL} from './getUserData';


const app = express();
app.use(express.json())

const useCachedData = false;
let getUserData, getSendData;
if (useCachedData) {
  getUserData = gudL;
  getSendData = gsdL
} else {
  getUserData = gudN;
  getSendData = gsdN;
}

app.post('/userData', async (req, res) => {
  let message;
  try {
    const [data, dataType] = getDataAndType(req.body);
    const userData = await getUserData(data, dataType);
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
      const sendMap = await getSendData(data, dataType);
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
