import "./style.css";
import { PLAYER_1, PLAYER_2, SYSTEM } from "@rcade/plugin-input-classic";
import triviaQuestions from "./data/trivia.json";

const app = document.querySelector("#app");
app.innerHTML = `
  <h1>Trivia Murder Party</h1>
  <p id="status">Press 1P START</p>
  <p id="status">Press 2P START</p>

  <div id="controls"></div>
  <div id="controls-p2"></div>

  <div id="question"></div>
  <div id="answers"></div>
`;

const status = document.querySelector("#status");
const controls = document.querySelector("#controls");
const controlsP2 = document.querySelector("#controls-p2");

const gameState = {
	selectedAnswers: [0, 0],
	answersArray: null,
	started: false,
};

function setQuestion() {
	gameState.answersArray = [
		triviaQuestions[0].correct_answer,
		...triviaQuestions[0].incorrect_answers,
	];

	question.textContent = triviaQuestions[0].question;
	answers.innerHTML = gameState.answersArray
		.map(
			(answer, idx) => `<div class="answer" id="answer-${idx}">
           <span id="p1-dot"></span>
           <span id="p2-dot"></span>
           ${answer}
        </div>`,
		)
		.join("");
}

function update() {
	if (!gameState.started) {
		if (SYSTEM.ONE_PLAYER || SYSTEM.TWO_PLAYER) {
			gameState.started = true;
			setQuestion();

			const statuses = document.querySelectorAll("#status");
			for (const statusTag of statuses) {
				statusTag.hidden = true;
			}
		}
	} else {
        const currentAnswers = document.querySelectorAll(".answer");
        currentAnswers.forEach((answer)=>{
            answer.classList.remove('p1-selected')
            answer.classList.remove('p2-selected')
        })

		// Player One
        playerInput(PLAYER_1, 0)
        playerInput(PLAYER_2, 1)

		// input memory
		PLAYER_1.LAST_FRAME.DPAD = structuredClone(PLAYER_1.DPAD);
		PLAYER_2.LAST_FRAME.DPAD = structuredClone(PLAYER_2.DPAD);
	}

	requestAnimationFrame(update);
}

function playerInput(player, playerIndex) {
    if (player.DPAD.up && !player.LAST_FRAME.DPAD.up) {
        gameState.selectedAnswers[playerIndex]--;

        if (gameState.selectedAnswers[playerIndex] < 0) {
            gameState.selectedAnswers[playerIndex] = gameState.answersArray.length - 1;
        }
    }

    if (player.DPAD.down && !player.LAST_FRAME.DPAD.down) {
        gameState.selectedAnswers[playerIndex]++;

        if (gameState.selectedAnswers[playerIndex] > gameState.answersArray.length - 1) {
            gameState.selectedAnswers[playerIndex] = 0;
        }
    }

    document.getElementById(`answer-${gameState.selectedAnswers[playerIndex]}`)
        .classList.add(`p${playerIndex + 1}-selected`);
}

PLAYER_1.LAST_FRAME = {};
PLAYER_1.LAST_FRAME.DPAD = {} ;
PLAYER_2.LAST_FRAME = {};
PLAYER_2.LAST_FRAME.DPAD = {};
update();
