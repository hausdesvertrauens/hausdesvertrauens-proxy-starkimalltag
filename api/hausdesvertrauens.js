export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt" });
  }

  const input = req.body.input || "";
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "Fehlender API-Key auf Server" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Du bist die Stimme von 'Haus des Vertrauens' – ruhig, empathisch, motivierend. Antworte mit einem Zitat bekannter Persönlichkeiten und einer reflektierten 'Haus des Vertrauens'-Botschaft."
          },
          { role: "user", content: `Das beschäftigt mich: ${input}` }
        ],
        max_tokens: 180,
        temperature: 0.9
      })
    });

    const data = await response.json();
    res.status(200).json({ response: data.choices?.[0]?.message?.content });
  } catch (err) {
    res.status(500).json({ error: "Fehler bei der KI-Verbindung", details: err.message });
  }
}
