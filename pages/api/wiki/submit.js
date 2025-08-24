import { getDB } from "../../../lib/db";

const CATEGORIES = ["DJs", "BDFD", "AOI", "HTML"];

function sanitize(text = "") {
  return String(text)
    .replace(/@everyone/gi, "@\u200beveryone")
    .replace(/@here/gi, "@\u200bhere");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { title, category, content, author = "" } = req.body || {};
  if (!title || !category || !content) {
    return res.status(400).json({ error: "Campos obrigatórios: title, category, content" });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Categoria inválida (use: DJs, BDFD, AOI, HTML)" });
  }

  const db = await getDB();
  const now = new Date();

  const doc = {
    title: sanitize(title.trim()),
    category,
    content: sanitize(content.trim()),
    author: sanitize(author.trim()),
    status: "pending",          // pending | approved | rejected
    createdAt: now,
    updatedAt: now,
    slug: null                  // pode ser gerado após aprovação
  };

  const result = await db.collection("wikis").insertOne(doc);
  return res.status(200).json({ ok: true, id: result.insertedId });
}
