let points = 0;
const referralCode = 'WATCHMINT-' + Math.random().toString(36).substring(2,8).toUpperCase();

document.getElementById('startBtn').addEventListener('click', () => {
  document.getElementById('intro').classList.add('hidden');
  document.getElementById('tasks').classList.remove('hidden');
});

// Referral copy
document.getElementById('copyReferral').addEventListener('click', () => {
  const link = location.href + '?ref=' + referralCode;
  navigator.clipboard.writeText(link).then(() => {
    alert('Referral link copied to clipboard! Share it with friends.');
  }).catch(() => {
    alert('Cannot access clipboard. Here is the link: ' + link);
  });
});

// Complete simple tasks
function completeTask(value) {
  points += value;
  document.getElementById('points').innerText = points;
  alert('✅ Task completed! You earned ' + value + ' points.');
}

// Basic quiz implementation (3 questions)
const quiz = [
  {q: 'Which color is mint-like?', a: ['Red','Blue','Green'], correct: 2},
  {q: 'How many minutes in an hour?', a: ['30','60','90'], correct: 1},
  {q: '2 + 2 = ?', a: ['3','4','5'], correct: 1}
];

let currentQ = 0;
let correctCount = 0;

function startQuiz(){
  currentQ = 0;
  correctCount = 0;
  showQuiz();
}

function showQuiz(){
  document.getElementById('quizModal').classList.remove('hidden');
  const q = quiz[currentQ];
  document.getElementById('quizQuestion').innerText = q.q;
  const answersDiv = document.getElementById('quizAnswers');
  answersDiv.innerHTML = '';
  q.a.forEach((ans, idx) => {
    const btn = document.createElement('button');
    btn.innerText = ans;
    btn.style.display = 'block';
    btn.style.margin = '8px 0';
    btn.onclick = () => {
      if(idx === q.correct) { correctCount++; }
      currentQ++;
      if(currentQ < quiz.length) {
        showQuiz();
      } else {
        finishQuiz();
      }
    };
    answersDiv.appendChild(btn);
  });
}

// Close button
document.getElementById('quizClose').addEventListener('click', () => {
  document.getElementById('quizModal').classList.add('hidden');
});

function finishQuiz(){
  document.getElementById('quizModal').classList.add('hidden');
  if(correctCount === quiz.length){
    completeTask(20);
    alert('Great! You answered all questions correctly and earned 20 points.');
  } else {
    alert('Quiz finished. Correct answers: ' + correctCount + '/' + quiz.length + '. Try again for full points.');
  }
}
