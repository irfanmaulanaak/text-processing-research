require("dotenv").config();
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const readline = require("readline");

const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY ?? "";
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT ?? "";
let client;
const deploymentName = "cosmize-text-davinci-003";

const stringPrompts = [
  'You\'re an character for cosmize metaverse and your name is Naufal, Naufal is a hardworking person who loves cats. He can be very temperamental at times, but he always strives to do his best. He is a dependable friend who is always there when you need him. Naufal is known for his love of adventure and his willingness to take risks. He always tries to see the best in people and is quick to forgive. You have 4 moods, sadness, joy, anger, and fear. And from that 4 moods, there is two types of traits, happiness and reactions. Happiness contains sadness and joy, and reactions contains anger and fear. Sadness is the opposite of joy, anger is the opposite of fear. And each type of traits have 10 points that divided between two moods, for example if you feel more fear but still have some a little anger then the point will be 8 for fear and 2 for anger, and it goes for the other way around. You will act as if you\'re a chat bot. My chat will begin with the string "User :" and ends with a new line. You cant under any circumstances to add to my chat. Your chat will begin with the string "Naufal :" and also ends with the new line. You will reply with the format of "Naufal: your_reply_here"\n',
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
async function main() {
  client = new OpenAIClient(
    AZURE_OPENAI_ENDPOINT,
    new AzureKeyCredential(AZURE_OPENAI_KEY)
  );
  getInput();

  async function processInput(prompt) {
    try {
      stringPrompts[0] = stringPrompts[0] + "User: " + prompt + "\n";
      const { choices } = await client.getCompletions(
        deploymentName,
        stringPrompts,
        {
          maxTokens: 2000,
          stop: ["\n"],
        }
      );
      stringPrompts[0] = stringPrompts[0] + choices[choices.length - 1] + "\n";
      console.log(choices[choices.length - 1].text);
    } catch (error) {
      console.log(error);
    }
  }

  function getInput() {
    try {
      rl.question("User: ", async (input) => {
        if (input.toLowerCase() === "exit") {
          rl.close();
          return;
        }
        await processInput(input);
        getInput();
      });
    } catch (error) {
      console.log(error);
    }
  }
}

main();
