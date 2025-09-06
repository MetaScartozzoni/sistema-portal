export async function getPrices(input: { procedure?: string; convenio?: string; }) {
  // TODO: consultar tabela oficial; retorno placeholder
  const tabela = [
    { procedure: "Consulta", price: 300 },
    { procedure: "Retorno", price: 180 }
  ];
  return { ok: true, items: tabela };
}
