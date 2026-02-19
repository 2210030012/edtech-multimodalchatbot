import Groq from "groq-sdk";
import Tesseract from "tesseract.js";
import fs from "fs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Load knowledge base (RAG)
let knowledgeBase = [];

try {
  const data = fs.readFileSync("./data/knowledge.json", "utf-8");
  knowledgeBase = JSON.parse(data);
} catch (err) {
  console.error("Knowledge load error:", err);
}

// Simple keyword retrieval
function retrieveContext(query) {
  if (!query) return null;

  const lowerQuery = query.toLowerCase();

  const match = knowledgeBase.find(item =>
    item.content.toLowerCase().includes(lowerQuery)
  );

  return match ? match.content : null;
}

export async function runRAG(message, image) {
  try {

    let finalPrompt = message;

    // 🖼 IMAGE MODE → OCR
    if (image) {
      const {
        data: { text }
      } = await Tesseract.recognize(image, "eng");

      finalPrompt = `
The user uploaded a diagram or roadmap image.

Extracted visible text from the image:
${text}

User question:
${message || "Explain this image clearly."}

Explain the structure, topics, and relationships clearly using headings and bullet points.
`;
    }

    // 📚 RAG for text mode
    const retrievedContext = retrieveContext(message);

    if (retrievedContext && !image) {
      finalPrompt = `
Use this academic context:

${retrievedContext}

Question:
${message}
`;
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are EduAI, an academic assistant. Explain clearly using headings and bullet points."
        },
        {
          role: "user",
          content: finalPrompt
        }
      ],
      temperature: 0.6,
      max_tokens: 1200
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("Groq API Error:", error);
    return "⚠️ Error generating response.";
  }
}
