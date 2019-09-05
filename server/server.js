import express from 'express';
import 'babel-polyfill';
import getSendData from './getSendData.js';
const {localInit, getStarCount} = getSendData;
const app = express();

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

app.post('/email', (req, res) => {
  const message = {
    "hardest": "5.13a",
    "average": "5.10c",
    "ticks": [{
      "routeId": 105756046,
      "date": "2019-08-17",
      "pitches": 1,
      "notes": "How did I even fall last time ?",
      "style": "Lead",
      "leadStyle": "Redpoint",
      "tickId": 117610652,
      "userStars": 4,
      "userRating": ""
    }],
    "success": 1
  };
  res.send({
    message: JSON.stringify(message)
  });
});
export default app;
