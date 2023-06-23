const express = require("express");
const app = express();
const { main } = require("./gpt");
const { db } = require("./firebase");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Define routes and middleware here

// Start the server
const port = 3000;

const Characters = db.collection("characters");

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post("/api/gpt", async (req, res) => {
  try {
    // console.log(req.body);
    const response = await main(req.body.character, req.body.input);
    res.json(response);
  } catch (error) {
    return res.sendStatus(400);
  }
});

app.get("/api/character", async (req, res) => {
  try {
    console.log("zap");
    const snapshot = await Characters.get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api");
