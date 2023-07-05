const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const { db } = require("./firebase");
const { ref, set } = require("firebase/database");
const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const Sentiment = require("sentiment");
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_KEY;
let moods;
let id_char;
let init_moods;
async function sentimentAnalysis(input) {
  // Text to analyze

  // Tokenize the text into individual words
  const tokens = await tokenizer.tokenize(input);

  // Perform sentiment analysis
  const sentimentAnalyzer = new Sentiment();
  const sentiment = await sentimentAnalyzer.analyze(input);

  // Determine the sentiment and get positive and negative words
  const { score, comparative, words, positive, negative } = sentiment;

  console.log("Sentiment Score:", score);
  // console.log("Sentiment Comparative:", comparative);
  // console.log("Sentiment Words:", words);
  // console.log("Tokens:", tokens);
  console.log("Positive words:", positive);
  console.log("Negative words:", negative);
  if (score < 0) {
    return negative;
  } else {
    return positive;
  }
}

async function handleUserInput(character, userInput) {
  try {
    const deploymentId = "cosmize-text-davinci-003";

    const Characters = db.collection("characters");
    init_moods = (await sentimentAnalysis(userInput)).join();

    let stringPrompts = [];

    let snapshot;

    if (stringPrompts.length == 0) {
      console.log("getting data...");
      snapshot = await Characters.where("name", "==", character).get();
      if (snapshot.empty) {
        console.log("No matching character found");
        return;
      }
    }
    const client = new OpenAIClient(
      endpoint,
      new AzureKeyCredential(azureApiKey)
    );
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    id_char = data[0].id;
    console.log(id_char);
    if (data[0].mood == "") {
      if (init_moods === "") {
        init_moods = "neutral";
        stringPrompts[0] = data[0].background + "And now you feel" + init_moods;
      } else {
        stringPrompts[0] = data[0].background + "And now you feel" + init_moods;
      }
    } else {
      if (init_moods === "") {
        init_moods = data[0].mood;
        stringPrompts[0] = data[0].background + "And now you feel" + init_moods;
      } else {
        stringPrompts[0] = data[0].background + "And now you feel" + init_moods;
      }
    }

    stringPrompts[0] = stringPrompts[0] + "User: " + userInput + "--";
    const { choices } = await client.getCompletions(
      deploymentId,
      stringPrompts,
      {
        maxTokens: 2000,
        stop: ["--"],
      }
    );
    await db.doc("characters/" + id_char).set(
      {
        background: stringPrompts[0] + choices[choices.length - 1].text + "--",
        mood: init_moods,
      },
      { merge: true }
    );
    console.log("Data updatted successfully..");
    return choices;
  } catch (error) {
    console.log("Error:", error);
  }
}

async function main(character, userInput) {
  //   console.log("== Chat Completions Sample ==");
  //   getUserInput();
  //   console.log(character, userInput);
  return await handleUserInput(character, userInput);
}

// main().catch((err) => {

//     console.error("The sample encountered an error:", err);
// });

module.exports = { main };
