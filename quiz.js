// Simulação do quiz gerado via OpenAI
const quiz = JSON.parse(localStorage.getItem("quizfunil_quiz"));
const linkCheckout = localStorage.getItem("quizfunil_checkout") || "https://suacheckout.com";

let index = 0;

document.getElementById("total").innerText = quiz.length;

function renderQuiz() {
  if (index >= quiz.length) {
    document.getElementById("quiz-box").classList.add("hidden");
    document.getElementById("final").classList.remove("hidden");
    document.getElementById("btn-checkout").href = linkCheckout;
    return;
  }

  const q = quiz[index];
  document.getElementById("atual").innerText = index + 1;
  document.getElementById("pergunta").innerText = q.pergunta;

  const opcoesBox = document.getElementById("opcoes");
  opcoesBox.innerHTML = "";

  q.opcoes.forEach((op, i) => {
    const btn = document.createElement("button");
    btn.innerText = op;
    btn.onclick = () => {
      index++;
      renderQuiz();
    };
    opcoesBox.appendChild(btn);
  });
}

renderQuiz();

