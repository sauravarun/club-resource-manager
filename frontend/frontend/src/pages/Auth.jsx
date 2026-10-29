import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Auth({ mode }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") await login(username, password);
      else await register(username, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button>{mode === "login" ? "Login" : "Create account"}</button>
    </form>
  );
}