const quiz = JSON.parse(localStorage.getItem("quizfunil_quiz"));
const checkout = localStorage.getItem("quizfunil_checkout");

function renderQuiz(quiz) {
  if (!quiz || !quiz.perguntas || !Array.isArray(quiz.perguntas)) {
    alert("❌ Erro ao carregar o quiz. Gere novamente o PDF.");
    document.getElementById("quiz-box").innerHTML = "<p>Erro ao carregar o quiz.</p>";
    return;
  }

  let perguntaAtual = 0;
  const total = quiz.perguntas.length;
  const perguntaEl = document.getElementById("pergunta");
  const opcoesEl = document.getElementById("opcoes");
  const progressoEl = document.getElementById("progresso");
  const atualEl = document.getElementById("atual");
  const totalEl = document.getElementById("total");

  totalEl.textContent = total;

  function mostrarPergunta(index) {
    const atual = quiz.perguntas[index];
    perguntaEl.textContent = atual.pergunta;
    atualEl.textContent = index + 1;
    opcoesEl.innerHTML = "";

    atual.alternativas.forEach((alt, i) => {
      const btn = document.createElement("button");
      btn.classList.add("opcao");
      btn.textContent = alt;
      btn.onclick = () => {
        if (alt.includes(atual.correta)) {
          btn.classList.add("correta");
        } else {
          btn.classList.add("errada");
        }

        setTimeout(() => {
          if (index + 1 < total) {
            mostrarPergunta(index + 1);
          } else {
            document.getElementById("quiz-box").classList.add("hidden");
            document.getElementById("final").classList.remove("hidden");
            if (checkout) {
              document.getElementById("btn-checkout").href = checkout;
            }
          }
        }, 800);
      };
      opcoesEl.appendChild(btn);
    });
  }

  mostrarPergunta(perguntaAtual);
}

// Início do carregamento do quiz
renderQuiz(quiz);
