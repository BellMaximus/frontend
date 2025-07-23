export async function gerarQuiz(promptGerado) {
  try {
    const response = await fetch("https://rapid-glitter-31b1.lojaavello.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "Você é uma IA que gera quizzes com base em e-books, PDFs ou conteúdos de marketing. Sempre gere perguntas com alternativas A, B, C e D, com uma resposta correta clara."
          },
          {
            role: "user",
            content: promptGerado
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error("Erro ao gerar quiz:", err);
    throw err;
  }
}
