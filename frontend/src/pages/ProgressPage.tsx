import { useEffect, useState } from "react";
import { api } from "../api/client";
import AppShell from "../components/AppShell";

type Progress = {
  lessonProgress: Array<{ lessonId: string; status: string; bestScore: number }>;
  topicProgress: Array<{ topicId: string; completedLessons: number; totalLessons: number; status: string }>;
  quizResults: Array<{ quizId: string; score: number; total: number; percentage: number; takenAt: string }>;
};

const ProgressPage = () => {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    api.get("/progress/me").then(res => setProgress(res.data));
  }, []);

  return (
    <AppShell>
      <div className="hero">
        <div>
          <h1>Your Progress</h1>
          <p className="muted">See how much you’ve learned and your quiz history.</p>
        </div>
        <div className="card">
          <h3>Lessons Completed</h3>
          <p style={{ fontSize: 28, marginTop: 8 }}>
            {progress ? progress.lessonProgress.filter(p => p.status === "COMPLETED").length : 0}
          </p>
        </div>
      </div>
      <div style={{ marginTop: 24 }} className="card">
        <h3>Topic Progress</h3>
        {progress && (
          <div className="list" style={{ marginTop: 12 }}>
            {progress.topicProgress.map(tp => (
              <div key={tp.topicId} className="card" style={{ background: "var(--panel-2)" }}>
                <strong>
                  {tp.completedLessons}/{tp.totalLessons} lessons
                </strong>
                <p className="muted">{tp.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: 24 }} className="card">
        <h3>Quiz Performance</h3>
        {!progress && <p className="muted" style={{ marginTop: 12 }}>Loading...</p>}
        {progress && progress.quizResults.length === 0 && (
          <p className="muted" style={{ marginTop: 12 }}>No quiz attempts yet.</p>
        )}
        {progress && progress.quizResults.length > 0 && (
          <div className="chart" style={{ marginTop: 16 }}>
            {progress.quizResults.slice(-6).map(result => (
              <div key={result.quizId + result.takenAt} className="chart-row">
                <span className="chart-label">{new Date(result.takenAt).toLocaleDateString()}</span>
                <div className="chart-bar">
                  <div className="chart-fill" style={{ width: `${result.percentage}%` }} />
                </div>
                <span className="chart-value">{result.percentage}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: 24 }} className="card">
        <h3>Quiz Results</h3>
        {!progress && <p className="muted" style={{ marginTop: 12 }}>Loading...</p>}
        {progress && (
          <div style={{ marginTop: 12 }} className="list">
            {progress.quizResults.map(result => (
              <div key={result.quizId + result.takenAt} className="card" style={{ background: "var(--panel-2)" }}>
                <strong>
                  {result.score}/{result.total} ({result.percentage}%)
                </strong>
                <p className="muted">{new Date(result.takenAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default ProgressPage;
