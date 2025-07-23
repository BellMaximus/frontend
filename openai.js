const OPENAI_KEY = "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"; // <- coloque aqui sua chave da OpenAI

async function gerarQuizComIA(conteudoPDF) {
  const prompt = `
Você é um gerador de quizzes de marketing. Crie de 3 a 7 perguntas objetivas com 4 alternativas cada, com base no conteúdo abaixo. O foco é transformar esse PDF em um quiz interativo que leve o usuário a refletir e ter vontade de comprar algo no final.

Formato: JSON com perguntas, opções e resposta correta.

Conteúdo base:
"""
${conteudoPDF.slice(0, 4000)}  // limitamos para não ultrapassar o token
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
  const texto = data.choices[0].message.content;

  try {
    const quiz = JSON.parse(texto);
    return quiz;
  } catch (e) {
    alert("Erro ao processar o quiz. Tente com outro PDF.");
    console.error("Erro ao converter para JSON:", texto);
    return null;
  }
}
