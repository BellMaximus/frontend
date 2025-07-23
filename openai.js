const OPENAI_KEY = "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";

async function gerarQuizComIA(conteudoPDF) {
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
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  const texto = data.choices?.[0]?.message?.content || "";

  try {
    const quiz = JSON.parse(texto);
    return quiz;
  } catch (e) {
    console.error("Erro ao converter para JSON:", texto);
    return null;
  }
}
