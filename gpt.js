const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
require('dotenv').config()
const readline = require('readline');
const fs = require('fs');
const endpoint = process.env.AZURE_OPENAI_ENDPOINT ;
const azureApiKey = process.env.AZURE_OPENAI_KEY;

let client;

async function handleUserInput(userInput){
    const filepath = './data.jsonl'
    const contents = fs.readFileSync(filepath, 'utf-8');
    const lines = contents.trim().split('\n');
    const conversation = []
    for (const line of lines) {
        const convo = JSON.parse(line);
        conversation.push(convo)
    }
    conversation.push({role: 'user', content: userInput});
    // fs.appendFile(filepath, `\n${JSON.stringify({ role: "user", content: userInput})}`, (err) => {
    //     if (err) {
    //       console.error('Error appending to file:', err);
    //       return;
    //     }
    //   });
    const deploymentId = "turbo";
    const result = await client.getChatCompletions(deploymentId, conversation);
    // console.log(result.usage.totalTokens)
    console.log("result handleuserinput ",result.choices[0].message.content)
    return result
}

async function main(userInput) {
//   console.log("== Chat Completions Sample ==");
//   getUserInput();
    client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    return (await handleUserInput(userInput))
}

// main().catch((err) => {
    
//     console.error("The sample encountered an error:", err);
// });

module.exports = { main };