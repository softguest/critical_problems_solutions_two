// lib/similarity.ts
export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}


// export function cosineSimilarity(vecA: number[], vecB: number[]): number {
//   if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length) {
//     console.warn("Invalid vectors for similarity comparison", { vecA, vecB });
//     return 0;
//   }

//   const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
//   const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
//   const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
//   return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
// }

