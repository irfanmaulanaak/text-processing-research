const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const Sentiment = require("sentiment");

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
  console.log("Sentiment Comparative:", comparative);
  console.log("Sentiment Words:", words);
  console.log("Tokens:", tokens);
  console.log("Positive words:", positive);
  console.log("Negative words:", negative);
}

module.exports = { sentimentAnalysis };
