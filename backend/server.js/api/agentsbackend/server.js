// Adicione a importação do serviço de agentes (se modularizado) ou incorpore a lógica:
import { executarAgente } from "./agents/agentService.js";

// Novo Schema para os Agentes
const AgentInputSchema = z.object({
  agent: z.enum(["coordenador", "manuais", "os", "estoque", "codigo"]),
  message: z.string().min(1).max(12000),
  context: z.string().max(20000).optional(),
});

app.post("/api/agents", async (req, res, next) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(503).json({ error: { code: "AI_NOT_CONFIGURED", message: "IA não configurada no servidor." } });
    }
    const parsed = AgentInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: { code: "INVALID_INPUT", message: "Parâmetros inválidos para o agente." } });
    }

    const { agent, message, context } = parsed.data;
    const respostaIA = await executarAgente(agent, message, context, GEMINI_API_KEY, GEMINI_MODEL);
    
    return res.status(200).json(respostaIA);
  } catch (err) {
    return next(err);
  }
});
