import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../utils/auth";

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">Lumen English</div>
        <nav className="nav-links">
          <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/vocabulary">
            Vocabulary
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/quiz">
            Quiz
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/progress">
            Progress
          </NavLink>
          {user?.role === "ADMIN" && (
            <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/admin">
              Admin
            </NavLink>
          )}
        </nav>
        <button className="button secondary" onClick={logout}>
          Logout
        </button>
      </header>
      <main className="container">{children}</main>
    </div>
  );
};

export default AppShell;
