import { getDB } from "../../../lib/db";

const CATEGORIES = ["DJs", "BDFD", "AOI", "HTML"];

function sanitize(text = "") {
  return String(text)
    .replace(/@everyone/gi, "@\u200beveryone")
    .replace(/@here/gi, "@\u200bhere");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método não permitido" });
  }

  const { title, category, content, author = "" } = req.body || {};

  // valida campos obrigatórios
  if (!title || !category || !content) {
    return res
      .status(400)
      .json({ ok: false, error: "Campos obrigatórios: title, category, content" });
  }

  // valida categoria
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({
      ok: false,
      error: `Categoria inválida. Use apenas: ${CATEGORIES.join(", ")}`
    });
  }

  const db = await getDB();
  const now = new Date();

  const doc = {
    title: sanitize(title.trim()),
    category,
    content: sanitize(content.trim()),
    author: sanitize(author.trim()) || "Anônimo",
    status: "pending", // pending | approved | rejected
    createdAt: now,
    updatedAt: now,
    slug: null // será gerado após aprovação
  };

  const result = await db.collection("wikis").insertOne(doc);

  return res.status(200).json({
    ok: true,
    id: result.insertedId,
    message: "Wiki enviada para revisão"
  });
}
