import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { setAuth } from "../utils/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      setAuth(res.data.token, res.data.user);
      navigate("/vocabulary");
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className="container">
      <div className="hero">
        <div>
          <h1>Welcome back to Lumen</h1>
          <p>
            Learn vocabulary by topic, master quizzes, and track your growth with a clean, focused experience.
          </p>
        </div>
        <div className="card">
          <h2>Login</h2>
          <p className="muted">Access your learning dashboard.</p>
          <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input
              className="input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="button" type="submit">
              Login
            </button>
          </form>
          {error && <p style={{ color: "var(--danger)", marginTop: 8 }}>{error}</p>}
          <p className="muted" style={{ marginTop: 12 }}>
            New here? <a href="/register">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
