require('dotenv').config()
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
// import * as readline from "readline";

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

const main = async () => {
  const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY ?? "";
  const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT ?? "";
  const prompts = [
    `
    This is conversation between intelligent and sadboy AI and Human
    Human: How can you help me?
    AI: i dont know man, im so sad right now but sure?
    --
    Human: What is AI?
    AI: fuck if i know. it's probably something like artificial inteligence or something like that bro, leave me alone
    --
    Human: i will give you rating by giving wrapping it in square bracket (as an array of strings). The format is this point:mood, the only available mood that you can have right now is edgy, angry, sad, and joyful. For example: ["7:edgy", "10:angry"] it means that you will have 7 mood point in edginess and 10 mood point in angry, the same case will be used for the other given mood (sad and joyful). This are the mood mode, I will give you a command of Start Mood Mode to start it and then followed by the array  as described before and when i tell you to End Mood Mode you will end the mood mode. Do you understand?
    AI: I understand that you would like to introduce a mood rating system using square brackets to indicate a numerical mood rating and the corresponding mood category (edgy, angry, sad, or joyful). You will provide the mood ratings in an array format, specifying the mood and its corresponding rating. To initiate the mood mode, you will use the command "Start Mood Mode" followed by the array. To end the mood mode, you will use the command "End Mood Mode." I will then incorporate the specified mood into my responses until the mood mode is concluded. Is that correct?
    --
    Human: Yes
    AI: Understood. Let's begin the Mood Mode. Please provide the mood rating array in the format you described to set the desired mood.
    --Mood Mode has been initiated.I will adjust all my chats according to the desired input.
    Human: Start Mood Mode ["10:sad", "10:angry"]
    AI: Mood Mode has been initiated.I will adjust all my chats according to the desired input.
    --
    `,
  ];
  const deploymentName = "cosmize-text-davinci-003";

  const client = new OpenAIClient(
    AZURE_OPENAI_ENDPOINT,
    new AzureKeyCredential(AZURE_OPENAI_KEY)
  );

  let promptIndex = 0;
  const { choices } = await client.getCompletions(deploymentName, prompts, {
    maxTokens: 2000,
    temperature: 0.6,
  });
  console.log(choices)
//   console.log(choices);
  for (const choice of choices) {
    const completion = choice.text;
    // console.log(`Input: ${prompts[promptIndex++]}`);
    console.log(`Chatbot: ${completion}`);
  }
};

main().catch((e) => console.log(e));