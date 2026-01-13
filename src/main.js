import './style.css'
import { PLAYER_1, PLAYER_2, SYSTEM } from '@rcade/plugin-input-classic'
import triviaQuestions from "./data/trivia.json"

const app = document.querySelector('#app')
app.innerHTML = `
  <h1>Trivia Murder Party</h1>
  <p id="status">Press 1P START</p>
  <p id="status">Press 2P START</p>

  <div id="controls"></div>
  <div id="controls-p2"></div>

  <div id="question"></div>
  <div id="answers"></div>
`

const status = document.querySelector('#status')
const controls = document.querySelector('#controls')
const controlsP2 = document.querySelector('#controls-p2')

const selectedAnswers = [0, 0]
let answersArray;

let gameStarted = false

function setQuestion(){
    answersArray = [triviaQuestions[0].correct_answer, ...triviaQuestions[0].incorrect_answers]

    question.textContent = triviaQuestions[0].question
    answers.innerHTML = answersArray.map((answer)=>(
        `<div>${answer}</div>`
    )).join('')
}

function update() {
    if (!gameStarted) {
        if (SYSTEM.ONE_PLAYER || SYSTEM.TWO_PLAYER) {
            gameStarted = true
            setQuestion()
        }
    } else {
        // Player One
        if (PLAYER_1.DPAD.up) { 
            selectedAnswers[0]--

            if (selectedAnswers[0] < 0){
                selectedAnswers[0] = answersArray.length - 1
            }

            console.log('player 1 chioce:', selectedAnswers[0])
        }
        
        if (PLAYER_1.DPAD.down) { 
            selectedAnswers[0]++

            if (selectedAnswers[0] > answersArray.length - 1){
                selectedAnswers[0] = 0
            }

            console.log('player 1 chioce:', selectedAnswers[0])
        }
    }

    requestAnimationFrame(update)
}

update()
