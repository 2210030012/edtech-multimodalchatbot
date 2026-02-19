// Convert text into simple term-frequency vector
export function textToVector(text) {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);

  const vector = {};

  words.forEach(word => {
    vector[word] = (vector[word] || 0) + 1;
  });

  return vector;
}

// Cosine similarity
export function cosineSimilarity(vecA, vecB) {
  const allWords = new Set([
    ...Object.keys(vecA),
    ...Object.keys(vecB)
  ]);

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  allWords.forEach(word => {
    const a = vecA[word] || 0;
    const b = vecB[word] || 0;

    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  });

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (normA * normB);
}
