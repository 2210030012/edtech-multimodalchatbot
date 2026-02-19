import { runRAG } from "./rag.js";

export async function handleRequest({ message, history, image }) {
  return await runRAG(message, image, history);
}
