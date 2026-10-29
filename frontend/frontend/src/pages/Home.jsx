import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

export const CATEGORIES = ["Python", "JavaScript", "Design", "Career", "Tools", "Other"];

export default function Home() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);

    api(`/resources?${params}`)
      .then((data) => { setResources(data); setError(""); })
      .catch((err) => setError(err.message));
  }, [search, category]);

  async function handleDelete(id) {
    if (!confirm("Delete this resource?")) return;
    try {
      await api(`/resources/${id}`, { method: "DELETE" });
      setResources(resources.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="filters">
        <input placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {!error && resources.length === 0 && <p>No resources found.</p>}

      {resources.map((r) => (
        <div className="card" key={r.id}>
          <h3><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a></h3>
          {r.category && <span className="tag">{r.category}</span>}
          {r.description && <p>{r.description}</p>}
          <small>by {r.owner.username}</small>
          {user?.id === r.owner.id && (
            <div>
              <Link to={`/resources/${r.id}/edit`}>Edit</Link>
              <button onClick={() => handleDelete(r.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </>
  );
}