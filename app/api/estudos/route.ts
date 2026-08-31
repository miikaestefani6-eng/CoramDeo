import { NextRequest, NextResponse } from "next/server";

const layers = [
  ["Evidências", "Visão geral do livro"],
  ["Evidências", "Contexto do texto"],
  ["Evidências", "Contexto histórico-cultural"],
  ["Evidências", "Linha do tempo"],
  ["Evidências", "Línguas bíblicas"],
  ["Evidências", "Arqueologia"],
  ["Evidências", "Fontes e evidências"],
  ["Interpretação", "Aplicação"],
  ["Interpretação", "Análise literária"],
  ["Interpretação", "Contexto histórico e profético"],
  ["Interpretação", "Escatologia"],
  ["Interpretação", "Conexões bíblicas"],
  ["Interpretação", "Teologia"],
  ["Tradição", "Camadas do texto"],
  ["Tradição", "Tradição judaica"],
  ["Tradição", "Interpretação histórica"],
];

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query?.trim()) {
    return NextResponse.json({ error: "Informe uma passagem, personagem, acontecimento ou tema." }, { status: 400 });
  }

  const normalizedQuery = normalize(query);

  // V1: contrato da API preparado para o cache de estudos.
  // A camada de persistência/IA entra sem alterar o contrato consumido pela UI.
  return NextResponse.json({
    query: query.trim(),
    normalizedQuery,
    status: "ready",
    source: "study-engine",
    cached: false,
    layers: layers.map(([group, title], index) => ({
      number: index + 1,
      group,
      title,
      content: `Conteúdo da camada ${index + 1} para ${query.trim()} será preenchido pelo mecanismo de estudo.`,
    })),
  });
}
