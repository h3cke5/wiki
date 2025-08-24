import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [wikis, setWikis] = useState([]);

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/wiki/list?q=${query}&tag=${tag}`);
      const j = await r.json();
      if (j.ok) setWikis(j.items);
    })();
  }, [query, tag]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 Wiki Explorer</h1>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar..."
          className="flex-1 border p-2 rounded-md shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="border p-2 rounded-md shadow-sm"
        >
          <option value="">Todas as categorias</option>
          <option value="DJs">DJs</option>
          <option value="BDFD">BDFD</option>
          <option value="AOI">AOI</option>
          <option value="HTML">HTML</option>
        </select>
      </div>

      {/* Lista */}
      <div className="grid gap-4">
        {wikis.map((wiki) => (
          <Link key={wiki._id} href={`/wiki/${wiki._id}`}>
            <div className="p-4 border rounded-xl shadow hover:shadow-md transition cursor-pointer bg-white">
              <h2 className="text-xl font-semibold">{wiki.title}</h2>
              <p className="text-sm text-gray-600">
                {wiki.category} • {new Date(wiki.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 text-gray-700 line-clamp-2">{wiki.content}</p>
            </div>
          </Link>
        ))}
        {wikis.length === 0 && (
          <p className="text-center text-gray-500">Nenhuma wiki encontrada</p>
        )}
      </div>
    </main>
  );
}
