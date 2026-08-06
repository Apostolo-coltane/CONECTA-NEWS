/* ==========================================
   Conecta News 1.0 - config.js
   Módulo de configurações
   ========================================== */

function carregarConfigLocal() {
  return typeof obterDadosLocais === "function" ? obterDadosLocais() : null;
}

function salvarConfigLocal(dados) {
  if (typeof salvarDadosLocais === "function") {
    salvarDadosLocais(dados);
  } else {
    localStorage.setItem("conectaNewsData", JSON.stringify(dados));
  }
}

function renderizarConfig() {
  const telaConfig = document.getElementById("telaConfig");
  if (!telaConfig) return;

  const dados = typeof normalizarDados === "function"
    ? normalizarDados(carregarConfigLocal() || CONFIG_PADRAO)
    : carregarConfigLocal();

  telaConfig.innerHTML = `
    <h2>Configurações</h2>
    <div class="config-opcao">
      <label for="temaSelect">Tema:</label>
      <select id="temaSelect">
        <option value="claro">Claro</option>
        <option value="escuro">Escuro</option>
      </select>
    </div>
    <div class="config-opcao">
      <label for="notifCheck">Notificações:</label>
      <input type="checkbox" id="notifCheck">
    </div>
    <div class="config-opcao">
      <label for="idiomaSelect">Idioma:</label>
      <select id="idiomaSelect">
        <option value="pt-BR">Português (Brasil)</option>
        <option value="en-US">English (US)</option>
      </select>
    </div>
    <button type="button" id="salvarConfig">Salvar Configurações</button>
  `;

  const preferencias = dados.usuario.preferencias;
  document.getElementById("temaSelect").value = preferencias.tema;
  document.getElementById("notifCheck").checked = Boolean(preferencias.notificacoes);
  document.getElementById("idiomaSelect").value = preferencias.idioma;

  document.getElementById("salvarConfig").addEventListener("click", () => {
    const dadosAtualizados = typeof normalizarDados === "function"
      ? normalizarDados(carregarConfigLocal() || CONFIG_PADRAO)
      : dados;

    dadosAtualizados.usuario.preferencias.tema = document.getElementById("temaSelect").value;
    dadosAtualizados.usuario.preferencias.notificacoes = document.getElementById("notifCheck").checked;
    dadosAtualizados.usuario.preferencias.idioma = document.getElementById("idiomaSelect").value;

    salvarConfigLocal(dadosAtualizados);

    if (typeof aplicarPreferencias === "function") {
      aplicarPreferencias(dadosAtualizados.usuario.preferencias);
    }

    alert("Configurações salvas com sucesso!");
  });
}
