export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { title, category, content } = req.body;
  const webhookURL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK;

  if (!title || !category || !content) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  // Sanitiza para evitar pings
  const sanitize = (text) =>
    text
      .replace(/@everyone/gi, "@\u200beveryone")
      .replace(/@here/gi, "@\u200bhere");

  const payload = {
    username: "WikiBot",
    embeds: [
      {
        title: sanitize(title),
        description: sanitize(content),
        fields: [{ name: "Categoria", value: category }],
        color: 0x00ff00,
      },
    ],
    components: [
      {
        type: 1,
        components: [
          { type: 2, label: "Aprovar", style: 3, custom_id: `approve_${Date.now()}` },
          { type: 2, label: "Reprovar", style: 4, custom_id: `reject_${Date.now()}` },
        ],
      },
    ],
  };

  try {
    const r = await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!r.ok) throw new Error("Erro ao enviar para Discord");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Falha ao enviar" });
  }
}
