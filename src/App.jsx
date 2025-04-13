import { useState, useRef, useEffect } from "react";
import Language from "./components/Language";
import KeyboardKey from "./KeyboardKey";
import { languages } from "./languages";
import { getFarewellText, generateRandomWord } from "./utils";

function App() {

	useEffect(() => {
		window.scrollTo(0, 1);
    }, []);

	const alphabet = "abcdefghijklmnopqrstuvwxyz";
	const [currentWord, setCurrentWord] = useState(() => generateRandomWord());
	const currentWordArray = currentWord.split("");

	const [guessedLetters, setGuessedLetters] = useState([]);
	const wrongGuessCount = guessedLetters.filter(letter => !currentWordArray.includes(letter)).length;

	const isGameWon = currentWordArray.every(letter => guessedLetters.includes(letter));
	const isGameLost = wrongGuessCount >= languages.length - 1;
	const isGameOver = isGameLost || isGameWon;

	const correctSound = useRef(null);
	const wrongSound = useRef(null);
	const winSound = useRef(null);
	const lossSound = useRef(null);

	useEffect(() => {
		correctSound.current = new Audio("/src/sounds/correct-answer.wav");
		wrongSound.current = new Audio("/src/sounds/wrong-answer.mp3");
		winSound.current = new Audio("/src/sounds/win.mp3");
		lossSound.current = new Audio("/src/sounds/loss.mp3");
		
		correctSound.current.volume = 0.2;
		wrongSound.current.volume = 0.5;
		winSound.current.volume = 0.25;
		lossSound.current.volume = 0.25;

	}, []);
	
	const inGameSoundRef = useRef(null);

	useEffect(() => {
		if (!inGameSoundRef.current) {
			inGameSoundRef.current = new Audio("/src/sounds/ingame.mp3");
			inGameSoundRef.current.loop = true;
		}
	
		if (!isGameOver) {
			inGameSoundRef.current.play();
		} else {
			inGameSoundRef.current.pause();
			setTimeout(() => {
				inGameSoundRef.current.play();
			}, 4300);
		}

	}, [isGameOver]);

	if(isGameWon) {
		setTimeout(() => {
			winSound.current.currentTime = 0;
			winSound.current.play();
		}, 500);
	}

	if(isGameLost) {
		setTimeout(() => {
			lossSound.current.currentTime = 0;
			lossSound.current.play();
		}, 500);
	}

	const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];

	function generateKeyboradLetters() {
		return alphabet.split("").map(letter => ({
			value: letter,
			guessed: guessedLetters.includes(letter),
			correct: currentWordArray.includes(letter)
		}))
	}

	function guessLetter(letter) {
		if(isGameOver || guessedLetters.includes(letter))
			return;
		
		if(currentWordArray.includes(letter)) {
			correctSound.current.currentTime = 0;
			correctSound.current.play();
		}
		else {
			wrongSound.current.currentTime = 0;
			wrongSound.current.play();
			setTimeout(() => {
				wrongSound.current.pause();
				wrongSound.current.currentTime = 0;
			}, 300);
		}

		setGuessedLetters(prevLetters => 
			prevLetters.includes(letter)? prevLetters
			: [...prevLetters, letter]);
	}

	function showWord() {
		return (
			currentWordArray.map((letter, index) => 
			<span 
				key={index}
				className={`word-letter ${isGameOver && !guessedLetters.includes(letter)? "missed": ""}`}>
				{
				guessedLetters.includes(letter) || isGameOver? 
					letter.toUpperCase()
					: ""
				}
			</span>
		))
	}

	const newGameRef = useRef(null);
	useEffect(() => {
		function handleEnter(event) {
			if(event.key === "Enter" && isGameOver) {
				newGameRef.current?.click();
			}
		}

		window.addEventListener("keydown", handleEnter);

		return () => {
			window.removeEventListener("keydown", handleEnter);
		};
	}, [isGameOver]);	

	function newGame() {
		setCurrentWord(generateRandomWord());
		setGuessedLetters([]);
	}

	return (
		<main>
			<header>
				<h1>Assembly: Endgame</h1>
				<p>Guess the word within 8 attempts to keep the programming world 
					safe from Assembly!</p>
			</header>

			<section className="game-status" aria-live="polite" role="status">
				{isGameWon && <h2 className="current-status won-status">Congratulations! <br /> You won the game! 🥳🎉</h2>}
				{isGameLost && <h2 className="current-status lost-status">You lost! 😢 <br /> Better start learning Assembly! </h2>}
				{(lastGuessedLetter && !currentWordArray.includes(lastGuessedLetter) && !isGameOver) && 
					<h2 className="current-status farewell-status">{getFarewellText(languages[wrongGuessCount - 1].name)} </h2>}
				{!isGameOver && (!lastGuessedLetter || currentWordArray.includes(lastGuessedLetter)) &&
					<h2 className="current-status"></h2>}
			</section>

			<section className="languages">
				{languages.map((l, index) => <Language 
					key={l.name}
					lost={index < wrongGuessCount}
					name={l.name}
					backgroundColor={l.backgroundColor}
					color={l.color} 
				/>)}
			</section>

			<section className="word">
				{showWord()}
			</section>

			<section className="sr-only" aria-live="polite" role="status">
				{lastGuessedLetter && 
					<p>
						{currentWord.includes(lastGuessedLetter) ? 
                        `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
                    	You have {languages.length - 1 - wrongGuessCount} attempts left.
					</p>
				}

				<p>Current Word: {currentWordArray.map(letter =>
					guessedLetters.includes(letter)? letter + ".": "blank.").join(" ")}
				</p>
			</section>

			<section className="keyboard">
				{generateKeyboradLetters().map(letterObj => 
					<KeyboardKey 
						key={letterObj.value}
						letter={letterObj.value}
						guessed={letterObj.guessed}
						correct={letterObj.correct}
						guessLetter={guessLetter}
					/>
				)}
			</section>

			<button className={`new-game ${isGameOver? "show": ""}`} onClick={newGame} ref={newGameRef}>
				New Game
			</button>
		</main>
	)
}

export default App;
