import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export default function newLesson() {
  return api.get("/new-lesson").then((result: any) => {
    console.log("Request successful:", result);
    return result;
  });
}
