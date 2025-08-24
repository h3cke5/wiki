import { getDB } from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { q = "", tag = "" } = req.query || {};
  const db = await getDB();

  const match = { status: "approved" };
  if (tag) match.category = tag;

  if (q) {
    match.$or = [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } }
    ];
  }

  const docs = await db
    .collection("wikis")
    .find(match)
    .project({ title: 1, category: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .toArray();

  return res.status(200).json({ ok: true, items: docs });
}
