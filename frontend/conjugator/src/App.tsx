import "./styles/App.css";
import newLesson from "./fetchers";
import { useEffect, useState, useRef } from "react";

function App() {
  const [katas, setKatas] = useState([]);
  const [newLessonLaunched, setNewLessonLaunched] = useState<boolean | null>(
    null
  );
  const [selected, setSelected] = useState<string | null>(null);
  const isInitialRender = useRef(true);

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
    chosen === correct ? console.log("correct") : console.log("wrong");
    setSelected(chosen);
  }

  console.log(selected);

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-bold text-blue-500">conjugator</h1>
        <button onClick={() => setNewLessonLaunched(true)}>New Lesson</button>
      </div>
      {newLessonLaunched &&
        katas.length > 0 &&
        katas.map((kata: any, idx: any) => (
          <>
            <div key={idx}>
              <p>
                {kata.kata}
                <br />
                <br />
              </p>
              <div className="flex justify-center">
                {kata.choices.map((choice: string, choiceIdx: number) => (
                  <button
                    key={choiceIdx}
                    onClick={() =>
                      handleButtonClick(choice, kata.conjugated_form)
                    }
                    className="option-button"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          </>
        ))}
    </>
  );
}

export default App;
