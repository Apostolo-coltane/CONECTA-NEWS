/* ==========================================
   Conecta News 1.0 - agenda.js
   Agenda diária com compromissos por data e horário
   ========================================== */

const compromissosKey = "conectaNewsCompromissos";

function carregarCompromissos() {
  try {
    const compromissosSalvos = localStorage.getItem(compromissosKey);
    return compromissosSalvos ? JSON.parse(compromissosSalvos) : [];
  } catch (error) {
    console.warn("Compromissos inválidos no localStorage. Limpando lista.", error);
    localStorage.removeItem(compromissosKey);
    return [];
  }
}

function salvarCompromissos(compromissos) {
  localStorage.setItem(compromissosKey, JSON.stringify(compromissos));
}

function dataHojeISO() {
  return new Date().toISOString().slice(0, 10);
}

function escaparHTML(valor) {
  return String(valor || "").replace(/[&<>'"]/g, caractere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[caractere]));
}

function renderizarCompromissos() {
  const listaCompromissos = document.getElementById("listaCompromissos");
  if (!listaCompromissos) return;

  listaCompromissos.innerHTML = "";
  const compromissos = carregarCompromissos();

  if (compromissos.length === 0) {
    listaCompromissos.innerHTML = "<p>Nenhum compromisso criado ainda.</p>";
    return;
  }

  compromissos
    .map((compromisso, indexOriginal) => ({ ...compromisso, indexOriginal }))
    .sort((a, b) => `${a.data || "9999-99-99"} ${a.horario || ""}`.localeCompare(`${b.data || "9999-99-99"} ${b.horario || ""}`))
    .forEach(comp => {
      const compDiv = document.createElement("div");
      compDiv.classList.add("compromisso-card");
      compDiv.innerHTML = `
        <h3>${escaparHTML(comp.titulo)}</h3>
        <p><strong>Data:</strong> ${escaparHTML(comp.data || dataHojeISO())}</p>
        <p><strong>Horário:</strong> ${escaparHTML(comp.horario)}</p>
        <span class="categoria ${escaparHTML(comp.categoria).toLowerCase()}">${escaparHTML(comp.categoria)}</span>
        <div class="compromisso-acoes">
          <button type="button" onclick="editarCompromisso(${comp.indexOriginal})">Editar</button>
          <button type="button" onclick="excluirCompromisso(${comp.indexOriginal})">Excluir</button>
        </div>
      `;
      listaCompromissos.appendChild(compDiv);
    });
}

function novoCompromisso() {
  const titulo = prompt("Digite o título do compromisso:");
  if (!titulo) return;

  const data = prompt("Digite a data (AAAA-MM-DD):", dataHojeISO());
  if (!data) return;

  const horario = prompt("Digite o horário (HH:MM):", "09:00");
  if (!horario) return;

  const categoria = prompt("Escolha a categoria (Família, Trabalho, Lazer, Outros):", "Trabalho");
  if (!categoria) return;

  const compromissos = carregarCompromissos();
  compromissos.push({ titulo, data, horario, categoria });
  salvarCompromissos(compromissos);
  renderizarCompromissos();

  if (typeof renderizarCalendarioMensal === "function") {
    renderizarCalendarioMensal();
  }
}

function editarCompromisso(index) {
  const compromissos = carregarCompromissos();
  const comp = compromissos[index];
  if (!comp) return;

  const novoTitulo = prompt("Editar título:", comp.titulo);
  const novaData = prompt("Editar data (AAAA-MM-DD):", comp.data || dataHojeISO());
  const novoHorario = prompt("Editar horário (HH:MM):", comp.horario);
  const novaCategoria = prompt("Editar categoria:", comp.categoria);

  compromissos[index] = {
    titulo: novoTitulo || comp.titulo,
    data: novaData || comp.data || dataHojeISO(),
    horario: novoHorario || comp.horario,
    categoria: novaCategoria || comp.categoria
  };

  salvarCompromissos(compromissos);
  renderizarCompromissos();

  if (typeof renderizarCalendarioMensal === "function") {
    renderizarCalendarioMensal();
  }
}

function excluirCompromisso(index) {
  const compromissos = carregarCompromissos();
  compromissos.splice(index, 1);
  salvarCompromissos(compromissos);
  renderizarCompromissos();

  if (typeof renderizarCalendarioMensal === "function") {
    renderizarCalendarioMensal();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnNovoCompromisso = document.getElementById("novoCompromisso");
  if (btnNovoCompromisso) {
    btnNovoCompromisso.addEventListener("click", novoCompromisso);
  }
  renderizarCompromissos();
});
