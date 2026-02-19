import { runRAG } from "../lib/rag.js";

export default async function handler(req, res) {
  try {
    const { message, image } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: "No input provided" });
    }

    const response = await runRAG(
      message || "Explain this image clearly.",
      image || null
    )

    res.status(200).json({ response })

  } catch (error) {
    console.error("API ERROR:", error);
    res.status(500).json({ error: "Error processing request." });
  }
}
