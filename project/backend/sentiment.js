import natural from 'natural';

// Initialize classifiers
const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();

// Train the classifier with some examples
// In a real-world application, you would train this with a much larger dataset
function initializeClassifier() {
  // Positive examples
  [
    "Great service, thank you!",
    "The staff was very helpful and friendly.",
    "I'm extremely satisfied with how quickly my issue was resolved.",
    "The new online system is much better than the old one.",
    "I appreciate the prompt response to my inquiry.",
    "The process was straightforward and easy to complete."
  ].forEach(text => classifier.addDocument(tokenizer.tokenize(text), 'positive'));

  // Negative examples
  [
    "The wait time was unacceptable.",
    "Your staff was rude and unhelpful.",
    "I'm disappointed with the quality of service.",
    "The process is too complicated and confusing.",
    "Nobody responded to my emails for a week.",
    "This is the worst government service I've ever experienced."
  ].forEach(text => classifier.addDocument(tokenizer.tokenize(text), 'negative'));

  // Neutral examples
  [
    "I need information about renewing my license.",
    "What are your office hours?",
    "I received the document in the mail yesterday.",
    "The process took about as long as I expected.",
    "I submitted my application last week.",
    "Is there a form I need to fill out?"
  ].forEach(text => classifier.addDocument(tokenizer.tokenize(text), 'neutral'));

  // Urgent examples
  [
    "There's a dangerous pothole on Main Street that needs immediate attention.",
    "The water in our neighborhood has been brown for days, it's a health hazard!",
    "A fallen tree is blocking the entire road on Elm Street.",
    "The traffic light at 5th and Oak is malfunctioning, causing near accidents.",
    "There is a gas leak in our building! Please send someone immediately!",
    "The elevator in city hall is stuck with people inside!"
  ].forEach(text => classifier.addDocument(tokenizer.tokenize(text), 'urgent'));

  // Train the classifier
  classifier.train();
}

// Initialize the classifier
initializeClassifier();

// Function to analyze text
export async function analyzeText(text) {
  // Tokenize the input text
  const tokens = tokenizer.tokenize(text);
  
  // Use the Naive Bayes classifier to determine sentiment
  const classification = classifier.getClassifications(tokens);
  
  // Find the highest scoring classification
  const bestMatch = classification.reduce((prev, current) => {
    return (prev.value > current.value) ? prev : current;
  });
  
  // Check for urgent keywords regardless of classification
  const urgentKeywords = ['urgent', 'emergency', 'dangerous', 'hazard', 'immediately', 'critical'];
  const hasUrgentKeyword = tokens.some(token => urgentKeywords.includes(token.toLowerCase()));
  
  // If urgent keywords are found and it's negative sentiment, override to urgent
  const sentiment = (hasUrgentKeyword && bestMatch.label === 'negative') ? 'urgent' : bestMatch.label;
  
  // Calculate sentiment score (0-1 for positive, -1-0 for negative)
  let score;
  if (sentiment === 'positive') {
    score = 0.5 + (bestMatch.value / 2); // 0.5 to 1.0
  } else if (sentiment === 'negative' || sentiment === 'urgent') {
    score = -0.5 - (bestMatch.value / 2); // -0.5 to -1.0
  } else {
    // Neutral
    score = (bestMatch.value * 0.5) * (classification.find(c => c.label === 'positive')?.value > 
                                       classification.find(c => c.label === 'negative')?.value ? 1 : -1);
  }
  
  return {
    sentiment,
    score,
    classification
  };
}