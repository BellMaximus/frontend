const OPENAI_KEY = "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";

async function gerarQuizComIA(conteudoPDF, onLinhaGerada = () => {}) {
  const prompt = `
Você é um gerador de quiz automático. Sua única função é retornar um ARRAY JSON puro.

Baseado no conteúdo abaixo, gere de 3 a 7 perguntas no seguinte formato JSON:

[
  {
    "pergunta": "Qual é o objetivo principal do conteúdo?",
    "opcoes": ["Opção A", "Opção B", "Opção C", "Opção D"],
    "resposta": "Opção correta"
  }
]

⚠️ IMPORTANTE: NÃO escreva nada antes ou depois do JSON. NÃO explique. NÃO use markdown. Apenas retorne o JSON válido.

Conteúdo base:
"""
${conteudoPDF.slice(0, 3500)}
"""
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      stream: true,
      temperature: 0.4,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let full = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter(line => line.trim().startsWith("data: "));

    for (const line of lines) {
      const jsonStr = line.replace("data: ", "").trim();
      if (jsonStr === "[DONE]") break;

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          full += content;
          onLinhaGerada(content);
        }
      } catch (e) {
        console.error("Erro parseando stream:", e);
      }
    }
  }

  try {
    terminalTyping(full);

    let limpo = full.trim();

    // regex para extrair apenas o conteúdo entre colchetes (array JSON)
    const match = limpo.match(/\[\s*{[^]*?}\s*]/s);
    if (match) limpo = match[0];

    const parsedJSON = JSON.parse(limpo);
    return parsedJSON;
  } catch (e) {
    terminalTyping("// ❌ Erro ao gerar JSON válido 😢\n\n" + full);
    mostrarErro("A IA respondeu, mas não conseguimos converter a resposta para JSON. Tente novamente ou envie outro PDF.");
    return null;
  }
}
