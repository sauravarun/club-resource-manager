const BASE = import.meta.env.VITE_API_URL;

export async function api(path, { method = "GET", body, form } = {}) {
  const headers = {};
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (form) {
    payload = new URLSearchParams(form); 
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(BASE + path, { method, headers, body: payload });
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = data?.detail;
    throw new Error(typeof detail === "string" ? detail : "Something went wrong");
  }
  return data;
}