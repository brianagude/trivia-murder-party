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

const gameState = {
    selectedAnswers: [0, 0],
    answersArray: null,
    started: false,
}

function setQuestion(){
    gameState.answersArray = [triviaQuestions[0].correct_answer, ...triviaQuestions[0].incorrect_answers]

    question.textContent = triviaQuestions[0].question
    answers.innerHTML = gameState.answersArray.map((answer)=>(
        `<div>
           <span id="p1-dot"></span>
           <span id="p2-dot"></span>
           ${answer}
        </div>`
    )).join('')
}

function update() {
    if (!gameState.started) {
        if (SYSTEM.ONE_PLAYER || SYSTEM.TWO_PLAYER) {
            gameState.started = true
            setQuestion()

            let statuses = document.querySelectorAll("#status")
            for (let statusTag of statuses) {
                statusTag.hidden = true
            }
        }
    } else {
        // Player One
        if (PLAYER_1.DPAD.up && !PLAYER_1.LAST_FRAME.DPAD.up) {
            gameState.selectedAnswers[0]--

            if (gameState.selectedAnswers[0] < 0){
                gameState.selectedAnswers[0] = gameState.answersArray.length - 1
            }

            console.log('player 1 chioce:', gameState.selectedAnswers[0])
        }
        
        if (PLAYER_1.DPAD.down && !PLAYER_1.LAST_FRAME.DPAD.down) {
            gameState.selectedAnswers[0]++

            if (gameState.selectedAnswers[0] > gameState.answersArray.length - 1){
                gameState.selectedAnswers[0] = 0
            }

            console.log('player 1 chioce:', gameState.selectedAnswers[0])
        }

        // input memory
        PLAYER_1.LAST_FRAME.DPAD = structuredClone(PLAYER_1.DPAD)
        PLAYER_2.LAST_FRAME.DPAD = structuredClone(PLAYER_2.DPAD)
    }

    requestAnimationFrame(update)
}

PLAYER_1.LAST_FRAME = {};
PLAYER_1.LAST_FRAME.DPAD = {};
PLAYER_2.LAST_FRAME = {};
PLAYER_2.LAST_FRAME.DPAD = {};
update()
