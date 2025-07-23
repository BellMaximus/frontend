const OPENAI_KEY = "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";

async function gerarQuizComIA(conteudoPDF, onLinhaGerada = () => {}) {
  const prompt = `
Aja como um gerador de quiz. Responda estritamente em JSON.

Gere de 3 a 7 perguntas com 4 opções cada, baseadas no conteúdo abaixo. A estrutura deve ser exatamente esta:

[
  {
    "pergunta": "Texto da pergunta",
    "opcoes": ["opção A", "opção B", "opção C", "opção D"],
    "resposta": "Texto da resposta correta"
  }
]

Não adicione nenhum texto antes ou depois do JSON. Apenas retorne o JSON limpo, sem explicações.

Conteúdo base:
"""
${conteudoPDF.slice(0, 4000)}
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

    // limpar texto fora do JSON, se houver
    let limpo = full.trim();
    const match = limpo.match(/\[.*\]/s);
    if (match) limpo = match[0];

    const parsedJSON = JSON.parse(limpo);
    return parsedJSON;
  } catch (e) {
    terminalTyping("// Erro ao gerar JSON válido 😢\n\n" + full);
    return null;
  }
}
