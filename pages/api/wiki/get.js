import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.json({ ok: false });

  const client = await clientPromise;
  const db = client.db("wiki");
  const doc = await db.collection("wikis").findOne({ _id: new ObjectId(id), approved: true });

  if (!doc) return res.json({ ok: false });
  res.json({ ok: true, data: doc });
}
