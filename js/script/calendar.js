/* ==========================================
   Conecta News 1.0 - calendar.js
   Calendário mensal conectado à agenda
   ========================================== */

const calendarioKey = "conectaNewsCompromissos";

function carregarCompromissosCalendario() {
  try {
    const compromissosSalvos = localStorage.getItem(calendarioKey);
    return compromissosSalvos ? JSON.parse(compromissosSalvos) : [];
  } catch (error) {
    console.warn("Compromissos inválidos para o calendário.", error);
    return [];
  }
}

function criarDataLocal(dataISO) {
  if (!dataISO) return null;
  const partes = dataISO.split("-").map(Number);
  if (partes.length !== 3 || partes.some(Number.isNaN)) return null;
  return new Date(partes[0], partes[1] - 1, partes[2]);
}

function textoSeguro(valor) {
  return typeof escaparHTML === "function" ? escaparHTML(valor) : String(valor || "");
}

function renderizarCalendarioMensal(ano = new Date().getFullYear(), mes = new Date().getMonth()) {
  const calendarioMensal = document.getElementById("calendarioMensal");
  if (!calendarioMensal) return;

  calendarioMensal.innerHTML = "";
  const compromissos = carregarCompromissosCalendario();

  const nomeMes = new Date(ano, mes).toLocaleString("pt-BR", { month: "long" });
  const header = document.createElement("h3");
  header.textContent = `${nomeMes} ${ano}`;
  calendarioMensal.appendChild(header);

  const grid = document.createElement("div");
  grid.classList.add("grid-calendario");

  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const diaDiv = document.createElement("button");
    diaDiv.type = "button";
    diaDiv.classList.add("dia-calendario");
    diaDiv.textContent = dia;

    const compromissosDia = compromissos
      .map((compromisso, indexOriginal) => ({ ...compromisso, indexOriginal }))
      .filter(comp => {
        const dataComp = criarDataLocal(comp.data);
        return dataComp && dataComp.getDate() === dia && dataComp.getMonth() === mes && dataComp.getFullYear() === ano;
      });

    if (compromissosDia.length > 0) {
      diaDiv.classList.add("dia-com-compromisso");
      diaDiv.title = `${compromissosDia.length} compromisso(s)`;
      diaDiv.addEventListener("click", () => mostrarDetalhesDia(dia, mes, ano, compromissosDia));
    }

    grid.appendChild(diaDiv);
  }

  calendarioMensal.appendChild(grid);
}

function mostrarDetalhesDia(dia, mes, ano, compromissosDia) {
  const calendarioMensal = document.getElementById("calendarioMensal");
  if (!calendarioMensal) return;

  calendarioMensal.innerHTML = "";

  const detalhesDiv = document.createElement("div");
  detalhesDiv.classList.add("detalhes-dia");
  detalhesDiv.innerHTML = `<h4>Compromissos em ${dia}/${mes + 1}/${ano}</h4>`;

  compromissosDia
    .sort((a, b) => (a.horario || "").localeCompare(b.horario || ""))
    .forEach(comp => {
      const compDiv = document.createElement("div");
      compDiv.classList.add("compromisso-card");
      compDiv.innerHTML = `
        <h3>${textoSeguro(comp.titulo)}</h3>
        <p><strong>Horário:</strong> ${textoSeguro(comp.horario)}</p>
        <span class="categoria ${textoSeguro(comp.categoria).toLowerCase()}">${textoSeguro(comp.categoria)}</span>
        <div class="compromisso-acoes">
          <button type="button" onclick="editarCompromissoCalendario(${comp.indexOriginal})">Editar</button>
          <button type="button" onclick="excluirCompromissoCalendario(${comp.indexOriginal})">Excluir</button>
        </div>
      `;
      detalhesDiv.appendChild(compDiv);
    });

  calendarioMensal.appendChild(detalhesDiv);

  const btnVoltar = document.createElement("button");
  btnVoltar.type = "button";
  btnVoltar.textContent = "Voltar ao calendário";
  btnVoltar.addEventListener("click", () => renderizarCalendarioMensal(ano, mes));
  calendarioMensal.appendChild(btnVoltar);
}

function editarCompromissoCalendario(index) {
  if (typeof editarCompromisso === "function") {
    editarCompromisso(index);
  }
}

function excluirCompromissoCalendario(index) {
  if (typeof excluirCompromisso === "function") {
    excluirCompromisso(index);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarCalendarioMensal();
});
