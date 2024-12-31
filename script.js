document.addEventListener("DOMContentLoaded", () => {
  let selectedQuestions = [];
  let currentQuestionIndex = 0;
  let correctCount = 0;
  let scores = [];
  let startTime;
  let gameStartTime;
  let timerInterval;
  let questionCount = 1; // デフォルトは1問
  let deleteCount = 0; // 現在の問題でのDeleteキー回数
  const deleteLimit = 9; // 1問ごとのDeleteキー回数の制限

  const startScreen = document.getElementById("start-screen");
  const toggleSwitch = document.getElementById("toggle-switch");
  const countdownScreen = document.getElementById("countdown-screen");
  const gameScreen = document.getElementById("game-screen");
  const resultScreen = document.getElementById("result-screen");
  const gameOverScreen = document.getElementById("game-over-screen");
  const countdownNumber = document.getElementById("countdown-number");
  const timerElement = document.getElementById("timer");
  const questionElement = document.getElementById("question");
  const answerInput = document.getElementById("answer");
  const progressTitle = document.getElementById("progress-title");
  const resultContent = document.getElementById("result-content");
  const retryButton = document.getElementById("retry-button");

  document.getElementById("start-button").addEventListener("click", showCountdown);
  document.getElementById("submit-button").addEventListener("click", checkAnswer);
  retryButton.addEventListener("click", restartGame);

      // トグルスイッチのイベントリスナーを設定
      toggleSwitch.addEventListener("click", () => {
        toggleSwitch.classList.toggle("active");
        questionCount = toggleSwitch.classList.contains("active") ? 10 : 1; // アクティブなら10問、非アクティブなら1問
    });

  function showScreen(screen) {
      startScreen.classList.remove("active");
      countdownScreen.classList.remove("active");
      gameScreen.classList.remove("active");
      resultScreen.classList.remove("active");
      gameOverScreen.classList.remove("active");
      screen.classList.add("active");
  }

  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }

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
        deleteCount = 0; // 次の問題に進む際にDeleteキー回数をリセット
    } else {
        stopTimer();
        endGame();
    }
}

  function calculateScore(characterCount, actualTime) {
    const averageTimePerChar = 0.5; // 1文字に期待される平均時間 (秒)
    const baseTime = characterCount * averageTimePerChar; // 基準時間
    const score = Math.min((baseTime / actualTime) * 100, 100); // 最大100点
    return Math.max(score, 0); // 最小0点
}

function checkAnswer(event) {
  event.preventDefault();

  const userAnswer = answerInput.value.trim();
  const questionText = selectedQuestions[currentQuestionIndex];
  const endTime = new Date();
  const elapsedTime = (endTime - startTime) / 1000; // 経過時間 (秒)

  if (userAnswer === questionText) {
      correctCount++;
      const characterCount = questionText.length;
      const score = calculateScore(characterCount, elapsedTime); // スコア計算
      scores.push(score);
      currentQuestionIndex++;
      loadQuestion();
  } else {
      scores.push(0); // 不正解時はスコア0
  }
}

function endGame() {
  const gameEndTime = new Date();
  const totalGameTime = ((gameEndTime - gameStartTime) / 1000).toFixed(2);

  const totalScore = scores.reduce((acc, score) => acc + score, 0);
  const averageScore = totalScore / selectedQuestions.length || 0;
  const { rank, caption, id } = calculateRank(averageScore); // ランク、キャプション、IDを取得

  showScreen(resultScreen);

  // 結果コンテンツをクリア
  const resultContent = document.getElementById("result-content");
  resultContent.innerHTML = "";

  // ランク画像を生成
  const rankImage = document.createElement("img");
  rankImage.id = "result-image";
  rankImage.className = "rank-image";
  rankImage.src = `images/score${id}.jpg`; // IDに基づいて画像ファイル名を生成
  rankImage.alt = rank;
  resultContent.appendChild(rankImage);

  // ランクタイトルを生成
  const rankTitle = document.createElement("p");
  rankTitle.className = "title";
  rankTitle.textContent = `${rank}`;
  resultContent.appendChild(rankTitle);

  // キャプションを生成
  const rankCaption = document.createElement("p");
  rankCaption.className = "caption";
  rankCaption.textContent = caption;
  resultContent.appendChild(rankCaption);

  // スコア表示を生成
  const scoreDisplay = document.createElement("p");
  scoreDisplay.className = "score-display";
  scoreDisplay.textContent = `スコア: ${averageScore.toFixed(2)}点`;
  resultContent.appendChild(scoreDisplay);

  // タイム表示を生成
  const timeDisplay = document.createElement("p");
  timeDisplay.className = "time-display";
  timeDisplay.textContent = `総タイム: ${totalGameTime}秒`;
  resultContent.appendChild(timeDisplay);

  // シェアボタン設定
  setupResultShare(rank, averageScore.toFixed(2));
}


  function showGameOver() {
    stopTimer();
    showScreen(gameOverScreen);

    const gameOverURL = generateGameOverShareText();
    document.getElementById("share-gameover-button").setAttribute("href", gameOverURL);
}

  // Deleteキーでの入力回数をカウント
  answerInput.addEventListener("input", (event) => {
      const key = event.data;

      if (key === null && event.inputType === "deleteContentBackward") {
          deleteCount++;
          if (deleteCount > deleteLimit) {
              showGameOver();
              return;
          }
      }
  });

  function restartGame() {
      correctCount = 0;
      scores = [];
      showScreen(startScreen);
  }



  // 入力時に揺らすイベント
  answerInput.addEventListener("input", (event) => {
    const key = event.data; // 入力された文字（Deleteキーの場合はnull）

    if (key === null && event.inputType === "deleteContentBackward") {
        // Deleteキーが押された場合
        applyRandomShake(gameScreen, 30, 300); // 15pxの振幅、800msの持続時間
    } else {
        // その他のキーが押された場合
        gameScreen.classList.add("shake");
        setTimeout(() => {
            gameScreen.classList.remove("shake");
        }, 300); // アニメーションの持続時間に合わせる
    }
  });

  function applyRandomShake(element, intensity, duration) {
    const keyframes = [];
    const steps = 10; // アニメーションのステップ数

    for (let i = 0; i < steps; i++) {
        const randomX = Math.random() * intensity * (Math.random() < 0.5 ? -1 : 1);
        const randomY = Math.random() * intensity * (Math.random() < 0.5 ? -1 : 1);
        keyframes.push(`${(i / (steps - 1)) * 100}% { transform: translate(${randomX}px, ${randomY}px); }`);
    }

    const animationName = `randomShake-${Date.now()}`;
    const keyframeRule = `@keyframes ${animationName} { ${keyframes.join(" ")} }`;

    // 動的にスタイル要素を作成
    const styleElement = document.createElement("style");
    styleElement.textContent = keyframeRule;
    document.head.appendChild(styleElement);

    // 要素にアニメーションを適用
    element.style.animation = `${animationName} ${duration}ms cubic-bezier(0.4, 0.1, 0.6, 1)`;

    // アニメーション終了後にリセット
    setTimeout(() => {
        element.style.animation = "";
        styleElement.remove(); // 使用済みのスタイルを削除
    }, duration);
  }






