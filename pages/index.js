import { useEffect, useState } from "react";
import Link from "next/link";

const TAGS = ["", "DJs", "BDFD", "AOI", "HTML"];

export default function Home() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");

  async function fetchData(params = {}) {
    const url = new URL("/api/wiki/list", window.location.origin);
    if (params.q) url.searchParams.set("q", params.q);
    if (params.tag) url.searchParams.set("tag", params.tag);
    const r = await fetch(url);
    const j = await r.json();
    if (j.ok) setItems(j.items);
  }

  useEffect(() => { fetchData({ q, tag }); }, [q, tag]);

  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Wikis</h1>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link href="/submit">Enviar Wiki</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <section style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título ou conteúdo..."
          style={{ flex: 1, padding: 8 }}
        />
        <select value={tag} onChange={(e) => setTag(e.target.value)} style={{ padding: 8 }}>
          {TAGS.map((t) => (
            <option key={t || "todas"} value={t}>{t || "Todas"}</option>
          ))}
        </select>
      </section>

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
        {items.map((w) => (
          <li key={w._id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
            <h3 style={{ margin: "0 0 4px" }}>
              <Link href={`/wiki/${w._id}`}>{w.title}</Link>
            </h3>
            <small style={{ opacity: 0.7 }}>{w.category} • {new Date(w.createdAt).toLocaleString()}</small>
          </li>
        ))}
        {items.length === 0 && <p>Nenhuma wiki encontrada.</p>}
      </ul>
    </main>
  );
}
