async function gerarQuiz(promptGerado) {
  try {
    const response = await fetch("https://SEU-NOME.usuario.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Você é uma IA que gera quizzes baseados em PDFs ou e-books de marketing. Crie perguntas com 4 opções e destaque a correta."
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
      const erro = await response.text();
      throw new Error("Erro: " + erro);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.choices[0].message.content;

  } catch (erro) {
    console.error("Erro ao gerar quiz:", erro);
    throw erro;
  }
}
