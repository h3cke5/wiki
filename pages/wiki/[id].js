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
      try {
        const r = await fetch(`/api/wiki/get?id=${id}`);
        const j = await r.json();
        if (j.ok) setData(j.data);
        else setNotfound(true);
      } catch {
        setNotfound(true);
      }
    })();
  }, [id]);

  if (notfound) return <main className="p-6 text-center text-gray-600">❌ Wiki não encontrada</main>;
  if (!data) return <main className="p-6 text-center text-gray-600">Carregando...</main>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-3 text-blue-600">{data.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{data.category} • {new Date(data.createdAt).toLocaleString()}</p>
      {data.author && <p className="mb-4 text-gray-700"><b>Autor:</b> {data.author}</p>}
      <article className="prose prose-blue max-w-none whitespace-pre-wrap">{data.content}</article>
    </main>
  );
}
