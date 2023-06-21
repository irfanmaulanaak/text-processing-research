const express = require('express');
const app = express();
const {main} = require("./gpt")
const bodyParser = require('body-parser')
app.use(bodyParser.json())
// Define routes and middleware here

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post('/api/gpt', async (req, res) => {
    try {
        const response = await main(req.body.question);
        console.log("response api ",response)
        res.json(response);
    } catch (error) {
        return res.sendStatus(400);
    }
  });

app.post('/api')