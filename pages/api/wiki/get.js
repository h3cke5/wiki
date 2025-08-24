import { getDB } from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query || {};
  if (!id) return res.status(400).json({ error: "id requerido" });

  const db = await getDB();
  const doc = await db.collection("wikis").findOne(
    { _id: new ObjectId(id), status: "approved" }
  );

  if (!doc) return res.status(404).json({ error: "não encontrada" });

  // formata saída
  return res.status(200).json({
    _id: doc._id,
    title: doc.title,
    content: doc.content,
    category: doc.category,
    author: doc.author || "",
    createdAt: doc.createdAt,
    slug: doc.slug || null
  });
}
a
