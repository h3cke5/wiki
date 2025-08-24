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
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">📚 Wiki Explorer</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
        <input
          type="text"
          placeholder="🔍 Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border p-3 rounded-lg shadow focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="border p-3 rounded-lg shadow focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todas as categorias</option>
          <option value="DJs">DJs</option>
          <option value="BDFD">BDFD</option>
          <option value="AOI">AOI</option>
          <option value="HTML">HTML</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {wikis.map((wiki) => (
          <Link key={wiki._id} href={`/wiki/${wiki._id}`}>
            <div className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-1 text-gray-800">{wiki.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{wiki.category} • {new Date(wiki.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-700 line-clamp-3">{wiki.content}</p>
            </div>
          </Link>
        ))}
        {wikis.length === 0 && <p className="text-center text-gray-500 col-span-full">Nenhuma wiki encontrada</p>}
      </div>
    </main>
  );
}
