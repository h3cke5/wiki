import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  const { q = "", tag = "" } = req.query;
  const client = await clientPromise;
  const db = client.db("wiki");

  const query = { approved: true };
  if (tag) query.category = tag;
  if (q) query.title = { $regex: q, $options: "i" };

  const wikis = await db.collection("wikis").find(query).sort({ createdAt: -1 }).toArray();

  res.json({ ok: true, items: wikis });
}
