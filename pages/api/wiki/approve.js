import { getDB } from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const { id, token } = req.body;
  if (token !== process.env.ADMIN_TOKEN)
    return res.status(403).json({ ok: false, error: "Sem permissão" });

  const db = await getDB();
  await db.collection("wikis").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "approved", slug: id } }
  );

  res.json({ ok: true });
}
