pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.min.js';

document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("pdf-file").files[0];
  const checkoutInput = document.getElementById("checkout").value;
  const status = document.getElementById("status");

  if (!file || file.type !== "application/pdf") {
    status.innerText = "Por favor, envie um arquivo PDF válido.";
    return;
  }

  if (!checkoutInput.startsWith("http")) {
    status.innerText = "Insira um link de checkout válido (com https://)";
    return;
  }

  status.innerText = "Lendo PDF...";

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

status.innerText = "Gerando quiz com IA...";
document.getElementById("ia-output").classList.remove("hidden");
document.getElementById("ia-output").innerText = "🔮 Processando...";
const quiz = await gerarQuizComIA(fullText, (linha) => {
  function digitarLinhaIA(texto) {
  const iaOutput = document.getElementById("ia-output");
  const bubble = document.createElement("div");
  bubble.classList.add("ia-line");
  iaOutput.appendChild(bubble);

  let i = 0;
  const speed = 20; // velocidade da digitação (ms por caractere)

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


});


    if (quiz) {
      localStorage.setItem("quizfunil_quiz", JSON.stringify(quiz));
      localStorage.setItem("quizfunil_checkout", checkoutInput);
      status.innerText = "Quiz gerado com sucesso! Redirecionando...";
      window.location.href = "quiz.html";
    } else {
      status.innerText = "Erro ao gerar o quiz. Tente com outro PDF.";
    }
  };

  reader.readAsArrayBuffer(file);
});
