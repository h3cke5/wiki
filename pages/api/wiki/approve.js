import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const { id, token } = req.body;
  if (token !== process.env.ADMIN_TOKEN) return res.status(403).json({ ok: false, error: "Sem permissão" });

  const client = await clientPromise;
  const db = client.db("wiki");

  await db.collection("wikis").updateOne(
    { _id: new ObjectId(id) },
    { $set: { approved: true } }
  );

  res.json({ ok: true });
}
