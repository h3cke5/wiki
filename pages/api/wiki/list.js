import { getDB } from "../../../lib/db";

export default async function handler(req, res) {
  const { q = "", tag = "" } = req.query;
  const db = await getDB();

  const query = { status: "approved" };
  if (tag) query.category = tag;
  if (q) query.title = { $regex: q, $options: "i" };

  const items = await db.collection("wikis").find(query).sort({ createdAt: -1 }).toArray();
  res.json({ ok: true, items });
}
