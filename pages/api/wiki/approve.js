import { getDB } from "../../../lib/db";
import { ObjectId } from "mongodb";

function isAuthorized(req) {
  const token = req.headers["x-admin-token"] || req.query.token;
  return token && token === process.env.ADMIN_TOKEN;
}

function slugify(text = "") {
  return text
    .toString()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!isAuthorized(req)) return res.status(401).json({ error: "Não autorizado" });

  const { id, action } = req.body || {};
  if (!id || !["approve", "reject"].includes(action)) {
    return res.status(400).json({ error: "Parâmetros inválidos" });
  }

  const db = await getDB();
  const wiki = await db.collection("wikis").findOne({ _id: new ObjectId(id) });
  if (!wiki) return res.status(404).json({ error: "Wiki não encontrada" });

  if (action === "approve") {
    const slugBase = slugify(wiki.title || "wiki");
    const unique = `${slugBase}-${wiki._id.toString().slice(-6)}`;
    await db.collection("wikis").updateOne(
      { _id: wiki._id },
      {
        $set: {
          status: "approved",
          slug: unique,
          updatedAt: new Date()
        }
      }
    );
    return res.status(200).json({ ok: true, status: "approved", id: wiki._id, slug: unique });
  } else {
    await db.collection("wikis").updateOne(
      { _id: wiki._id },
      { $set: { status: "rejected", updatedAt: new Date() } }
    );
    return res.status(200).json({ ok: true, status: "rejected", id: wiki._id });
  }
}
