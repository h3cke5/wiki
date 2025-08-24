import { getDB } from "../../../lib/db";

const CATEGORIES = ["DJs", "BDFD", "AOI", "HTML"];

function sanitize(text = "") {
  return String(text)
    .replace(/@everyone/gi, "@\u200beveryone")
    .replace(/@here/gi, "@\u200bhere");
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Método não permitido" });

  const { title, category, content, author = "" } = req.body || {};

  if (!title || !category || !content)
    return res.status(400).json({ ok: false, error: "Campos obrigatórios" });

  if (!CATEGORIES.includes(category))
    return res.status(400).json({ ok: false, error: "Categoria inválida" });

  const db = await getDB();
  const now = new Date();

  const doc = {
    title: sanitize(title.trim()),
    category,
    content: sanitize(content.trim()),
    author: sanitize(author.trim()) || "Anônimo",
    status: "pending",
    createdAt: now,
    updatedAt: now,
    slug: null,
  };

  const result = await db.collection("wikis").insertOne(doc);
  res.status(200).json({ ok: true, id: result.insertedId });
}
