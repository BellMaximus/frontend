document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("pdf-file").files[0];
  if (!file) return;

  const status = document.getElementById("status");
  status.innerText = "Enviando PDF...";

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://SEU_BACKEND_URL", {
    method: "POST",
    body: formData,
  });

  const result = await res.text();
  status.innerText = result;
});
