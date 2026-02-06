import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { setAuth } from "../utils/auth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", { name, email, password });
      setAuth(res.data.token, res.data.user);
      navigate("/vocabulary");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="container">
      <div className="hero">
        <div>
          <h1>Build a strong English habit</h1>
          <p>Create your account and get a personalized learning journey.</p>
        </div>
        <div className="card">
          <h2>Register</h2>
          <p className="muted">Start learning in minutes.</p>
          <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
            <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input
              className="input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="button" type="submit">
              Create account
            </button>
          </form>
          {error && <p style={{ color: "var(--danger)", marginTop: 8 }}>{error}</p>}
          <p className="muted" style={{ marginTop: 12 }}>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
