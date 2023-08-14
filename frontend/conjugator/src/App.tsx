import PresentLesson from "./PresentLesson";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.tsx"
import Learn from "./Learn.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/learn" element={<Learn />}></Route>
        <Route path="/present" element={<PresentLesson />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
