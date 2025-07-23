pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.min.js';

let textoExtraidoGlobal = "";
let checkoutGlobal = "";

document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("pdf-file").files[0];
  const checkoutInput = document.getElementById("checkout").value;
  const status = document.getElementById("status");
  const iaBox = document.getElementById("ia-output");

  if (!file || file.type !== "application/pdf") {
    status.innerText = "Por favor, envie um arquivo PDF válido.";
    return;
  }

  if (!checkoutInput.startsWith("http")) {
    status.innerText = "Insira um link de checkout válido (com https://)";
    return;
  }

  status.innerText = "Lendo PDF...";
  iaBox.innerHTML = "";
  iaBox.classList.remove("hidden");
  document.getElementById("terminal-output").classList.add("hidden");
  document.getElementById("error-box").classList.add("hidden");

  const reader = new FileReader();

  reader.onload = async function () {
    const typedarray = new Uint8Array(reader.result);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;

    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str).join(" ");
      fullText += `\n\n[Página ${pageNum}]\n${strings}`;
    }

    textoExtraidoGlobal = fullText;
    checkoutGlobal = checkoutInput;

    status.innerText = "Gerando quiz com IA...";
    digitarLinhaIA("🔮 Analisando conteúdo...");

    try {
      const respostaIA = await gerarQuiz(fullText);
      const quiz = converterTextoParaQuiz(respostaIA);

      if (quiz.perguntas.length === 0) throw new Error("Quiz vazio.");

      localStorage.setItem("quizfunil_quiz", JSON.stringify(quiz));
      localStorage.setItem("quizfunil_checkout", checkoutInput);
      status.innerText = "Quiz gerado com sucesso! Redirecionando...";
      window.location.href = "quiz.html";
    } catch (erro) {
      status.innerText = "Erro ao gerar quiz.";
      mostrarErro("A IA não conseguiu gerar um quiz válido a partir do seu PDF. Você pode tentar novamente.");
    }
  };

  reader.readAsArrayBuffer(file);
});

function digitarLinhaIA(texto) {
  const iaOutput = document.getElementById("ia-output");
  const bubble = document.createElement("div");
  bubble.classList.add("ia-line");
  iaOutput.appendChild(bubble);

  let i = 0;
  const speed = 20;

  function digita() {
    if (i < texto.length) {
      bubble.textContent += texto.charAt(i);
      i++;
      setTimeout(digita, speed);
    } else {
      iaOutput.scrollTop = iaOutput.scrollHeight;
    }
  }

  digita();
}

function terminalTyping(texto) {
  const terminal = document.getElementById("terminal-output");
  terminal.classList.remove("hidden");
  terminal.innerHTML = "";
  let i = 0;
  const speed = 5;

  function digita() {
    if (i < texto.length) {
      terminal.innerHTML += texto.charAt(i);
      i++;
      terminal.scrollTop = terminal.scrollHeight;
      setTimeout(digita, speed);
    }
  }

  digita();
}

function mostrarErro(msg) {
  const box = document.getElementById("error-box");
  const txt = document.getElementById("error-msg");
  txt.innerText = msg;
  box.classList.remove("hidden");
}

async function tentarNovamente() {
  const status = document.getElementById("status");
  document.getElementById("error-box").classList.add("hidden");
  document.getElementById("terminal-output").classList.add("hidden");
  document.getElementById("terminal-output").innerText = "";
  document.getElementById("ia-output").innerText = "";

  status.innerText = "Tentando novamente...";
  digitarLinhaIA("🔁 Gerando novamente...");

  try {
    const respostaIA = await gerarQuiz(textoExtraidoGlobal);
    const quiz = converterTextoParaQuiz(respostaIA);

    if (quiz.perguntas.length === 0) throw new Error("Quiz vazio.");

    localStorage.setItem("quizfunil_quiz", JSON.stringify(quiz));
    localStorage.setItem("quizfunil_checkout", checkoutGlobal);
    status.innerText = "Quiz gerado com sucesso! Redirecionando...";
    window.location.href = "quiz.html";
  } catch (erro) {
    status.innerText = "Erro ao tentar novamente.";
    mostrarErro("Mesmo após tentar novamente, a IA não conseguiu gerar um quiz válido. Tente outro PDF ou revise o conteúdo.");
  }
}

function converterTextoParaQuiz(texto) {
  const perguntas = [];
  const blocos = texto.split(/\n{2,}/); // separa blocos por quebra dupla de linha

  blocos.forEach(bloco => {
    const linhas = bloco.split("\n").filter(l => l.trim() !== "");
    if (linhas.length < 2) return;

    const perguntaLinha = linhas.find(l => /^[0-9]+[)\.-]/.test(l.trim()) || l.trim().endsWith("?") || l.toLowerCase().includes("pergunta"));
    if (!perguntaLinha) return;

    const pergunta = perguntaLinha.replace(/^[0-9]+[)\.-]\s*/, "").trim();

    const alternativas = linhas
      .filter(l => /^[a-dA-D][)\.-]/.test(l.trim()))
      .map(l => l.replace(/^[a-dA-D][)\.-]\s*/, "").trim());

    const respostaCertaLinha = linhas.find(l => /resposta correta/i.test(l));
    let correta = "";
    if (respostaCertaLinha) {
      const letra = respostaCertaLinha.match(/[a-dA-D]/);
      if (letra) {
        const idx = letra[0].toLowerCase().charCodeAt(0) - 97;
        correta = alternativas[idx] || "";
      }
    }

    if (pergunta && alternativas.length >= 2 && correta) {
      perguntas.push({ pergunta, alternativas, correta });
    }
  });

  return { perguntas };
}
