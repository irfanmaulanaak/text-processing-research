const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
require("dotenv").config();
const readline = require("readline");
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_KEY;
const { data } = require("./data");

let client;
let conversation = [];

async function handleUserInput(userInput) {
  try {
    conversation.push({ role: "user", content: userInput });
    console.log(conversation);
    const deploymentName = "turbo";
    const result = await client.getChatCompletions(
      deploymentName,
      conversation
    );
    console.log(result.choices[0].message.content);
    conversation.push({
      role: "assistant",
      content: result.choices[0].message.content ?? "",
    });
    getUserInput();
  } catch (error) {
    console.error(error);
  }
}

function getUserInput() {
  try {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("User: ", (userInput) => {
      rl.close();
      handleUserInput(userInput);
    });
  } catch (error) {
    console.error(error);
  }
}

async function main(userInput) {
  try {
    client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    for (const item of data) {
      conversation.push(item);
    }
    console.log("== Chat Completions Sample ==");
    getUserInput();
  } catch (error) {
    console.error(error);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };