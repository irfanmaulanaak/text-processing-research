const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
require('dotenv').config()
const readline = require('readline');
const fs = require('fs');
const endpoint = process.env.AZURE_OPENAI_ENDPOINT ;
const azureApiKey = process.env.AZURE_OPENAI_KEY;

let client;
let conversation = []

async function handleUserInput(userInput){
    conversation.push({role: 'user', content: userInput});
    const deploymentId = "turbo";
    const result = await client.getChatCompletions(deploymentId, conversation);
    console.log(result.choices[0].message.content)
    // console.log(conversation)
    getUserInput();
    // console.log("result handleuserinput ",result.choices[0].message.content)
    // return result
}

function getUserInput() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    rl.question('User: ', (userInput) => {
      rl.close();
      handleUserInput(userInput);
    });
  }

async function main(userInput) {
    client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const filepath = './data.jsonl'
    const contents = fs.readFileSync(filepath, 'utf-8');
    const lines = contents.trim().split('\n');
    for (const line of lines) {
        console.log(line)
        const convo = JSON.parse(line);
        conversation.push(convo)
    }
    console.log("== Chat Completions Sample ==");
    getUserInput();
    // return (await handleUserInput(userInput))
}

main().catch((err) => {
    
    console.error("The sample encountered an error:", err);
});

module.exports = { main };