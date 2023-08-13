import { useEffect, useState, useRef } from "react";
import "./styles/PresentLesson.css";
import newLesson from "./fetchers";
import { Kata } from "./types.ts";

function PresentLesson() {
  const [katas, setKatas] = useState<Kata[]>([]);
  const [newLessonLaunched, setNewLessonLaunched] = useState<boolean | null>(
    null
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [currentKataIndex, setCurrentKataIndex] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<null | boolean>(null);
  const isInitialRender = useRef(true);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (newLessonLaunched) {
      newLesson().then((result: any) => {
        const lessonData = result.data.map((kata: any) => {
          const choices = [
            ...`${kata.conjugated_form}, ${kata.options}`.split(", "),
          ].sort(() => Math.random() - 0.5);
          return { ...kata, choices };
        });
        setKatas(lessonData);
      });
    }
  }, [newLessonLaunched]);

  function handleButtonClick(chosen: any, correct: any) {
    if (chosen === correct) {
      setIsCorrect(true)
      setScore(score + 1)
    } else {
      setIsCorrect(false)
    }
    setSelected(chosen);
  }

  console.log(selected);

  return (
    <div>
      <h1 className="text-xl font-bold text-blue-500">conjugator</h1>
      <button onClick={() => setNewLessonLaunched(true)}>New Lesson</button>
      <p>Score {score}</p>
      {newLessonLaunched &&
        katas.length > 0 &&
        currentKataIndex < katas.length && (
          <div key={currentKataIndex}>
            <p>
              {katas[currentKataIndex].kata}
              <br />
              <br />
            </p>
            {katas[currentKataIndex].choices.map(
              (choice: string, choiceIdx: number) => (
                <button
                  key={choiceIdx}
                  onClick={() => {
                    handleButtonClick(
                      choice,
                      katas[currentKataIndex].conjugated_form
                    );
                  }}
                  className="option-button"
                >
                  {choice}
                </button>
              )
            )}
          </div>
        )}
      {isCorrect ? (
        <button
          onClick={() => setCurrentKataIndex((prevIndex) => prevIndex + 1)}
        >
          NEXT
        </button>
      ) : null}
    </div>
  );
}

export default PresentLesson;
