import { useState } from "react";

const CATEGORIES = ["DJs", "BDFD", "AOI", "HTML"];

export default function SubmitPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");

    try {
      const res = await fetch("/api/wiki/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, content, author })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("✅ Wiki enviada para revisão!");
        setTitle("");
        setContent("");
        setAuthor("");
        setCategory(CATEGORIES[0]);
      } else {
        setStatus("❌ " + (data.error || "Erro ao enviar"));
      }
    } catch {
      setStatus("❌ Erro de rede ou servidor");
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">📤 Enviar Wiki</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-lg">
        <input type="text" placeholder="Título" value={title} onChange={(e)=>setTitle(e.target.value)}
          className="border p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400" required />

        <select value={category} onChange={(e)=>setCategory(e.target.value)}
          className="border p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400" required>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <textarea placeholder="Conteúdo" value={content} onChange
