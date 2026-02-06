import { useEffect, useState } from "react";
import { api } from "../api/client";
import AppShell from "../components/AppShell";

const AdminDashboard = () => {
  const [topics, setTopics] = useState<Array<{ _id: string; title: string; order?: number; level?: string }>>([]);
  const [lessons, setLessons] = useState<Array<{ _id: string; title: string; order?: number }>>([]);
  const [quizzes, setQuizzes] = useState<Array<{ _id: string; title: string; scopeType?: string; scopeId?: string; passScore?: number }>>([]);
  const [questions, setQuestions] = useState<Array<{ _id: string; question: string; options?: string[]; correctAnswer?: string }>>([]);

  const [topicTitle, setTopicTitle] = useState("");
  const [topicOrder, setTopicOrder] = useState(1);
  const [topicLevel, setTopicLevel] = useState("A2");
  const [editTopicId, setEditTopicId] = useState("");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonOrder, setLessonOrder] = useState(1);
  const [lessonTopicId, setLessonTopicId] = useState("");
  const [editLessonId, setEditLessonId] = useState("");

  const [vocabLessonId, setVocabLessonId] = useState("");
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [vocabTopic, setVocabTopic] = useState("");
  const [level, setLevel] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [quizScopeType, setQuizScopeType] = useState("LESSON");
  const [quizScopeId, setQuizScopeId] = useState("");
  const [quizPassScore, setQuizPassScore] = useState(70);
  const [editQuizId, setEditQuizId] = useState("");

  const [questionQuizId, setQuestionQuizId] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [editQuestionId, setEditQuestionId] = useState("");

  const loadAdminData = async () => {
    const [topicRes, quizRes] = await Promise.all([api.get("/topics/all"), api.get("/quiz/all")]);
    setTopics(topicRes.data);
    setQuizzes(quizRes.data);
    if (topicRes.data.length > 0) {
      setLessonTopicId(topicRes.data[0]._id);
    }
    if (quizRes.data.length > 0) {
      setQuestionQuizId(quizRes.data[0]._id);
    }
  };

  const loadLessons = async (topicId: string) => {
    if (!topicId) return;
    const res = await api.get(`/lessons/topic/${topicId}`);
    setLessons(res.data);
    if (res.data.length > 0) {
      setVocabLessonId(res.data[0]._id);
    }
  };

  const loadQuestions = async (quizId: string) => {
    if (!quizId) return;
    const res = await api.get(`/questions/quiz/${quizId}`);
    setQuestions(res.data);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    if (lessonTopicId) {
      loadLessons(lessonTopicId);
    }
  }, [lessonTopicId]);

  useEffect(() => {
    if (questionQuizId) {
      loadQuestions(questionQuizId);
    }
  }, [questionQuizId]);

  useEffect(() => {
    const topic = topics.find(t => t._id === editTopicId);
    if (!topic) return;
    setTopicTitle(topic.title);
    setTopicOrder(topic.order || 1);
    setTopicLevel(topic.level || "A2");
  }, [editTopicId, topics]);

  useEffect(() => {
    const lesson = lessons.find(l => l._id === editLessonId);
    if (!lesson) return;
    setLessonTitle(lesson.title);
    setLessonOrder(lesson.order || 1);
  }, [editLessonId, lessons]);

  useEffect(() => {
    const quiz = quizzes.find(q => q._id === editQuizId);
    if (!quiz) return;
    setQuizTitle(quiz.title);
    setQuizScopeType(quiz.scopeType || "LESSON");
    setQuizScopeId(quiz.scopeId || "");
    setQuizPassScore(quiz.passScore || 70);
  }, [editQuizId, quizzes]);

  useEffect(() => {
    const q = questions.find(item => item._id === editQuestionId);
    if (!q) return;
    setQuestion(q.question);
    setOptions(q.options ? q.options.join(", ") : "");
    setCorrectAnswer(q.correctAnswer || "");
  }, [editQuestionId, questions]);

  const createTopic = async () => {
    await api.post("/topics", { title: topicTitle, order: topicOrder, level: topicLevel, isPublished: true });
    alert("Topic created");
    loadAdminData();
  };

  const updateTopic = async () => {
    if (!editTopicId) return;
    await api.patch(`/topics/${editTopicId}`, { title: topicTitle, order: topicOrder, level: topicLevel });
    alert("Topic updated");
    loadAdminData();
  };

  const deleteTopic = async (id: string) => {
    await api.delete(`/topics/${id}`);
    alert("Topic deleted");
    loadAdminData();
  };

  const createLesson = async () => {
    await api.post("/lessons", { topicId: lessonTopicId, title: lessonTitle, order: lessonOrder, isPublished: true });
    alert("Lesson created");
    loadLessons(lessonTopicId);
  };

  const updateLesson = async () => {
    if (!editLessonId) return;
    await api.patch(`/lessons/${editLessonId}`, { title: lessonTitle, order: lessonOrder, topicId: lessonTopicId });
    alert("Lesson updated");
    loadLessons(lessonTopicId);
  };

  const deleteLesson = async (id: string) => {
    await api.delete(`/lessons/${id}`);
    alert("Lesson deleted");
    loadLessons(lessonTopicId);
  };

  const createVocabulary = async () => {
    await api.post("/vocabulary", {
      lessonId: vocabLessonId,
      word,
      meaning,
      example,
      topic: vocabTopic,
      level
    });
    alert("Vocabulary created");
  };

  const createQuiz = async () => {
    await api.post("/quiz", {
      scopeType: quizScopeType,
      scopeId: quizScopeId || undefined,
      title: quizTitle,
      passScore: quizPassScore
    });
    alert("Quiz created");
    loadAdminData();
  };

  const updateQuiz = async () => {
    if (!editQuizId) return;
    await api.patch(`/quiz/${editQuizId}`, {
      scopeType: quizScopeType,
      scopeId: quizScopeId || undefined,
      title: quizTitle,
      passScore: quizPassScore
    });
    alert("Quiz updated");
    loadAdminData();
  };

  const deleteQuiz = async (id: string) => {
    await api.delete(`/quiz/${id}`);
    alert("Quiz deleted");
    loadAdminData();
  };

  const createQuestion = async () => {
    const optionList = options.split(",").map(o => o.trim()).filter(Boolean);
    await api.post("/questions", {
      quizId: questionQuizId,
      sourceType: "CUSTOM",
      question,
      options: optionList,
      correctAnswer,
      type: "MCQ"
    });
    alert("Question created");
    loadQuestions(questionQuizId);
  };

  const updateQuestion = async () => {
    if (!editQuestionId) return;
    const optionList = options.split(",").map(o => o.trim()).filter(Boolean);
    await api.patch(`/questions/${editQuestionId}`, { question, options: optionList, correctAnswer });
    alert("Question updated");
    loadQuestions(questionQuizId);
  };

  const deleteQuestion = async (id: string) => {
    await api.delete(`/questions/${id}`);
    alert("Question deleted");
    loadQuestions(questionQuizId);
  };

  return (
    <AppShell>
      <div className="hero">
        <div>
          <h1>Admin Studio</h1>
          <p className="muted">Create lessons, vocabulary, and quizzes for learners.</p>
        </div>
        <div className="card">
          <h3>Quick Actions</h3>
          <p className="muted">Fill the forms below to publish new content.</p>
        </div>
      </div>
      <div className="split" style={{ marginTop: 24 }}>
        <section className="card">
          <h2>Create Topic</h2>
          <select className="input" value={editTopicId} onChange={e => setEditTopicId(e.target.value)}>
            <option value="">-- Select to edit --</option>
            {topics.map(t => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </select>
          <input className="input" placeholder="Title" value={topicTitle} onChange={e => setTopicTitle(e.target.value)} />
          <input
            className="input"
            placeholder="Order"
            type="number"
            value={topicOrder}
            onChange={e => setTopicOrder(Number(e.target.value))}
          />
          <input className="input" placeholder="Level (A1/B1)" value={topicLevel} onChange={e => setTopicLevel(e.target.value)} />
          <div style={{ display: "flex", gap: 12 }}>
            <button className="button" onClick={createTopic}>
              Create
            </button>
            <button className="button secondary" onClick={updateTopic} disabled={!editTopicId}>
              Update
            </button>
          </div>
          <div style={{ marginTop: 12 }} className="list">
            {topics.map(t => (
              <div key={t._id} className="card" style={{ background: "var(--panel-2)" }}>
                <strong>{t.title}</strong>
                <button className="button secondary" onClick={() => deleteTopic(t._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
        <section className="card">
          <h2>Create Lesson</h2>
          <select className="input" value={lessonTopicId} onChange={e => setLessonTopicId(e.target.value)}>
            {topics.map(t => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </select>
          <select className="input" value={editLessonId} onChange={e => setEditLessonId(e.target.value)}>
            <option value="">-- Select to edit --</option>
            {lessons.map(l => (
              <option key={l._id} value={l._id}>
                {l.title}
              </option>
            ))}
          </select>
          <input className="input" placeholder="Title" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} />
          <input
            className="input"
            placeholder="Order"
            type="number"
            value={lessonOrder}
            onChange={e => setLessonOrder(Number(e.target.value))}
          />
          <div style={{ display: "flex", gap: 12 }}>
            <button className="button" onClick={createLesson}>
              Create
            </button>
            <button className="button secondary" onClick={updateLesson} disabled={!editLessonId}>
              Update
            </button>
          </div>
          <div style={{ marginTop: 12 }} className="list">
            {lessons.map(l => (
              <div key={l._id} className="card" style={{ background: "var(--panel-2)" }}>
                <strong>{l.title}</strong>
                <button className="button secondary" onClick={() => deleteLesson(l._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="split" style={{ marginTop: 24 }}>
        <section className="card">
          <h2>Create Vocabulary</h2>
          <select className="input" value={vocabLessonId} onChange={e => setVocabLessonId(e.target.value)}>
            {lessons.map(l => (
              <option key={l._id} value={l._id}>
                {l.title}
              </option>
            ))}
          </select>
          <input className="input" placeholder="Word" value={word} onChange={e => setWord(e.target.value)} />
          <input className="input" placeholder="Meaning" value={meaning} onChange={e => setMeaning(e.target.value)} />
          <input className="input" placeholder="Example" value={example} onChange={e => setExample(e.target.value)} />
          <input className="input" placeholder="Topic" value={vocabTopic} onChange={e => setVocabTopic(e.target.value)} />
          <input className="input" placeholder="Level" value={level} onChange={e => setLevel(e.target.value)} />
          <button className="button" onClick={createVocabulary}>
            Save Vocabulary
          </button>
        </section>
        <section className="card">
          <h2>Create Quiz</h2>
          <select className="input" value={editQuizId} onChange={e => setEditQuizId(e.target.value)}>
            <option value="">-- Select to edit --</option>
            {quizzes.map(q => (
              <option key={q._id} value={q._id}>
                {q.title}
              </option>
            ))}
          </select>
          <input className="input" placeholder="Title" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} />
          <select className="input" value={quizScopeType} onChange={e => setQuizScopeType(e.target.value)}>
            <option value="LESSON">LESSON</option>
            <option value="TOPIC">TOPIC</option>
            <option value="LEVEL">LEVEL</option>
          </select>
          <input
            className="input"
            placeholder="Scope ID (lesson/topic id)"
            value={quizScopeId}
            onChange={e => setQuizScopeId(e.target.value)}
          />
          <input
            className="input"
            placeholder="Pass score"
            type="number"
            value={quizPassScore}
            onChange={e => setQuizPassScore(Number(e.target.value))}
          />
          <div style={{ display: "flex", gap: 12 }}>
            <button className="button" onClick={createQuiz}>
              Create
            </button>
            <button className="button secondary" onClick={updateQuiz} disabled={!editQuizId}>
              Update
            </button>
          </div>
          <div style={{ marginTop: 12 }} className="list">
            {quizzes.map(q => (
              <div key={q._id} className="card" style={{ background: "var(--panel-2)" }}>
                <strong>{q.title}</strong>
                <button className="button secondary" onClick={() => deleteQuiz(q._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="split" style={{ marginTop: 24 }}>
        <section className="card">
          <h2>Create Question</h2>
          <select className="input" value={questionQuizId} onChange={e => setQuestionQuizId(e.target.value)}>
            {quizzes.map(q => (
              <option key={q._id} value={q._id}>
                {q.title}
              </option>
            ))}
          </select>
          <select className="input" value={editQuestionId} onChange={e => setEditQuestionId(e.target.value)}>
            <option value="">-- Select to edit --</option>
            {questions.map(q => (
              <option key={q._id} value={q._id}>
                {q.question}
              </option>
            ))}
          </select>
          <input className="input" placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)} />
          <input
            className="input"
            placeholder="Options (comma separated)"
            value={options}
            onChange={e => setOptions(e.target.value)}
          />
          <input
            className="input"
            placeholder="Correct Answer"
            value={correctAnswer}
            onChange={e => setCorrectAnswer(e.target.value)}
          />
          <div style={{ display: "flex", gap: 12 }}>
            <button className="button" onClick={createQuestion}>
              Create
            </button>
            <button className="button secondary" onClick={updateQuestion} disabled={!editQuestionId}>
              Update
            </button>
          </div>
          <div style={{ marginTop: 12 }} className="list">
            {questions.map(q => (
              <div key={q._id} className="card" style={{ background: "var(--panel-2)" }}>
                <strong>{q.question}</strong>
                <button className="button secondary" onClick={() => deleteQuestion(q._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default AdminDashboard;
