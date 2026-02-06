import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import AppShell from "../components/AppShell";

type Topic = {
  _id: string;
  title: string;
  description?: string;
  level: string;
};

type Lesson = {
  _id: string;
  title: string;
  description?: string;
  status?: "LOCKED" | "IN_PROGRESS" | "COMPLETED";
};

const VocabularyPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");

  const loadTopics = async () => {
    const res = await api.get("/topics");
    setTopics(res.data);
    if (res.data.length > 0) {
      setSelectedTopic(res.data[0]._id);
    }
  };

  const loadLessons = async (topicId: string) => {
    const res = await api.get(`/lessons/topic/${topicId}`);
    setLessons(res.data);
  };

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      loadLessons(selectedTopic);
    }
  }, [selectedTopic]);

  return (
    <AppShell>
      <div className="hero">
        <div>
          <h1>Learning Path</h1>
          <p className="muted">Choose a topic, then unlock lessons in order.</p>
        </div>
        <div className="card">
          <h3>Pick a topic</h3>
          <select className="input" value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}>
            {topics.map(t => (
              <option key={t._id} value={t._id}>
                {t.title} · {t.level}
              </option>
            ))}
          </select>
          <p className="muted">Select a lesson below to start learning.</p>
        </div>
      </div>
      <div style={{ marginTop: 24 }} className="list">
        {lessons.map((lesson, index) => {
          const locked = lesson.status === "LOCKED";
          return (
            <div className={`card lesson ${locked ? "locked" : ""}`} key={lesson._id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <h3>
                    {index + 1}. {lesson.title}
                  </h3>
                  <p className="muted">{lesson.description}</p>
                </div>
                <span className={`badge ${lesson.status === "COMPLETED" ? "badge-success" : ""}`}>
                  {lesson.status || "IN_PROGRESS"}
                </span>
              </div>
              <div style={{ marginTop: 16 }}>
                {locked ? (
                  <button className="button secondary" disabled>
                    Locked
                  </button>
                ) : (
                  <Link className="button" to={`/lessons/${lesson._id}`}>
                    Start Lesson
                  </Link>
                )}
              </div>
            </div>
          );
        })}
        {lessons.length === 0 && <p className="muted">No lessons for this topic yet.</p>}
      </div>
    </AppShell>
  );
};

export default VocabularyPage;
