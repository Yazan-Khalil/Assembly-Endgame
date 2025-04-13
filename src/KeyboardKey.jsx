import { useState, useEffect, useRef } from "react";

function KeyboardKey(props) {
    const [keyDown, setKeyDown] = useState(false);
    const keyRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = function(event) {
            if(event.key === props.letter && props.isGameStarted) {
                keyRef.current?.click();
                setKeyDown(true);
            }
        }

        const handleKeyUp = function(event) {
            if(event.key === props.letter && props.isGameStarted) {
                setKeyDown(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [props.letter, props.isGameStarted]);

    return (
        <button
            ref={keyRef}
			onClick={() => props.guessLetter(props.letter)}
			key={props.letter}
			aria-label={`Letter ${props.letter}`}

			className={
                `alpha-letter 
                ${props.isGameStarted? "": "blocked"}
                ${props.guessed? "guessed": ""}
                ${props.correct? "correct": "wrong"}
                ${keyDown? "pressed": ""}`
            }
		>
		{props.letter.toUpperCase()} </button>        
    )
}

export default KeyboardKey;