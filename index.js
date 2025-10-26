import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // geschützt über Vercel

app.post("/api/hausdesvertrauens", async (req, res) => {
  const userInput = req.body.input || "";

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
              "Du bist die Stimme von 'Haus des Vertrauens' – ruhig, empathisch, motivierend, menschlich. Antworte mit einem Zitat bekannter Persönlichkeiten und einer reflektierten 'Haus des Vertrauens'-Botschaft."
          },
          { role: "user", content: `Das beschäftigt mich: ${userInput}` }
        ],
        max_tokens: 180,
        temperature: 0.9
      })
    });

    const data = await response.json();
    res.json({ response: data.choices?.[0]?.message?.content });
  } catch (error) {
    res.status(500).json({ error: "Fehler bei der KI-Verbindung" });
  }
});

app.listen(3000, () => console.log("Proxy läuft auf Port 3000 🚀"));
