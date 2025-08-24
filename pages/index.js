import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("DJs");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");

    const res = await fetch("/api/sendWiki", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, content }),
    });

    if (res.ok) setStatus("Wiki enviada para revisão!");
    else setStatus("Erro ao enviar wiki.");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Enviar Wiki</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "500px" }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" required />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="DJs">DJs</option>
          <option value="BDFD">BDFD</option>
          <option value="AOI">AOI</option>
          <option value="HTML">HTML</option>
        </select>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Conteúdo" rows={6} required />
        <button type="submit">Enviar para revisão</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
