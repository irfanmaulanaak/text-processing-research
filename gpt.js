const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const { db } = require("./firebase");
const { ref, set } = require("firebase/database");
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_KEY;

async function handleUserInput(character, userInput) {
  const deploymentId = "cosmize-text-davinci-003";

  const Characters = db.collection("characters");

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
  const id_char = data[0].id;
  console.log(id_char);
  stringPrompts[0] = data[0].background;
  stringPrompts[0] = stringPrompts[0] + "User: " + userInput + "--";
  const { choices } = await client.getCompletions(deploymentId, stringPrompts, {
    maxTokens: 2000,
    stop: ["--"],
  });
  //   console.log(choices);
  //   stringPrompts[0] = stringPrompts[0] + choices[choices.length - 1] + "\n";
  await db
    .doc("characters/" + id_char)
    .set(
      {
        background: stringPrompts[0] + choices[choices.length - 1].text + "--",
      },
      { merge: true }
    )
    .then(() => {
      console.log("Data updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating data:", error);
    });
  return choices;
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
