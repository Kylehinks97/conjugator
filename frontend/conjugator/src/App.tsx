import "./styles/App.css";
import newLesson from "./fetchers.ts";
import { useEffect, useState, useRef } from "react";

function App() {
  const [katas, setKatas] = useState([]);
  const [newLessonLaunched, setNewLessonLaunched] = useState<boolean | null>(
    null
  );
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (newLessonLaunched) {
      newLesson().then((result: any) => {
        setKatas(result.data);
      });
    }
  }, [newLessonLaunched]);

  console.log(katas, "<--");
  console.log(newLessonLaunched);

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-bold text-blue-500">conjugator</h1>
        <button onClick={() => setNewLessonLaunched(true)}>New Lesson</button>
      </div>
      {newLessonLaunched && katas.length > 0 && katas.map((kata: any, idx: any) => {
        return <p key={idx}>{kata.kata}</p>;
      })}
    </>
  );
}

export default App;
