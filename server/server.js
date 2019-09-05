import express from 'express';
const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'This is a message'
    });
});
export default app;
