import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import AppShell from "../components/AppShell";

type Lesson = {
  _id: string;
  title: string;
  description?: string;
};

type Vocabulary = {
  _id: string;
  word: string;
  meaning: string;
  example: string;
  level: string;
  phonetic?: string;
};

type Grammar = {
  _id: string;
  title: string;
  description: string;
  examples: string[];
};

type Overview = {
  vocabLearned: number;
  vocabTotal: number;
  grammarLearned: number;
  grammarTotal: number;
  quizPassed: boolean;
  completionPercent: number;
  status: string;
};

const LessonDetailPage = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [grammar, setGrammar] = useState<Grammar[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);

  const load = async () => {
    if (!id) return;
    const res = await api.get(`/lessons/${id}`);
    setLesson(res.data.lesson);
    setVocabulary(res.data.vocabulary || []);
    setGrammar(res.data.grammar || []);
    setQuizId(res.data.quiz?._id || null);
    setOverview(res.data.overview || null);
  };

  const markVocab = async (vocabId: string) => {
    if (!id) return;
    await api.post("/progress/vocabulary", { lessonId: id, vocabId });
    alert("Marked as learned");
  };

  const markGrammar = async (grammarId: string) => {
    if (!id) return;
    await api.post("/progress/grammar", { lessonId: id, grammarId });
    alert("Marked as learned");
  };

  useEffect(() => {
    load();
  }, [id]);

  return (
    <AppShell>
      <div className="hero">
        <div>
          <h1>{lesson?.title || "Lesson"}</h1>
          <p className="muted">{lesson?.description || ""}</p>
        </div>
        <div className="card">
          <h3>Actions</h3>
          {quizId ? (
            <Link className="button" to={`/quiz?quizId=${quizId}`}>
              Start Quiz
            </Link>
          ) : (
            <p className="muted">No quiz yet for this lesson.</p>
          )}
          <div style={{ marginTop: 12 }}>
            <Link className="button secondary" to="/vocabulary">
              Back to topics
            </Link>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 24 }} className="card">
        <h3>Lesson Overview</h3>
        {overview && (
          <>
            <div style={{ marginTop: 12 }} className="list">
              <div className="card" style={{ background: "var(--panel-2)" }}>
                <strong>Vocabulary</strong>
                <p className="muted">
                  {overview.vocabLearned}/{overview.vocabTotal} learned
                </p>
              </div>
              <div className="card" style={{ background: "var(--panel-2)" }}>
                <strong>Grammar</strong>
                <p className="muted">
                  {overview.grammarLearned}/{overview.grammarTotal} learned
                </p>
              </div>
              <div className="card" style={{ background: "var(--panel-2)" }}>
                <strong>Quiz</strong>
                <p className="muted">{overview.quizPassed ? "Passed" : "Not passed"}</p>
              </div>
            </div>
            <div className="chart" style={{ marginTop: 16 }}>
              <div className="chart-row">
                <span className="chart-label">Completion</span>
                <div className="chart-bar">
                  <div className="chart-fill" style={{ width: `${overview.completionPercent}%` }} />
                </div>
                <span className="chart-value">{overview.completionPercent}%</span>
              </div>
            </div>
          </>
        )}
        {!overview && <p className="muted" style={{ marginTop: 12 }}>Loading overview...</p>}
      </div>
      <div style={{ marginTop: 24 }} className="grid">
        <div className="card">
          <h3>Vocabulary</h3>
          <div className="list" style={{ marginTop: 12 }}>
            {vocabulary.map(item => (
              <div key={item._id} className="card" style={{ background: "var(--panel-2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div>
                    <strong>{item.word}</strong>
                    <p className="muted">{item.meaning}</p>
                  </div>
                  <span className="badge">{item.level}</span>
                </div>
                {item.phonetic && <p className="muted">{item.phonetic}</p>}
                <p style={{ marginTop: 8 }}>{item.example}</p>
                <button className="button secondary" onClick={() => markVocab(item._id)}>
                  Mark learned
                </button>
              </div>
            ))}
            {vocabulary.length === 0 && <p className="muted">No vocabulary yet.</p>}
          </div>
        </div>
        <div className="card">
          <h3>Grammar</h3>
          <div className="list" style={{ marginTop: 12 }}>
            {grammar.map(item => (
              <div key={item._id} className="card" style={{ background: "var(--panel-2)" }}>
                <strong>{item.title}</strong>
                <p className="muted">{item.description}</p>
                <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                  {item.examples.map(example => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
                <button className="button secondary" onClick={() => markGrammar(item._id)}>
                  Mark learned
                </button>
              </div>
            ))}
            {grammar.length === 0 && <p className="muted">No grammar yet.</p>}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default LessonDetailPage;
