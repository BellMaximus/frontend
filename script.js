pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.min.js';

document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("pdf-file").files[0];
  const status = document.getElementById("status");

  if (!file || file.type !== "application/pdf") {
    status.innerText = "Por favor, envie um arquivo PDF válido.";
    return;
  }

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

    console.log("PDF extraído:", fullText);
    status.innerText = "PDF lido com sucesso! Agora vamos gerar o quiz com IA.";

 // após extrair fullText:
const quiz = await gerarQuizComIA(fullText);

if (quiz) {
  console.log("Quiz gerado:", quiz);
  status.innerText = "Quiz gerado com sucesso!";
  // aqui podemos redirecionar para a etapa do quiz

  if (quiz) {
  localStorage.setItem("quizfunil_quiz", JSON.stringify(quiz));
  localStorage.setItem("quizfunil_checkout", "https://quizpdf.vercel.app/"); // ou você define dinamicamente depois

  // redireciona para o quiz
  window.location.href = "quiz.html";
}

}

  };

  reader.readAsArrayBuffer(file);
});
