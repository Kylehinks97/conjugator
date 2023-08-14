import { useEffect, useState, useRef } from "react";
import "./styles/PresentLesson.css";
import newLesson from "./fetchers";
import { Kata } from "./types.ts";

function PresentLesson() {
  const [katas, setKatas] = useState<Kata[]>([]);
  const [newLessonLaunched, setNewLessonLaunched] = useState<boolean | null>(
    null
  );
  const [readyToContinue, setReadyToContinue] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [currentKataIndex, setCurrentKataIndex] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<null | boolean>(null);
  const isInitialRender = useRef(true);
  const [score, setScore] = useState<number>(0);
  const [inQuestion, setInQuestion] = useState<boolean | null>(null);
  const [isCheckDisabled, setIsCheckDisabled] = useState<boolean>(true);
  const [showCorrectMessage, setShowCorrectMessage] = useState<boolean | null>(
    null
  );
  const [showIncorrectMessage, setShowIncorrectMessage] = useState<
    boolean | null
  >(null);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  console.log(inQuestion, "<-- inQuestion");
  console.log(readyToContinue, "<-- readyToContinue");
  console.log(selected, "<-- selected");

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (newLessonLaunched) {
      newLesson().then((result: any) => {
        const lessonData = result.data.map((kata: any) => {
          setCorrectAnswers((prevCorrectAnswers) => [
            ...prevCorrectAnswers,
            kata.conjugated_form,
          ]);
          const choices = [
            ...`${kata.conjugated_form}, ${kata.options}`.split(", "),
          ].sort(() => Math.random() - 0.5);
          return { ...kata, choices };
        });
        setKatas(lessonData);
      });
    }
  }, [newLessonLaunched]);

  console.log(correctAnswers);

  function handleOptionClick(chosen: any, correct: any) {
    if (chosen === correct && !isAnswered) {
      setIsCorrect(true);
      setIsAnswered(true);
    } else {
      setIsCorrect(false);
    }
    setSelected(chosen);
    setIsCheckDisabled(false);
  }

  function showCorrect() {
    setReadyToContinue(true);
    setShowCorrectMessage(true);
  }

  function showIncorrect() {
    setReadyToContinue(true);
    setShowIncorrectMessage(true);
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-blue-500">conjugator</h1>
      <button
        onClick={() => {
          setNewLessonLaunched(true);
          setInQuestion(true);
        }}
      >
        New Lesson
      </button>
      {newLessonLaunched &&
        katas.length > 0 &&
        currentKataIndex < katas.length && (
          <div key={currentKataIndex}>
            <p>Score {score}</p>
            <p>
              {selected === null
                ? katas[currentKataIndex].kata
                : katas[currentKataIndex].kata.replace("___", `${selected}`)}
              <br />
              <br />
            </p>
            {katas[currentKataIndex].choices.map(
              (choice: string, choiceIdx: number) => (
                <button
                  key={choiceIdx}
                  onClick={() => {
                    handleOptionClick(
                      choice,
                      katas[currentKataIndex].conjugated_form
                    );
                  }}
                  className={`option-button`}
                >
                  {choice}
                </button>
              )
            )}
          </div>
        )}
      {newLessonLaunched && !readyToContinue && inQuestion ? (
        <button
          disabled={isCheckDisabled}
          onClick={() => {
            isCorrect ? showCorrect() : showIncorrect();
            setInQuestion(false);
            isCorrect ? setScore(score + 1) : null;
          }}
          className={`check-button ${!selected ? "" : "correct"}`}
        >
          CHECK
        </button>
      ) : null}
      {readyToContinue && !inQuestion ? (
        <button
          onClick={() => {
            setSelected(null);
            setCurrentKataIndex((prevIndex) => prevIndex + 1);
            setInQuestion(true);
            setReadyToContinue(false);
            setIsCheckDisabled(true);
            setShowCorrectMessage(false);
            setShowIncorrectMessage(false);
            setIsAnswered(false);
          }}
        >
          CONTINUE
        </button>
      ) : null}
      {showCorrectMessage ? <p>Well done! The answer is {selected}</p> : null}
      {showIncorrectMessage ? (
        <p>Oops! The answer is {correctAnswers[currentKataIndex]}</p>
      ) : null}
    </div>
  );
}

export default PresentLesson;
