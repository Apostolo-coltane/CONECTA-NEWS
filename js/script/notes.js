/* ==========================================
   Conecta News 1.0 - notes.js
   Bloco de anotações
   ========================================== */

const notasKey = "conectaNewsNotas";

function carregarNotas() {
  try {
    const notasSalvas = localStorage.getItem(notasKey);
    return notasSalvas ? JSON.parse(notasSalvas) : [];
  } catch (error) {
    console.warn("Notas inválidas no localStorage. Limpando lista.", error);
    localStorage.removeItem(notasKey);
    return [];
  }
}

function salvarNotas(notas) {
  localStorage.setItem(notasKey, JSON.stringify(notas));
}

function escaparNotaHTML(valor) {
  if (typeof escaparHTML === "function") {
    return escaparHTML(valor);
  }

  return String(valor || "").replace(/[&<>'"]/g, caractere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[caractere]));
}

function renderizarNotas() {
  const listaNotas = document.getElementById("listaNotas");
  if (!listaNotas) return;

  listaNotas.innerHTML = "";
  const notas = carregarNotas();

  if (notas.length === 0) {
    listaNotas.innerHTML = "<p>Nenhuma nota criada ainda.</p>";
    return;
  }

  notas.forEach((nota, index) => {
    const notaDiv = document.createElement("div");
    notaDiv.classList.add("nota-card");
    notaDiv.innerHTML = `
      <h3>${escaparNotaHTML(nota.titulo)}</h3>
      <p>${escaparNotaHTML(nota.conteudo)}</p>
      <span class="categoria ${escaparNotaHTML(nota.categoria).toLowerCase()}">${escaparNotaHTML(nota.categoria)}</span>
      <div class="nota-acoes">
        <button type="button" onclick="editarNota(${index})">Editar</button>
        <button type="button" onclick="excluirNota(${index})">Excluir</button>
      </div>
    `;
    listaNotas.appendChild(notaDiv);
  });
}

function novaNota() {
  const titulo = prompt("Digite o título da nota:");
  if (!titulo) return;

  const conteudo = prompt("Digite o conteúdo da nota:");
  if (!conteudo) return;

  const categoria = prompt("Escolha a categoria (Família, Trabalho, Lazer, Outros):", "Outros");
  if (!categoria) return;

  const notas = carregarNotas();
  notas.push({ titulo, conteudo, categoria });
  salvarNotas(notas);
  renderizarNotas();
}

function editarNota(index) {
  const notas = carregarNotas();
  const nota = notas[index];
  if (!nota) return;

  const novoTitulo = prompt("Editar título:", nota.titulo);
  const novoConteudo = prompt("Editar conteúdo:", nota.conteudo);
  const novaCategoria = prompt("Editar categoria:", nota.categoria);

  notas[index] = {
    titulo: novoTitulo || nota.titulo,
    conteudo: novoConteudo || nota.conteudo,
    categoria: novaCategoria || nota.categoria
  };

  salvarNotas(notas);
  renderizarNotas();
}

function excluirNota(index) {
  const notas = carregarNotas();
  notas.splice(index, 1);
  salvarNotas(notas);
  renderizarNotas();
}

document.addEventListener("DOMContentLoaded", () => {
  const btnNovaNota = document.getElementById("novaNota");
  if (btnNovaNota) {
    btnNovaNota.addEventListener("click", novaNota);
  }
  renderizarNotas();
});
