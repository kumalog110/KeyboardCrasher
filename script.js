document.addEventListener("DOMContentLoaded", () => {


let selectedQuestions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let scores = [];
let startTime;
let gameStartTime;
let timerInterval;
let questionCount = 1; // デフォルトは1問

const startScreen = document.getElementById("start-screen");
const toggleSwitch = document.getElementById("toggle-switch");
const countdownScreen = document.getElementById("countdown-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
const countdownNumber = document.getElementById("countdown-number");
const timerElement = document.getElementById("timer");
const questionElement = document.getElementById("question");
const answerInput = document.getElementById("answer");
const progressTitle = document.getElementById("progress-title");
const resultContent = document.getElementById("result-content");

document.getElementById("start-button").addEventListener("click", showCountdown);
document.getElementById("submit-button").addEventListener("click", checkAnswer);
document.getElementById("restart-button").addEventListener("click", restartGame);

function showScreen(screen) {
  startScreen.classList.remove("active");
  countdownScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  screen.classList.add("active");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// トグルのクリックイベント
toggleSwitch.addEventListener("click", () => {
  toggleSwitch.classList.toggle("active");
  questionCount = toggleSwitch.classList.contains("active") ? 10 : 1;
});

function showCountdown() {
  showScreen(countdownScreen);
  let count = 3;
  countdownNumber.textContent = count;

  const countdownInterval = setInterval(() => {
    count--;
    countdownNumber.textContent = count;
    if (count <= 0) {
      clearInterval(countdownInterval);
      startGame();
    }
  }, 1000);
}

function startGame() {
  if (!questions || questions.length === 0) {
    alert("質問が設定されていません！questions 配列を確認してください。");
    restartGame();
    return;
  }

  shuffleArray(questions);
  selectedQuestions = questions.slice(0, questionCount);
  scores = [];
  currentQuestionIndex = 0;
  gameStartTime = new Date();
  showScreen(gameScreen);
  startTimer();
  loadQuestion();
}

function startTimer() {
  const startTime = new Date();
  timerInterval = setInterval(() => {
    const elapsedTime = ((new Date() - startTime) / 1000).toFixed(2);
    timerElement.textContent = elapsedTime;
  }, 10);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function loadQuestion() {
  if (currentQuestionIndex < selectedQuestions.length) {
    questionElement.textContent = selectedQuestions[currentQuestionIndex];
    progressTitle.textContent = `${currentQuestionIndex + 1}/${selectedQuestions.length}`;
    answerInput.value = "";
    answerInput.focus();
    startTime = new Date();
  } else {
    stopTimer();
    endGame();
  }
}

function checkAnswer(event) {
  event.preventDefault();

  const userAnswer = answerInput.value.trim();
  const questionText = selectedQuestions[currentQuestionIndex];
  const endTime = new Date();
  const elapsedTime = (endTime - startTime) / 1000;

  if (userAnswer === questionText) {
    correctCount++;
    const characterCount = questionText.length;
    const score = calculateScore(characterCount, elapsedTime);
    scores.push(score);
  } else {
    scores.push(0);
  }

  currentQuestionIndex++;
  loadQuestion();
}

function endGame() {
  const gameEndTime = new Date();
  const totalGameTime = ((gameEndTime - gameStartTime) / 1000).toFixed(2);

  const totalScore = scores.reduce((acc, score) => acc + score, 0);
  const averageScore = totalScore / selectedQuestions.length || 0;
  const { rank, id } = calculateRank(averageScore);

  showScreen(resultScreen);

  // 結果内容をクリア
  resultContent.innerHTML = "";

  // 画像要素の作成
  const rankImage = document.createElement("img");
  rankImage.id = "result-image";
  rankImage.className = "rank-image";
  const imageFileName = `score${id}.jpg`; // IDに基づいて画像ファイル名を決定
  rankImage.src = `images/${imageFileName}`;
  rankImage.alt = rank;
  resultContent.appendChild(rankImage);

  // ランク表示
  const rankElement = document.createElement("p");
  rankElement.className = "title";
  rankElement.textContent = rank;
  resultContent.appendChild(rankElement);

  // キャプション表示
  const captionElement = document.createElement("p");
  captionElement.className = "caption";
  captionElement.textContent = getRankCaption(rank);
  resultContent.appendChild(captionElement);

  // スコア表示
  const scoreElement = document.createElement("p");
  scoreElement.className = "score-display";
  scoreElement.textContent = `スコア: ${averageScore.toFixed(2)}点`;
  resultContent.appendChild(scoreElement);

  // タイム表示
  const timeElement = document.createElement("p");
  timeElement.className = "time-display";
  timeElement.textContent = `総タイム: ${totalGameTime}秒`;
  resultContent.appendChild(timeElement);
}



function calculateScore(characterCount, actualTime) {
  const averageTimePerChar = 0.5;
  const baseTime = characterCount * averageTimePerChar;
  const score = Math.min((baseTime / actualTime) * 100, 100);
  return Math.max(score, 0);
}

function calculateRank(averageScore) {
  if (averageScore >= 95) return { rank: "仕事を救いし英雄", id: 100 };
  if (averageScore >= 90) return { rank: "キーボード救世主", id: 90 };
  if (averageScore >= 80) return { rank: "全てを打ち破る者", id: 80 };
  if (averageScore >= 70) return { rank: "入力の狂気", id: 70 };
  if (averageScore >= 60) return { rank: "疲れ知らずの打撃者", id: 60 };
  if (averageScore >= 50) return { rank: "過労キーボード", id: 50 };
  if (averageScore >= 40) return { rank: "叩きのバイト", id: 40 };
  if (averageScore >= 30) return { rank: "キーボードの苦痛", id: 30 };
  if (averageScore >= 20) return { rank: "破壊の見習い", id: 20 };
  return { rank: "壊れた希望", id: 10 };
}

function getRankCaption(rank) {
  const captions = {
    "仕事を救いし英雄": "完璧な打鍵で仕事も未来も切り開く！",
    "キーボード救世主": "叩きの中にも希望が見える。",
    "全てを打ち破る者": "叩く力が仕事を生む！",
    "入力の狂気": "壊れそうなキーボードに慈悲はない！",
    "疲れ知らずの打撃者": "その手を止めるな！",
    "過労キーボード": "キーボードが泣いてる、手加減を！",
    "叩きのバイト": "叩き方を学びつつある！",
    "キーボードの苦痛": "壊すだけでは仕事は進まないぞ！",
    "破壊の見習い": "まだ道半ば、もっと叩け！",
    "壊れた希望": "ただ叩けばよい？それではダメだ！"
  };
  return captions[rank] || "";
}

function restartGame() {
  correctCount = 0;
  scores = [];
  showScreen(startScreen);
}


});