export async function gerarQuiz(textoPdf) {
  try {
    const response = await fetch("https://rapid-glitter-31b1.lojaavello.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ texto: textoPdf })
    });

    if (!response.ok) {
      const erroTexto = await response.text();
      throw new Error(`Erro na resposta do Worker: ${erroTexto}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error("Resposta da IA incompleta ou mal formatada");
    }

    return data.choices[0].message.content;

  } catch (erro) {
    console.error("❌ Erro ao gerar quiz com IA:", erro);
    throw erro;
  }
}
