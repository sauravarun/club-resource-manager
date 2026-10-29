import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/"><b>Resource Hub</b></Link>
      <div>
        {user ? (
          <>
            <span>Hi, {user.username}</span>
            <Link to="/resources/new">+ Add</Link>
            <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}