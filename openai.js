export async function gerarQuiz(prompt) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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",
        "HTTP-Referer": "https://quizpdf.vercel.app", // opcional
        "X-Title": "QuizFunil" // opcional
      },
      body: JSON.stringify({
        model: "tngtech/deepseek-r1t2-chimera:free",
        messages: [
          {
            role: "system",
            content: "Você é uma IA que gera quizzes com base em e-books, PDFs ou conteúdos de marketing. Sempre gere perguntas com alternativas A, B, C e D, com uma resposta correta clara. Use o padrão:\n\nPergunta 1:\n...\nA) ...\nB) ...\nC) ...\nD) ...\nResposta correta: ..."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const erroTexto = await response.text();
      throw new Error(`Erro na resposta do OpenRouter: ${erroTexto}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "Erro desconhecido da IA.");
    }

    return data.choices[0].message.content;

  } catch (erro) {
    console.error("❌ Erro ao gerar quiz com IA:", erro);
    throw erro;
  }
}
