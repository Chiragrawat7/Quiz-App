// API URL for fetching quiz questions
const apiKey = "https://quizapi.io/api/v1/questions?apiKey=l8PgxicvYHsQ4ZFzefsKlet4jlNbcmpIUO88VAxA&limit=10";

// Helper function to get elements by ID
const getElementById = (id) => document.getElementById(id);

// DOM Elements
const startButton = getElementById("start-btn");
const nextButton = getElementById("next-btn");
const restartButton = getElementById("restart-btn");
const progressBar = getElementById("progress");

// Variables 
let apiData;
let quizIndex = 0;
let score = 0;

// Event listeners
startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => renderQuestion(apiData));
restartButton.addEventListener("click", restartQuiz);

// Function to restart the quiz
function restartQuiz() {
  const resultScreen = getElementById("result-screen");
  resultScreen.classList.add("hidden");
  startGame();
}

// Function to fetch quiz data from API
async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    apiData = data;

    // Show quiz screen after data is fetched
    const quizScreen = getElementById("quiz-screen");
    quizScreen.classList.remove("hidden");

    // Render the first question
    renderQuestion(data);
  } catch (error) {
    console.log("Error occurred while fetching the data: " + error);
  }
}

// Function to update score on the UI
function updateScore() {
  const scoreDisplay = getElementById("score");
  scoreDisplay.innerText = score;
}

// Function to render the current question and options
function renderQuestion(data) {
  // Check if all questions have been answered
  if (quizIndex >= data.length) {
    const resultScreen = getElementById("result-screen");
    const quizScreen = getElementById("quiz-screen");
    const finalScore = getElementById('final-score');

    resultScreen.classList.remove("hidden");
    quizScreen.classList.add("hidden");

    // Display final score
    finalScore.innerText = score;
    return;
  }

  // Get the current question and options
  const currentQuestion = data[quizIndex++];
  const questionText = getElementById("question");
  const optionsContainer = getElementById("options");

  // Clear previous options
  optionsContainer.innerText = "";
  questionText.innerText = currentQuestion?.question;

  // Loop through the answers and create option elements
  Object.entries(currentQuestion?.answers).forEach(([key, value]) => {
    if (value) {
      const optionElement = document.createElement("div");
      optionElement.innerText = value;
      optionElement.classList.add("option");
      optionElement.dataset.answerKey = currentQuestion?.correct_answers?.[key + "_correct"];

      // Add click event to check answer
      optionElement.addEventListener("click", checkAnswer);
      optionsContainer.appendChild(optionElement);
    }
  });

  updateProgressBar();  // Update progress bar
}

// Function to check if the selected answer is correct or incorrect
function checkAnswer(event) {
  const selectedOption = event.target;

  // Update score based on the answer
  if (selectedOption.dataset.answerKey === "true") {
    score += 4;  // Correct answer, add points
  } else if (score > 0) {
    score -= 1;  // Incorrect answer, subtract points
  }

  // Disable further clicks and highlight the selected options
  const options = document.querySelectorAll(".option");
  options.forEach((option) => {
    option.style.pointerEvents = "none";  // Disable further clicks

    if (option.dataset.answerKey === "true") {
      option.classList.add("correct");  // Highlight correct answer
    } else if (selectedOption === option) {
      option.classList.add("incorrect");  // Highlight selected incorrect answer
    }
  });

  updateScore();  // Update score on UI
  nextButton.classList.remove("hidden");  // Show next button
}

// Function to start the game
function startGame() {
  const startScreen = getElementById("start-screen");
  startScreen.classList.add("hidden");  // Hide start screen

  score = 0;  // Reset score
  quizIndex = 0;  // Reset question index
  updateScore();  // Update score on UI
  progressBar.style.width = '0';  // Reset progress bar

  fetchData(apiKey);  // Fetch quiz data
}

// Function to update the progress bar as the quiz progresses
function updateProgressBar() {
  const progress = ((quizIndex) / apiData.length) * 100;  // Calculate the percentage
  progressBar.style.width = `${progress}%`;  // Set progress bar width
}
