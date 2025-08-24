import { useEffect, useMemo, useState } from "react";

export default function Admin() {
  const [token, setToken] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null); // item aberto no modal
  const [status, setStatus] = useState("");

  // lembra token no localStorage
  useEffect(() => {
    const t = localStorage.getItem("ADMIN_TOKEN");
    if (t) setToken(t);
  }, []);
  useEffect(() => {
    if (token) localStorage.setItem("ADMIN_TOKEN", token);
  }, [token]);

  async function load() {
    if (!token) return;
    setStatus("Carregando pendentes...");
    const r = await fetch(`/api/wiki/pending`, {
      headers: { "x-admin-token": token }
    });
    const j = await r.json();
    if (r.ok && j.ok) {
      setItems(j.items);
      setStatus("");
    } else {
      setStatus(j.error || "Falha ao carregar");
    }
  }

  useEffect(() => { load(); }, [token]);

  async function act(action, id) {
    const r = await fetch(`/api/wiki/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token
      },
      body: JSON.stringify({ id, action })
    });
    const j = await r.json();
    if (r.ok && j.ok) {
      setStatus(`${action === "approve" ? "Aprovada" : "Rejeitada"}!`);
      setSelected(null);
      await load();
    } else {
      setStatus(j.error || "Falha na ação");
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Admin • Revisão de Wikis</h1>

      <section style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <input
          value={token}
          onChange={(e)=>setToken(e.target.value)}
          placeholder="Cole seu ADMIN_TOKEN"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={load}>Atualizar</button>
      </section>

      <p style={{ opacity: 0.8 }}>{status}</p>

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
        {items.map((w) => (
          <li key={w._id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
            <strong>{w.title}</strong> <small style={{ opacity: 0.7 }}>({w.category})</small>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button onClick={() => setSelected(w)}>Ver / Aprovar</button>
              <button onClick={() => act("reject", w._id)}>Reprovar</button>
            </div>
            <small style={{ display: "block", marginTop: 8, opacity: 0.7 }}>
              ID: {w._id}
            </small>
          </li>
        ))}
        {items.length === 0 && <p>Nada pendente.</p>}
      </ul>

      {/* Modal simples */}
      {selected && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "grid", placeItems: "center", padding: 16
        }}>
          <div style={{ background: "white", maxWidth: 700, width: "100%", borderRadius: 12, padding: 20 }}>
            <h3 style={{ marginTop: 0 }}>{selected.title}</h3>
            <p><b>Categoria:</b> {selected.category}</p>
            {selected.author && <p><b>Autor:</b> {selected.author}</p>}
            <pre style={{ whiteSpace: "pre-wrap", background: "#f8f9fa", padding: 12, borderRadius: 8 }}>
              {selected.content}
            </pre>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
              <button onClick={() => setSelected(null)}>Fechar</button>
              <button onClick={() => act("approve", selected._id)}>Aprovar</button>
              <button onClick={() => act("reject", selected._id)}>Reprovar</button>
            </div>
            <small style={{ display: "block", marginTop: 8, opacity: 0.7 }}>
              ID: {selected._id}
            </small>
          </div>
        </div>
      )}
    </main>
  );
}
