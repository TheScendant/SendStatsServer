import express from 'express';
import 'babel-polyfill';
import getSendData from './getSendData.js';
const { getStarCount, localInit, newtworkInit } = getSendData;
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

app.post('/email', async (req, res) => {
  let message;
  if (req.body && req.body.email) {
    const { email } = req.body;
    const sendMap = await newtworkInit(email);
    const stars = getStarCount(sendMap);
    message = `Hey ${req.body} you have sent ${stars} stars.`;
  } else {
    message = "No email found";
  }
  res.send({
    message: JSON.stringify(message)
  });
});
export default app;
