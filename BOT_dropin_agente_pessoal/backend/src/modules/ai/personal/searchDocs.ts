export async function searchDocs(input: { query: string }) {
  // TODO: conectar com seu índice (vector/RAG) — aqui é placeholder
  return { ok: true, results: [{ title: "Exemplo", snippet: "Resultado fictício para: " + input.query }] };
}
