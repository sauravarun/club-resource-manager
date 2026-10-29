import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { CATEGORIES } from "./Home";

export default function ResourceForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", url: "", category: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api(`/resources/${id}`)
      .then((r) => setForm({
        title: r.title,
        url: r.url,
        category: r.category || "",
        description: r.description || "",
      }))
      .catch((err) => setError(err.message));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const body = { ...form, category: form.category || null, description: form.description || null };
    try {
      if (id) await api(`/resources/${id}`, { method: "PUT", body });
      else await api("/resources", { method: "POST", body });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{id ? "Edit resource" : "Add resource"}</h2>
      {error && <p className="error">{error}</p>}
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <input name="url" type="url" placeholder="https://..." value={form.url} onChange={handleChange} required />
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">No category</option>
        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
      </select>
      <textarea name="description" placeholder="Description" rows={4} value={form.description} onChange={handleChange} />
      <button>{id ? "Save changes" : "Add"}</button>
    </form>
  );
}