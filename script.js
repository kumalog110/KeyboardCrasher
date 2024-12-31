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
          currentQuestionIndex++;
          loadQuestion();
      } else {
          scores.push(0);
      }
  }

  function endGame() {
      const gameEndTime = new Date();
      const totalGameTime = ((gameEndTime - gameStartTime) / 1000).toFixed(2);

      const totalScore = scores.reduce((acc, score) => acc + score, 0);
      const averageScore = totalScore / selectedQuestions.length || 0;

      showScreen(resultScreen);

      resultContent.innerHTML = `
          <p>スコア: ${averageScore.toFixed(2)}点</p>
          <p>総タイム: ${totalGameTime}秒</p>
      `;
  }

  function showGameOver() {
      stopTimer();
      showScreen(gameOverScreen);
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


});