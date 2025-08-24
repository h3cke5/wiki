import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function WikiPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [notfound, setNotfound] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const r = await fetch(`/api/wiki/list?q=&tag=`);
      const j = await r.json();
      if (j.ok) {
        const item = (j.items || []).find(x => String(x._id) === id);
        if (item) {
          // busca conteúdo completo
          const full = await fetch(`/api/wiki/pending?token=${encodeURIComponent("noop")}`); // não iremos usar aqui
        }
      }
    })();
  }, [id]);

  // versão simples: reusa a lista e faz uma nova chamada dedicada
  useEffect(() => {
    if (!id) return;
    (async () => {
      const r = await fetch(`/api/wiki/list?q=&tag=`);
      const j = await r.json();
      if (!j.ok) return setNotfound(true);
      const item = (j.items || []).find(x => String(x._id) === id);
      if (!item) return setNotfound(true);

      // busca documento completo via endpoint interno (rápido)
      const full = await fetch(`/api/wiki/get?id=${id}`);
      if (full.ok) {
        const data = await full.json();
        setData(data);
      } else {
        // fallback: mostra apenas título/categoria
        setData(item);
      }
    })();
  }, [id]);

  if (notfound) return <main style={{ padding: 24 }}>Wiki não encontrada</main>;
  if (!data) return <main style={{ padding: 24 }}>Carregando...</main>;

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>{data.title}</h1>
      <p style={{ opacity: 0.8 }}>{data.category} • {new Date(data.createdAt).toLocaleString()}</p>
      {data.author && <p><b>Autor:</b> {data.author}</p>}
      <article style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{data.content}</article>
    </main>
  );
}
