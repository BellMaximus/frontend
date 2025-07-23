// openai.js

export async function gerarQuiz(promptGerado) {
  try {
    const response = await fetch("https://seu-nome.usuario.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
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

    if (!response.ok) {
      const erroTexto = await response.text();
      throw new Error(`Erro na resposta do Worker: ${erroTexto}`);
    }

    const data = await response.json();

    // Se retornar erro da IA, trata aqui
    if (data.error) {
      throw new Error(data.error.message || "Erro desconhecido da IA");
    }

    // Retorna a mensagem gerada pela IA
    return data.choices[0].message.content;

  } catch (erro) {
    console.error("❌ Erro ao gerar quiz com IA:", erro);
    throw erro;
  }
}
