import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function WikiPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [notfound, setNotfound] = useState(false);

  // primeira busca: lista + verificação
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const r = await fetch(`/api/wiki/list?q=&tag=`);
        const j = await r.json();
        if (!j.ok) return setNotfound(true);

        const item = (j.items || []).find((x) => String(x._id) === id);
        if (!item) return setNotfound(true);

        // segunda busca: documento completo
        const full = await fetch(`/api/wiki/get?id=${id}`);
        if (full.ok) {
          const fullData = await full.json();
          if (fullData.ok) {
            setData(fullData.data);
          } else {
            setData(item); // fallback
          }
        } else {
          setData(item); // fallback
        }
      } catch (e) {
        console.error("Erro ao carregar wiki:", e);
        setNotfound(true);
      }
    })();
  }, [id]);

  if (notfound)
    return (
      <main className="p-6 text-center text-gray-600">
        ❌ Wiki não encontrada
      </main>
    );

  if (!data)
    return (
      <main className="p-6 text-center text-gray-600">
        Carregando...
      </main>
    );

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {data.category} •{" "}
        {new Date(data.createdAt).toLocaleString("pt-BR")}
      </p>
      {data.author && (
        <p className="mb-4 text-gray-700">
          <span className="font-semibold">Autor:</span> {data.author}
        </p>
      )}
      <article className="prose max-w-none whitespace-pre-wrap leading-relaxed">
        {data.content}
      </article>
    </main>
  );
}
