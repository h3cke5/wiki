import { getDB } from "../../../lib/db";

function isAuthorized(req) {
  const token = req.headers["x-admin-token"] || req.query.token;
  return token && token === process.env.ADMIN_TOKEN;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  if (!isAuthorized(req)) return res.status(401).json({ error: "Não autorizado" });

  const db = await getDB();
  const items = await db
    .collection("wikis")
    .find({ status: "pending" })
    .sort({ createdAt: 1 })
    .toArray();

  return res.status(200).json({ ok: true, items });
}
