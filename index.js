const api = 'https://opentdb.com/api.php?amount=10';

const title = document.getElementById('title');
const question = document.getElementById('question');
const answersContainer = document.getElementById('answers');
const start = document.getElementById('start');
const genre = document.getElementById('genre');
const difficulty = document.getElementById('difficulty');

class Quiz {
  constructor(quizData) {
    this.quiz = quizData.results;
    this.correctNum = 0;
  }
  getQuizCategory(index) {
    return this.quiz[index - 1].category;
  }
  getQuizDifficulty(index) {
    return this.quiz[index - 1].difficulty;
  }
  getQuizQuestion(index) {
    return this.quiz[index - 1].question;
  }
  getQuizNum() {
    return this.quiz.length;
  }
  getCorrectAnswer(index) {
    return this.quiz[index - 1].correct_answer;
  }
  getIncorrectAnswers(index) {
    return this.quiz[index - 1].incorrect_answers;
  }
  correctAnswerNum(index, answer) {
    const correctAnswer = this.quiz[index - 1].correct_answer
    if (answer === correctAnswer) {
      return this.correctNum++;
    }
  }
  getCorrectAnswerNum() {
    return this.correctNum;
  }
}

start.addEventListener('click', async () => {
  start.hidden = true
  await getQuiz(1);
})

const getQuiz = async (index) => {
  title.innerHTML = '取得中';
  question.innerHTML = '少々お待ちください。';
  const response = await fetch(api)
  const quizData = await response.json()
  console.log(quizData)
  const quizInstance = new Quiz(quizData);
  setNextQuiz(quizInstance, index)
};

const makeQuiz = (quizInstance, index) => {
  title.innerHTML = `問題 ${index}`;
  genre.innerHTM = `[ジャンル] ${quizInstance.getQuizCategory(index)}`
  difficulty.innerHTML = `[難易度] ${quizInstance.getQuizDifficulty(index)}`
  question.innerHTML = `[クイズ] ${quizInstance.getQuizQuestion(index)}`

  const answers = buildAnswers(quizInstance, index);

  answers.forEach((answer) => {
    const answerElm = document.createElement('li');
    answersContainer.appendChild(answerElm);

    const button = document.createElement('button')
    button.innerHTML = answer
    answerElm.appendChild(button)

    button.addEventListener('click', () => {
      quizInstance.correctAnswerNum(index, answer);
      index++
      setNextQuiz(quizInstance, index)
    })
  })
}

const buildAnswers = (quizInstance, index) => {
  const answers = [
    quizInstance.getCorrectAnswer(index),
    ...quizInstance.getIncorrectAnswers(index)
  ];
  return shuffleAnswers(answers);
}

const shuffleAnswers = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const finishQuiz = (quizInstance) => {
  title.textContent = `あなたの正答数は${quizInstance.getCorrectAnswerNum()}です`
  genre.textContent = '';
  difficulty.textContent = '';
  question.textContent = '再チャレンジしたい場合は下をクリック';
  const restartBtn = document.createElement('button');
  restartBtn.textContent = 'ホームへ戻る';
  answersContainer.appendChild(restartBtn);
  restartBtn.addEventListener('click', () => {
    location.reload();
  })
}

const setNextQuiz = (quizInstance, index) => {
  while (answersContainer.firstChild) {
    answersContainer.removeChild(answersContainer.firstChild);
  }
  if (index <= quizInstance.getQuizNum()) {
    makeQuiz(quizInstance, index);
  } else {
    finishQuiz(quizInstance);
  }
}

