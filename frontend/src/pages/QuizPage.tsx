import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import AppShell from "../components/AppShell";

type QuizMeta = {
  _id: string;
  title: string;
};

type Question = {
  _id: string;
  question: string;
  options: string[];
};

const QuizPage = () => {
  const [searchParams] = useSearchParams();
  const [quizzes, setQuizzes] = useState<QuizMeta[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; total: number; percentage: number; passed: boolean } | null>(
    null
  );

  useEffect(() => {
    api.get("/quiz").then(res => setQuizzes(res.data));
  }, []);

  useEffect(() => {
    const quizIdFromUrl = searchParams.get("quizId");
    if (quizIdFromUrl) {
      setSelectedQuizId(quizIdFromUrl);
    } else if (quizzes.length > 0) {
      setSelectedQuizId(quizzes[0]._id);
    }
  }, [searchParams, quizzes]);

  useEffect(() => {
    if (!selectedQuizId) return;
    api.get(`/quiz/${selectedQuizId}`).then(res => {
      setQuestions(res.data.questions);
      setAnswers({});
      setResult(null);
    });
  }, [selectedQuizId]);

  const submit = async () => {
    if (!selectedQuizId) return;
    const res = await api.post("/quiz/submit", { quizId: selectedQuizId, answers });
    setResult(res.data);
  };

  return (
    <AppShell>
      <div className="hero">
        <div>
          <h1>Quick Quiz</h1>
          <p className="muted">Choose the best answer and submit to see your score.</p>
        </div>
        <div className="card">
          <h3>Your score</h3>
          <p className="muted">Submit to see results.</p>
          {result && (
            <p style={{ fontSize: 24, marginTop: 8 }}>
              {result.score} / {result.total}
            </p>
          )}
        </div>
      </div>
      <div style={{ marginTop: 24 }} className="card">
        <h3>Select a quiz</h3>
        <select
          className="input"
          value={selectedQuizId || ""}
          onChange={e => setSelectedQuizId(e.target.value)}
        >
          {quizzes.map(q => (
            <option key={q._id} value={q._id}>
              {q.title}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: 24 }} className="list">
        {questions.map(q => (
          <div className="card" key={q._id}>
            <h3>{q.question}</h3>
            <div style={{ marginTop: 12 }}>
              {q.options.map(option => (
                <label key={option} style={{ display: "block", marginBottom: 8 }}>
                  <input
                    type="radio"
                    name={`q-${q._id}`}
                    value={option}
                    checked={answers[q._id] === option}
                    onChange={() => setAnswers(prev => ({ ...prev, [q._id]: option }))}
                  />
                  <span style={{ marginLeft: 8 }}>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button className="button" onClick={submit}>
          Submit
        </button>
      </div>
    </AppShell>
  );
};

export default QuizPage;