answerInput.addEventListener("input", (event) => {
  const key = event.data;

  if (key === null && event.inputType === "deleteContentBackward") {
      // Deleteキーが押された場合
      const cursorPosition = getCursorPosition(answerInput);
      generateExplosion(cursorPosition.x, cursorPosition.y, 20); // 20個のドットを生成
  } else {
      gameScreen.classList.add("shake");
      setTimeout(() => {
          gameScreen.classList.remove("shake");
      }, 500);
  }
});

/**
* 入力エリア内のカーソルの絶対座標を取得
* @param {HTMLInputElement} input - 対象の入力エリア
* @returns {Object} カーソル位置 { x, y }
*/
function getCursorPosition(input) {
  const rect = input.getBoundingClientRect(); // 入力エリアの位置
  const computedStyle = window.getComputedStyle(input);
  const paddingLeft = parseInt(computedStyle.paddingLeft, 10);
  const paddingTop = parseInt(computedStyle.paddingTop, 10);

  const textBeforeCursor = input.value.substring(0, input.selectionStart); // カーソル前のテキスト
  const dummySpan = document.createElement("span");
  dummySpan.textContent = textBeforeCursor.replace(/\s/g, '\u00a0'); // 空白を可視化するために&nbsp;に変換
  dummySpan.style.position = "absolute";
  dummySpan.style.whiteSpace = "pre";
  dummySpan.style.font = computedStyle.font;
  dummySpan.style.visibility = "hidden";

  document.body.appendChild(dummySpan);

  const spanRect = dummySpan.getBoundingClientRect();
  const cursorX = rect.left + paddingLeft + spanRect.width;
  const cursorY = rect.top + paddingTop;

  dummySpan.remove();

  return { x: cursorX, y: cursorY };
}

/**
* 砕け散るドットを生成
* @param {number} x - 基準X座標
* @param {number} y - 基準Y座標
* @param {number} count - ドットの数
*/
function generateExplosion(x, y, count) {
  const container = document.body; // ドットを表示する親要素

  for (let i = 0; i < count; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";

      // ランダムな方向に散らす
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 100; // 最大100pxの距離
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      // CSSカスタムプロパティで方向を設定
      dot.style.setProperty("--dx", `${dx}px`);
      dot.style.setProperty("--dy", `${dy}px`);

      // ドットの初期位置
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;

      container.appendChild(dot);

      // アニメーション終了後にドットを削除
      dot.addEventListener("animationend", () => {
          dot.remove();
      });
  }
}

function generateResultShareText(rank, score) {
  const caption = rankCaptions[rank] || "キーボードを叩き、未知の可能性を追い求めた！"; // デフォルトメッセージを設定

  const baseURL = "https://twitter.com/intent/tweet";
  const text = `🎉【称号: ${rank}】🎉\nスコア: ${score}点🔥\n${caption} あなたも挑戦してこの称号を超えてみませんか？\n👇\n#キーボードクラッシャー #タイピングゲーム #ChatGPTで作成\nhttps://kumalog110.github.io/KeyboardCrasher/`;
  return `${baseURL}?text=${encodeURIComponent(text)}`;
}

function generateGameOverShareText() {
  const baseURL = "https://twitter.com/intent/tweet";
  const text = `💥【称号: 壊れた希望】💥\nキーボードの神が見放した…しかし再挑戦の道は残されている！\n👇\n#キーボードクラッシャー #タイピングゲーム #ChatGPTで作成\nhttps://kumalog110.github.io/KeyboardCrasher/`;
  return `${baseURL}?text=${encodeURIComponent(text)}`;
}

function setupResultShare(rank, score) {
  const resultURL = generateResultShareText(rank, score);
  const shareButton = document.getElementById("share-result-button");
  shareButton.setAttribute("href", resultURL);
  shareButton.setAttribute("target", "_blank"); // 新しいタブで開く
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

const rankCaptions = {
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

});