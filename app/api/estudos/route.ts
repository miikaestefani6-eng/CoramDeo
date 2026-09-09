import { NextRequest, NextResponse } from "next/server";
import { requireCoramAccess } from "@/lib/access";

const layers = [
  ["Evidências", "Visão geral do livro"], ["Evidências", "Contexto do texto"], ["Evidências", "Contexto histórico-cultural"], ["Evidências", "Linha do tempo"], ["Evidências", "Línguas bíblicas"], ["Evidências", "Arqueologia"], ["Evidências", "Fontes e evidências"],
  ["Interpretação", "Aplicação"], ["Interpretação", "Análise literária"], ["Interpretação", "Contexto histórico e profético"], ["Interpretação", "Escatologia"], ["Interpretação", "Conexões bíblicas"], ["Interpretação", "Teologia"],
  ["Tradição", "Camadas do texto"], ["Tradição", "Tradição judaica"], ["Tradição", "Interpretação histórica"],
];

function normalize(value: string) { return value.trim().toLowerCase().replace(/\s+/g, " "); }

export async function GET(request: NextRequest) {
  const access = await requireCoramAccess();
  if (access.status === 401) return NextResponse.json({ error: "Entre na sua conta para acessar os estudos." }, { status: 401 });
  if (access.status === 402) return NextResponse.json({ error: "Sua assinatura do Coram Deo está inativa." }, { status: 402 });

  const query = request.nextUrl.searchParams.get("q");
  if (!query?.trim()) return NextResponse.json({ error: "Informe uma passagem, personagem, acontecimento ou tema." }, { status: 400 });
  const normalizedQuery = normalize(query);

  const cache = globalThis as typeof globalThis & { __coramStudyCache?: Map<string, unknown> };
  cache.__coramStudyCache ??= new Map();
  const existing = cache.__coramStudyCache.get(normalizedQuery);
  if (existing) return NextResponse.json({ ...(existing as object), cached: true });

  const result = {
    query: query.trim(), normalizedQuery, status: "ready", source: "study-engine", cached: false,
    layers: layers.map(([group, title], index) => ({ number: index + 1, group, title, content: `Conteúdo da camada ${index + 1} para ${query.trim()} será preenchido pelo mecanismo de estudo.` })),
  };
  cache.__coramStudyCache.set(normalizedQuery, result);
  return NextResponse.json(result);
}
