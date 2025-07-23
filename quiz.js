const quizRaw = localStorage.getItem("quizfunil_quiz");
const checkout = localStorage.getItem("quizfunil_checkout");

let perguntas = [];
let perguntaAtual = 0;

function renderQuiz() {
  const quizBox = document.getElementById("quiz-box");
  const finalBox = document.getElementById("final");
  const perguntaEl = document.getElementById("pergunta");
  const opcoesEl = document.getElementById("opcoes");
  const atualEl = document.getElementById("atual");
  const totalEl = document.getElementById("total");

  if (!quizRaw) {
    perguntaEl.innerText = "Erro: Nenhum quiz encontrado.";
    return;
  }

  try {
    const quizTexto = JSON.parse(quizRaw);
    perguntas = extrairPerguntas(quizTexto);

    if (!perguntas || perguntas.length === 0) {
      perguntaEl.innerText = "Erro ao interpretar o quiz gerado.";
      return;
    }

    totalEl.innerText = perguntas.length;
    mostrarPergunta();

  } catch (e) {
    perguntaEl.innerText = "Erro ao carregar o quiz.";
    console.error("Erro ao parsear o quiz:", e);
  }

  function mostrarPergunta() {
    const perguntaAtualObj = perguntas[perguntaAtual];
    atualEl.innerText = perguntaAtual + 1;
    perguntaEl.innerText = perguntaAtualObj.pergunta;
    opcoesEl.innerHTML = "";

    perguntaAtualObj.opcoes.forEach((op, idx) => {
      const btn = document.createElement("button");
      btn.innerText = op;
      btn.addEventListener("click", () => {
        if (idx === perguntaAtualObj.correta) {
          proximaPergunta();
        } else {
          alert("Ops! Resposta incorreta.");
        }
      });
      opcoesEl.appendChild(btn);
    });
  }

  function proximaPergunta() {
    perguntaAtual++;
    if (perguntaAtual < perguntas.length) {
      mostrarPergunta();
    } else {
      quizBox.classList.add("hidden");
      finalBox.classList.remove("hidden");
      document.getElementById("btn-checkout").href = checkout || "#";
    }
  }
}

function extrairPerguntas(texto) {
  const blocos = texto.split(/Pergunta\s*\d+:/i).filter(Boolean);
  const perguntasFormatadas = [];

  blocos.forEach((bloco) => {
    const linhas = bloco.trim().split("\n").filter(l => l.trim() !== "");
    const pergunta = linhas[0];

    const opcoes = linhas.slice(1, 5).map((linha) =>
      linha.replace(/^[A-D]\)\s*/, "").trim()
    );

    const respostaLinha = linhas.find((l) =>
      l.toLowerCase().includes("resposta correta")
    );

    let correta = 0;
    if (respostaLinha) {
      const letra = respostaLinha.match(/[A-D]/i);
      if (letra) {
        correta = "ABCD".indexOf(letra[0].toUpperCase());
      }
    }

    if (pergunta && opcoes.length === 4) {
      perguntasFormatadas.push({
        pergunta,
        opcoes,
        correta
      });
    }
  });

  return perguntasFormatadas;
}

renderQuiz();
