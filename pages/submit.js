import { useState } from "react";
const CATS = ["DJs", "BDFD", "AOI", "HTML"];

export default function Submit() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATS[0]);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("Enviando...");

    const r = await fetch("/api/wiki/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, content, author })
    });
    const j = await r.json();
    if (r.ok && j.ok) {
      setStatus(`Enviado! ID: ${j.id}`);
      setTitle(""); setContent(""); setAuthor("");
    } else {
      setStatus(j.error || "Erro ao enviar");
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 800, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Enviar Wiki</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Título" required />
        <select value={category} onChange={(e)=>setCategory(e.target.value)}>
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <textarea value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Conteúdo" rows={8} required />
        <input value={author} onChange={(e)=>setAuthor(e.target.value)} placeholder="Assinatura (opcional)" />
        <button type="submit">Enviar para revisão</button>
        <p>{status}</p>
      </form>
    </main>
  );
}
