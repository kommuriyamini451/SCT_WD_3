// Multiple question sets - add as many as you want
const allQuizSets = [
  [
    {
      type: "single",
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: "Mars"
    },
    {
      type: "multi",
      question: "Select all prime numbers:",
      options: ["2", "4", "7", "9", "11"],
      answer: ["2", "7", "11"]
    },
    {
      type: "fill",
      question: "The chemical symbol for water is ___",
      answer: "H2O"
    },
    {
      type: "single",
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
      answer: "Leonardo da Vinci"
    },
    {
      type: "multi",
      question: "Which of these are programming languages?",
      options: ["Python", "HTML", "Java", "CSS"],
      answer: ["Python", "Java"]
    }
  ],
  [
    {
      type: "single",
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Pacific", "Arctic"],
      answer: "Pacific"
    },
    {
      type: "multi",
      question: "Select all mammals:",
      options: ["Dolphin", "Shark", "Bat", "Penguin"],
      answer: ["Dolphin", "Bat"]
    },
    {
      type: "fill",
      question: "The capital of Japan is ___",
      answer: "Tokyo"
    },
    {
      type: "single",
      question: "How many sides does a hexagon have?",
      options: ["5", "6", "7", "8"],
      answer: "6"
    },
    {
      type: "multi",
      question: "Which are web technologies?",
      options: ["React", "Docker", "Vue", "MySQL"],
      answer: ["React", "Vue"]
    }
  ]
];

let currentSet = 0;
let quizData = allQuizSets[currentSet];
let currentQ = 0;
let userAnswers = new Array(quizData.length).fill(null);
let score = 0;

const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');
const qCount = document.getElementById('qCount');
const progressFill = document.getElementById('progressFill');
const scoreEl = document.getElementById('score');
const qType = document.getElementById('qType');
const qText = document.getElementById('qText');
const optionsBox = document.getElementById('optionsBox');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const finalScore = document.getElementById('finalScore');
const resultMsg = document.getElementById('resultMsg');
const reviewBox = document.getElementById('reviewBox');
const restartBtn = document.getElementById('restartBtn');

function loadQuestion() {
  const q = quizData[currentQ];

  qCount.textContent = `Question ${currentQ + 1}/${quizData.length}`;
  progressFill.style.width = `${((currentQ) / quizData.length) * 100}%`;
  qType.textContent = q.type === 'single'? 'Single Select' : q.type === 'multi'? 'Multi Select' : 'Fill in the Blank';
  qText.textContent = q.question;

  optionsBox.innerHTML = '';

  if (q.type === 'single') {
    q.options.forEach(opt => {
      const div = document.createElement('div');
      div.className = 'option';
      div.innerHTML = `<input type="radio" name="answer" value="${opt}" id="${opt}"> <label for="${opt}">${opt}</label>`;
      if (userAnswers[currentQ] === opt) div.classList.add('selected');
      div.onclick = () => selectOption(opt, div);
      optionsBox.appendChild(div);
    });
  }
  else if (q.type === 'multi') {
    q.options.forEach(opt => {
      const div = document.createElement('div');
      div.className = 'option';
      div.innerHTML = `<input type="checkbox" value="${opt}" id="${opt}"> <label for="${opt}">${opt}</label>`;
      if (userAnswers[currentQ] && userAnswers[currentQ].includes(opt)) div.classList.add('selected');
      div.onclick = () => toggleMultiOption(opt, div);
      optionsBox.appendChild(div);
    });
  }
  else if (q.type === 'fill') {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'fill-input';
    input.placeholder = 'Type your answer...';
    input.value = userAnswers[currentQ] || '';
    input.oninput = (e) => userAnswers[currentQ] = e.target.value;
    optionsBox.appendChild(input);
  }

  prevBtn.disabled = currentQ === 0;
  nextBtn.textContent = currentQ === quizData.length - 1? 'Submit' : 'Next';
}

function selectOption(opt, div) {
  document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
  div.classList.add('selected');
  div.querySelector('input').checked = true;
  userAnswers[currentQ] = opt;
}

function toggleMultiOption(opt, div) {
  const checkbox = div.querySelector('input');
  checkbox.checked =!checkbox.checked;
  div.classList.toggle('selected');

  if (!userAnswers[currentQ]) userAnswers[currentQ] = [];

  if (checkbox.checked) {
    if (!userAnswers[currentQ].includes(opt)) userAnswers[currentQ].push(opt);
  } else {
    userAnswers[currentQ] = userAnswers[currentQ].filter(x => x!== opt);
  }
}

function checkAnswer(q, userAns) {
  if (q.type === 'single') {
    return userAns === q.answer;
  } else if (q.type === 'multi') {
    if (!userAns || userAns.length!== q.answer.length) return false;
    return q.answer.every(a => userAns.includes(a));
  } else if (q.type === 'fill') {
    return userAns && userAns.trim().toLowerCase() === q.answer.toLowerCase();
  }
  return false;
}

function showResults() {
  score = 0;
  reviewBox.innerHTML = '';

  quizData.forEach((q, i) => {
    const isCorrect = checkAnswer(q, userAnswers[i]);
    if (isCorrect) score++;

    const div = document.createElement('div');
    div.className = `review-item ${isCorrect? 'correct' : 'wrong'}`;

    let userAnsText = userAnswers[i];
    if (Array.isArray(userAnsText)) userAnsText = userAnsText.join(', ');
    if (!userAnsText) userAnsText = 'No answer';

    let correctAnsText = Array.isArray(q.answer)? q.answer.join(', ') : q.answer;

    div.innerHTML = `
      <div class="review-q">${i + 1}. ${q.question}</div>
      <div class="review-ans">Your answer: ${userAnsText}</div>
      <div class="review-ans">Correct answer: ${correctAnsText}</div>
    `;
    reviewBox.appendChild(div);
  });

  finalScore.textContent = `${score}/${quizData.length}`;
  const percentage = (score / quizData.length) * 100;

  if (percentage >= 80) resultMsg.textContent = 'Excellent! 🎉';
  else if (percentage >= 60) resultMsg.textContent = 'Good Job! 👏';
  else if (percentage >= 40) resultMsg.textContent = 'Not Bad! 👍';
  else resultMsg.textContent = 'Keep Practicing! 💪';

  restartBtn.textContent = currentSet < allQuizSets.length - 1? 'Next Set' : 'Restart Quiz';
  quizScreen.classList.add('hidden');
  resultsScreen.classList.remove('hidden');
}

nextBtn.onclick = () => {
  if (currentQ < quizData.length - 1) {
    currentQ++;
    loadQuestion();
  } else {
    showResults();
  }
};

prevBtn.onclick = () => {
  if (currentQ > 0) {
    currentQ--;
    loadQuestion();
  }
};

restartBtn.onclick = () => {
  currentSet = (currentSet + 1) % allQuizSets.length;
  quizData = allQuizSets[currentSet];
  currentQ = 0;
  userAnswers = new Array(quizData.length).fill(null);
  score = 0;
  resultsScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  loadQuestion();
};

loadQuestion();