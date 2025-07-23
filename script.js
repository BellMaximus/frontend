import { gerarQuizComIA } from './openai.js';

const inputPDF = document.getElementById('pdfInput');
const terminal = document.getElementById('terminal');
const erroContainer = document.getElementById('erro-container');
const erroTexto = document.getElementById('erro-texto');

inputPDF.addEventListener('change', async function () {
  const file = inputPDF.files[0];
  if (!file) return;

  terminal.innerHTML = '👩‍💻 Analisando conteúdo...';
  erroContainer.classList.add('hidden');

  const reader = new FileReader();
  reader.onload = async function () {
    const typedText = reader.result;
    try {
      typeLikeMachine('⏳ Gerando quiz baseado no conteúdo...', terminal, async () => {
        const quiz = await gerarQuizComIA(typedText);

        terminal.innerHTML = '<span style="color:#00ff99;">✅ Quiz gerado com sucesso!</span><br><pre>' + JSON.stringify(quiz, null, 2) + '</pre>';
      });
    } catch (err) {
      terminal.innerHTML = '<pre style="color:limegreen;">// ❌ ' + err.message + '</pre>🥲';
      erroTexto.textContent = err.message;
      erroContainer.classList.remove('hidden');
    }
  };
  reader.readAsText(file);
});

function typeLikeMachine(text, container, callback) {
  let i = 0;
  container.innerHTML = "";
  const interval = setInterval(() => {
    container.innerHTML += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 30);
}
