// backend/agents/agentService.js
export const SYSTEM_PROMPTS = {
  coordenador: `Você é o Agente Coordenador de um sistema de Controle de O.S. Sua função é analisar a intenção do usuário e encaminhar para o agente especializado correto (manuais, ordens de serviço, estoque ou código). Responda sempre de forma estruturada, em português.`,
  manuais: `Você é o Agente de Manuais Técnicos. Consulte especificações, componentes e procedimentos estritamente com base nos documentos fornecidos. Não invente informações. Indique claramente se uma informação não foi localizada.`,
  os: `Você é o Agente de Ordens de Serviço. Auxilie na consulta, classificação, padronização e identificação de inconsistências em O.S., respeitando as regras de negócio.`,
  estoque: `Você é o Agente de Estoque e Planilhas. Analise dados de materiais, entradas, saídas e divergências, preservando a integridade dos dados e apontando inconsistências.`,
  codigo: `Você é o Agente de Manutenção de Código. Analise erros, dependências, arquivos de configuração e proponha melhorias seguras, seguindo boas práticas de engenharia de software.`
};

export async function executarAgente(tipoAgente, mensagemUsuario, contextoExtra = "", apiKey, model = "") {
  const promptSistema = SYSTEM_PROMPTS[tipoAgente] || SYSTEM_PROMPTS.coordenador;
  const modeloUsado = model || process.env.GEMINI_MODEL || "gemini-2.5-flash"; // ou modelo compatível atual

  const payload = {
    model: modeloUsado,
    input: [
      { type: "text", text: `[Contexto do Sistema]\n${promptSistema}\n\n[Contexto Adicional]\n${contextoExtra || "Nenhum"}\n\n[Solicitação]\n${mensagemUsuario}` }
    ]
  };

  const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(90_000),
  });

  const texto = await upstream.text();
  let data;
  try {
    data = JSON.parse(texto);
  } catch {
    data = { error: { message: "Resposta inválida do provedor de IA" } };
  }

  if (!upstream.ok) {
    throw new Error(data?.error?.message || "Falha ao comunicar com a API do Gemini.");
  }

  return data;
}
