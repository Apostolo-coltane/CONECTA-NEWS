/* ==========================================
   Conecta News 1.0 - script.js principal
   Navegação, preferências e registro do PWA
   ========================================== */

const CONECTA_DATA_KEY = "conectaNewsData";
const CONFIG_PADRAO = {
  usuario: {
    nome: "Usuário",
    preferencias: {
      tema: "claro",
      notificacoes: true,
      idioma: "pt-BR"
    }
  },
  grupos: [
    { nome: "Família", cor: "#4CAF50" },
    { nome: "Trabalho", cor: "#2196F3" },
    { nome: "Lazer", cor: "#9C27B0" },
    { nome: "Outros", cor: "#FFC107" }
  ]
};

function obterDadosLocais() {
  try {
    return JSON.parse(localStorage.getItem(CONECTA_DATA_KEY)) || null;
  } catch (error) {
    console.warn("Dados locais inválidos. Restaurando padrão.", error);
    localStorage.removeItem(CONECTA_DATA_KEY);
    return null;
  }
}

function salvarDadosLocais(dados) {
  localStorage.setItem(CONECTA_DATA_KEY, JSON.stringify(dados));
}

function normalizarDados(dados) {
  const preferencias = {
    ...CONFIG_PADRAO.usuario.preferencias,
    ...(dados && dados.usuario ? dados.usuario.preferencias : {})
  };

  return {
    ...CONFIG_PADRAO,
    ...dados,
    usuario: {
      ...CONFIG_PADRAO.usuario,
      ...(dados ? dados.usuario : {}),
      preferencias
    },
    grupos: Array.isArray(dados && dados.grupos) && dados.grupos.length > 0
      ? dados.grupos
      : CONFIG_PADRAO.grupos
  };
}

function mostrarTela(idTela) {
  document.querySelectorAll(".tela").forEach(tela => {
    tela.classList.toggle("ativa", tela.id === idTela);
  });
}

function vincularClique(id, callback) {
  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.addEventListener("click", callback);
  }
}

function configurarNavegacao() {
  vincularClique("btnInicio", () => mostrarTela("telaInicio"));
  vincularClique("btnNotas", () => mostrarTela("telaNotas"));
  vincularClique("btnAgenda", () => mostrarTela("telaAgenda"));
  vincularClique("btnCalendario", () => mostrarTela("telaCalendario"));
  vincularClique("btnConfig", () => mostrarTela("telaConfig"));
  vincularClique("btnBlocoNotas", () => mostrarTela("telaNotas"));
  vincularClique("btnAgendaDiaria", () => mostrarTela("telaAgenda"));
}

async function carregarConfiguracoes() {
  const dadosLocais = obterDadosLocais();

  if (dadosLocais) {
    const dados = normalizarDados(dadosLocais);
    aplicarPreferencias(dados.usuario.preferencias);
    aplicarGrupos(dados.grupos);
    return dados;
  }

  try {
    const response = await fetch("json/data.json", { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const dados = normalizarDados(await response.json());
    salvarDadosLocais(dados);
    aplicarPreferencias(dados.usuario.preferencias);
    aplicarGrupos(dados.grupos);
    return dados;
  } catch (error) {
    console.warn("Não foi possível carregar json/data.json. Usando padrão local.", error);
    const dados = normalizarDados(CONFIG_PADRAO);
    salvarDadosLocais(dados);
    aplicarPreferencias(dados.usuario.preferencias);
    aplicarGrupos(dados.grupos);
    return dados;
  }
}

function aplicarPreferencias(preferencias = CONFIG_PADRAO.usuario.preferencias) {
  document.body.classList.toggle("tema-escuro", preferencias.tema === "escuro");
  console.log(preferencias.notificacoes ? "Notificações ativadas" : "Notificações desativadas");
}

function configurarToggleTema() {
  vincularClique("btnToggleTema", () => {
    const dados = normalizarDados(obterDadosLocais() || CONFIG_PADRAO);
    const temaAtual = document.body.classList.contains("tema-escuro") ? "claro" : "escuro";

    dados.usuario.preferencias.tema = temaAtual;
    salvarDadosLocais(dados);
    aplicarPreferencias(dados.usuario.preferencias);

    if (typeof renderizarConfig === "function") {
      renderizarConfig();
    }
  });
}

function aplicarGrupos(grupos = CONFIG_PADRAO.grupos) {
  const gruposDiv = document.querySelector(".grupos");
  if (!gruposDiv) return;

  gruposDiv.innerHTML = "";
  grupos.forEach(grupo => {
    const div = document.createElement("div");
    div.className = "grupo";
    div.style.backgroundColor = grupo.cor;
    div.textContent = grupo.nome;
    gruposDiv.appendChild(div);
  });
}

function registrarServiceWorker() {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:") {
    return;
  }

  navigator.serviceWorker
    .register("./sw.js")
    .then(registration => {
      console.log("Service Worker registrado.");
      registration.update();
    })
    .catch(error => console.error("Erro ao registrar Service Worker:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarTela("telaInicio");
  configurarNavegacao();
  configurarToggleTema();
  carregarConfiguracoes().then(() => {
    if (typeof renderizarConfig === "function") {
      renderizarConfig();
    }
  });
  registrarServiceWorker();

  console.log("Conecta News 1.0 iniciado com sucesso.");
});

