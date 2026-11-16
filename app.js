const files = "abcdefgh";
const pieces = {
  K: ["♚", "王"], Q: ["♛", "后"], R: ["♜", "車"],
  B: ["♝", "象"], N: ["♞", "馬"], P: ["♟", "兵"],
};

function lessonUrl(lesson) {
  return `./lesson.html?id=${encodeURIComponent(lesson.id)}`;
}

function renderBoard(container, lesson, highlights = []) {
  const board = document.createElement("div");
  board.className = "board";
  const occupied = Object.entries(lesson.position).map(([square, code]) => {
    const side = code[0] === "w" ? "白" : "黑";
    return `${square} ${side}${pieces[code[1]][1]}`;
  });
  const label = [occupied.join("、"), highlights.length && `標記格：${highlights.join("、")}`]
    .filter(Boolean).join("。");
  board.setAttribute("role", "img");
  board.setAttribute("aria-label", label);

  for (let rank = 8; rank >= 1; rank--) {
    [...files].forEach((file, column) => {
      const square = `${file}${rank}`;
      const piece = lesson.position[square];
      const cell = document.createElement("span");
      cell.className = (rank + column) % 2 === 0 ? "square light" : "square dark";
      cell.setAttribute("aria-hidden", "true");
      if (piece) {
        cell.classList.add(piece[0] === "w" ? "white-piece" : "black-piece");
        cell.textContent = pieces[piece[1]][0];
      }
      if (highlights.includes(square)) cell.classList.add("marked");
      if (column === 0) cell.dataset.rank = rank;
      if (rank === 1) cell.dataset.file = file;
      board.append(cell);
    });
  }
  container.replaceChildren(board);
}

function showHome() {
  const list = document.querySelector("#lesson-list");
  if (!list) return;

  const featured = lessons.find(lesson => lesson.id === "knight-fork") ?? lessons[0];
  if (featured) {
    renderBoard(document.querySelector("#hero-board"), featured);
    document.querySelector(".hero-figure figcaption").textContent = `課程示例 · ${featured.title}局面`;
  }
  document.querySelector("#lesson-count").textContent = `共 ${lessons.length} 課`;

  lessons.forEach(lesson => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = lessonUrl(lesson);
    card.innerHTML = `
      <span class="card-meta"></span>
      <h3></h3>
      <span class="english"></span>
      <p></p>
      <span class="card-action">進入課程 <span aria-hidden="true">↗</span></span>`;
    card.querySelector(".card-meta").textContent = `${lesson.level} · ${lesson.minutes} 分鐘`;
    card.querySelector("h3").textContent = lesson.title;
    card.querySelector(".english").textContent = lesson.english;
    card.querySelector("p").textContent = lesson.summary;
    list.append(card);
  });
}

function showLesson() {
  const page = document.querySelector("#lesson-page");
  if (!page) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const index = lessons.findIndex(lesson => lesson.id === id);
  if (index === -1) {
    page.innerHTML = '<h1>找不到這堂課</h1><p>請從課程列表選擇一堂課。</p><a class="primary" href="./index.html#lessons">返回課程列表</a>';
    return;
  }

  const lesson = lessons[index];
  document.title = `${lesson.title}｜棋盤筆記`;
  page.innerHTML = `
    <a class="back-link" href="./index.html#lessons">← 返回課程列表</a>
    <header class="lesson-header">
      <p class="eyebrow" id="lesson-meta"></p>
      <h1 id="lesson-title"></h1>
      <p class="english" id="lesson-english"></p>
      <p id="lesson-summary"></p>
    </header>
    <section class="concept" aria-labelledby="concept-title">
      <h2 id="concept-title">戰術概念</h2>
      <p id="lesson-concept"></p>
      <p id="lesson-tip"></p>
    </section>
    <section class="practice" aria-labelledby="practice-title">
      <figure class="practice-board">
        <div id="exercise-board"></div>
        <figcaption id="turn"></figcaption>
      </figure>
      <div class="practice-copy">
        <h2 id="practice-title">試一試</h2>
        <p id="question"></p>
        <div id="choices" class="choices" role="group" aria-labelledby="question"></div>
        <div id="feedback" class="feedback" role="status"></div>
        <button type="button" class="reset" id="reset" hidden>重新作答</button>
      </div>
    </section>
    <nav class="lesson-nav" aria-label="相鄰課程"></nav>`;

  document.querySelector("#lesson-meta").textContent = `${lesson.level} · ${lesson.minutes} 分鐘`;
  document.querySelector("#lesson-title").textContent = lesson.title;
  document.querySelector("#lesson-english").textContent = lesson.english;
  document.querySelector("#lesson-summary").textContent = lesson.summary;
  document.querySelector("#lesson-concept").textContent = lesson.concept;
  document.querySelector("#lesson-tip").textContent = `觀察提示｜${lesson.tip}`;
  document.querySelector("#turn").textContent = lesson.turn === "w" ? "白方行棋" : "黑方行棋";
  document.querySelector("#question").textContent = lesson.question;

  const board = document.querySelector("#exercise-board");
  const choices = document.querySelector("#choices");
  const feedback = document.querySelector("#feedback");
  const reset = document.querySelector("#reset");
  renderBoard(board, lesson);

  lesson.choices.forEach((choice, answerIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      choices.querySelector('[aria-pressed="true"]')?.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-pressed", "true");
      const correct = answerIndex === lesson.answer;
      feedback.textContent = `${correct ? "答對了！" : "這個選項不對。"}${lesson.explanation}`;
      renderBoard(board, lesson, lesson.highlight);
      reset.hidden = false;
    });
    choices.append(button);
  });

  reset.addEventListener("click", () => {
    choices.querySelector('[aria-pressed="true"]')?.setAttribute("aria-pressed", "false");
    feedback.textContent = "";
    renderBoard(board, lesson);
    reset.hidden = true;
    choices.firstElementChild.focus();
  });

  const nav = document.querySelector(".lesson-nav");
  [[lessons[index - 1], "← 上一課"], [lessons[index + 1], "下一課 →"]].forEach(([neighbor, label]) => {
    if (!neighbor) return;
    const link = document.createElement("a");
    link.href = lessonUrl(neighbor);
    link.textContent = `${label} · ${neighbor.title}`;
    nav.append(link);
  });
}

showHome();
showLesson();
