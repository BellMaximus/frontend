const OPENAI_KEY = "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";

async function gerarQuizComIA(conteudoPDF, onLinhaGerada = () => {}) {
  const prompt = `
Você é um gerador de quizzes com foco em marketing. Com base no conteúdo abaixo (vindo de um eBook ou PDF), crie um quiz com entre 3 e 7 perguntas de múltipla escolha, com 4 opções cada, que engajem o usuário e o preparem para uma oferta no final.

Formato de resposta desejado: JSON no seguinte formato:

[
  {
    "pergunta": "Texto da pergunta",
    "opcoes": ["opção A", "opção B", "opção C", "opção D"],
    "resposta": "opção correta"
  },
  ...
]

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
  terminalTyping(full); // mostra JSON sendo digitado em tempo real
  const parsedJSON = JSON.parse(full);
  return parsedJSON;
} catch (e) {
  terminalTyping("// Erro ao gerar JSON válido 😢\n" + full);
  return null;
}

}
