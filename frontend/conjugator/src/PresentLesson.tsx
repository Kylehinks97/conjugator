import { useEffect, useState, useRef } from "react";
import "./styles/PresentLesson.css";
import newLesson from "./fetchers";
import { Kata } from "./types.ts";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { GB, ES } from "country-flag-icons/react/3x2";

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
  const [isOptionsDisabled, setIsOptionsDisabled] = useState<boolean>(false);
  const [showCorrectMessage, setShowCorrectMessage] = useState<boolean | null>(
    null
  );
  const [showIncorrectMessage, setShowIncorrectMessage] = useState<
    boolean | null
  >(null);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [correctSentences, setCorrectSentences] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<null | number>(
    null
  );
  const [translations, setTranslations] = useState<string[]>([]);

  function getSentences() {
    katas.forEach((kata) => {
      setCorrectSentences((previousSentences) => [
        ...previousSentences,
        kata.kata.replace("___", kata.conjugated_form),
      ]);
    });
  }

  console.log(katas, "correctSentences");
  console.log(translations, "translations");

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (newLessonLaunched) {
      newLesson().then((result: any) => {
        const lessonData = result.data.map((kata: any) => {
          console.log(kata);
          setCorrectAnswers((prevCorrectAnswers) => [
            ...prevCorrectAnswers,
            kata.conjugated_form,
          ]);
          setTranslations((prevTranslations) => [
            ...prevTranslations,
            kata.translation,
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

  useEffect(() => {
    if (correctAnswers.length > 0 && katas.length === correctAnswers.length) {
      const sentences = katas.map((kata, index) =>
        kata.kata.replace("___", correctAnswers[index])
      );
      setCorrectSentences(sentences);
    }
  }, [correctAnswers, katas]);

  function handleOptionClick(chosen: any, correct: any, choiceIdx: number) {
    if (chosen === correct && !isAnswered) {
      setIsCorrect(true);
      setIsAnswered(true);
    } else {
      setIsCorrect(false);
    }
    setSelected(chosen);
    setIsCheckDisabled(false);
    setSelectedChoiceIdx(choiceIdx);
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
    <>
      <div className="container">
        <h1 className="text-xl font-bold text-blue-500">conjugator</h1>
        <button
          onClick={() => {
            setNewLessonLaunched(true);
            setInQuestion(true);
            getSentences();
          }}
        >
          New Lesson
        </button>
        {newLessonLaunched &&
          katas.length > 0 &&
          currentKataIndex < katas.length && (
            <div key={currentKataIndex}>
              <p>Score {score}</p>
              <p className="kata-text">
                {selected === null
                  ? katas[currentKataIndex].kata
                  : katas[currentKataIndex].kata.replace("___", `${selected}`)}
              </p>
              {katas[currentKataIndex].choices.map(
                (choice: string, choiceIdx: number) => (
                  <button
                    disabled={isOptionsDisabled}
                    key={choiceIdx}
                    onClick={() => {
                      handleOptionClick(
                        choice,
                        katas[currentKataIndex].conjugated_form,
                        choiceIdx
                      );
                    }}
                    className={`option-button ${
                      selectedChoiceIdx === choiceIdx ? "selected" : ""
                    }`}
                  >
                    {choice}
                  </button>
                )
              )}
            </div>
          )}
        {newLessonLaunched && !readyToContinue && inQuestion ? (
          <div>
            <button
              disabled={isCheckDisabled}
              onClick={() => {
                isCorrect ? showCorrect() : showIncorrect();
                setInQuestion(false);
                isCorrect ? setScore(score + 1) : null;
                setIsOptionsDisabled(true);
              }}
              className={`progress-button ${
                !selected ? "" : "correct-background"
              }`}
            >
              CHECK
            </button>
          </div>
        ) : null}
        {readyToContinue && !inQuestion ? (
          <button
            onClick={() => {
              setIsOptionsDisabled(false);
              setSelected(null);
              setCurrentKataIndex((prevIndex) => prevIndex + 1);
              setInQuestion(true);
              setReadyToContinue(false);
              setIsCheckDisabled(true);
              setShowCorrectMessage(false);
              setShowIncorrectMessage(false);
              setIsAnswered(false);
            }}
            className={`progress-button ${
              isCorrect ? "correct-background" : "incorrect-background"
            }`}
          >
            CONTINUE
          </button>
        ) : null}
      </div>
      {showIncorrectMessage ? (
        <div className="answered-message">
          <div className="incorrect" id="incorrect-message">
            <span className="message-text">
              <BsXCircleFill className="icon" />
            </span>
            Oops! The answer is {correctAnswers[currentKataIndex]}
          </div>
          <div className="correct" id="incorrect-message">
            <div id="incorrect-message">
              <div className="flag-container">
                <ES id="flag" />
              </div>
            </div>
            {correctSentences[currentKataIndex]}
          </div>
          <div id="incorrect-message">
            <div className="flag-container">
              <GB id="flag" />
            </div>
          </div>
        </div>
      ) : null}
      {showCorrectMessage ? (
        <div className="answered-message">
          <div className="correct" id="correct-message">
            <span className="message-text">
              <BsCheckCircleFill className="icon" />
            </span>
            Well done! The answer is {selected}
          </div>
          <div className="correct" id="incorrect-message">
            <div id="incorrect-message">
              <div className="flag-container">
                <ES id="flag" />
              </div>
            </div>
            {correctSentences[currentKataIndex]}
          </div>
          <div id="incorrect-message">
            <div className="flag-container">
              <GB id="flag" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default PresentLesson;
