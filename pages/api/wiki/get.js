import { getDB } from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.json({ ok: false });

  const db = await getDB();
  const data = await db.collection("wikis").findOne({ _id: new ObjectId(id), status: "approved" });

  if (!data) return res.json({ ok: false });
  res.json({ ok: true, data });
}
