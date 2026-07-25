console.log("SCRIPT CARREGOU");

/* ========================================= */
/* BASE DE PERGUNTAS                         */
/* ========================================= */

// 1. Primeira Pergunta (Fixa para todas as equipes)
const faseInicial = {
  local: " 16-18-01-03-01 04-15 02-01-18-01-15 (dica: alfabeto)",
  pergunta: "Aonde Jesus nos ensina a ajuntar tesouros?",
  resposta: "céu"
};

// 2. Pergunta Intermediária A
const faseA = {
  local: "AÇARAPDATNAS (dica: embaralhado)",
  pergunta: "Segundo Jesus, qual é o verdadeiro tesouro na vida do homem?",
  resposta: "paraiso"
};

// 3. Pergunta Intermediária B
const faseB = {
  local: "MOXÇX AX JXQOFW (dica: César sabe a resposta)",
  pergunta: "Depois de encontrar esse tesouro, qual é a melhor escolha que uma pessoa pode fazer: correr de um lado para o outro ou permanecer aos pés de Jesus?",
  resposta: "permanecer aos pés de Jesus"
};

// 4. Pergunta Intermediária C
const faseC = {
  local: "🧔​❤️​👩​👶​⭐​⛪ (dica:lugar)​",
  pergunta: "Oque acontece com o tesouro guardado no céu?",
  resposta: "não acaba"
};

// 5. Última Pergunta (Fixa para todas as equipes)
const faseFinal = {
  local: "NOITE ESTRELA BURACO ASTROS METEORO (dica: sigla)",
  pergunta: "Aqui não há mais uma pergunta. Foi uma jornada incrível com pessoas incríveis. Tenho certeza que vocês compreenderam o amor dele. Me digam os nomes dos agentes que chegaram até aqui.",
  resposta: "(qualquer resposta é valida)"
};

/* ========================================= */
/* ROTAS EXCLUSIVAS POR EQUIPE               */
/* ========================================= */

// Função que gera um caminho fixo baseado no nome da equipe
function gerarCaminhoEquipe(nomeEquipe) {
  const intermediarias = [faseA, faseB, faseC];
  
  // Gera um número único com base nas letras do nome da equipe
  let hash = 0;
  for (let i = 0; i < nomeEquipe.length; i++) {
    hash = nomeEquipe.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Cria uma ordem determinística (fixa) baseada no hash
  const ordem = [...intermediarias];
  for (let i = ordem.length - 1; i > 0; i--) {
    const j = Math.abs(hash) % (i + 1);
    [ordem[i], ordem[j]] = [ordem[j], ordem[i]];
  }

  // Retorna o percurso completo: Início + Ordem da Equipe + Final
  return [faseInicial, ...ordem, faseFinal];
}

/* ========================================= */
/* ELEMENTOS                                 */
/* ========================================= */

const inicio = document.getElementById("inicio");
const jogo = document.getElementById("jogo");
const fim = document.getElementById("fim");

const tituloLocal = document.getElementById("tituloLocal");
const textoEnigma = document.getElementById("textoEnigma");
const inputResposta = document.getElementById("inputResposta");

const btnIniciar = document.getElementById("btnIniciar");
const btnResponder = document.getElementById("btnResponder");
const equipes = document.querySelectorAll(".btnEquipe");

/* ========================================= */

let fases = [];
let faseAtual = 0;
let equipeSelecionada = "";

/* ========================================= */
/* SELEÇÃO DE EQUIPE / INICIAR               */
/* ========================================= */

equipes.forEach((btn) => {
  btn.onclick = (e) => {
    equipeSelecionada = (e.target.textContent || e.target.innerText).trim();
    iniciarJogo(equipeSelecionada);
  };
});

if (btnIniciar) {
  btnIniciar.onclick = () => {
    iniciarJogo(equipeSelecionada || "Padrão");
  };
}

function iniciarJogo(nomeEquipe) {
  // Define o caminho FIXO exclusivo para essa equipe
  fases = gerarCaminhoEquipe(nomeEquipe);

  faseAtual = 0;
  inicio.style.display = "none";
  jogo.style.display = "block";
  carregarFase();
}

/* ========================================= */
/* CARREGAR FASE                             */
/* ========================================= */

function carregarFase() {
  tituloLocal.textContent = fases[faseAtual].local;
  textoEnigma.textContent = fases[faseAtual].pergunta;
  inputResposta.value = "";
  inputResposta.focus();
}

/* ========================================= */
/* NORMALIZAR TEXTO                          */
/* ========================================= */

function normalizarTexto(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, " "); // colapsa múltiplos espaços
}

/* ========================================= */
/* RESPONDER E EVENTOS                       */
/* ========================================= */

function verificarResposta() {
  const faseEhLivre =
    normalizarTexto(fases[faseAtual].resposta) === normalizarTexto("(qualquer resposta é valida)");

  const respostaDigitada = normalizarTexto(inputResposta.value);
  const respostaCorreta = normalizarTexto(fases[faseAtual].resposta);

  // Última fase: aceita qualquer resposta não vazia
  const acertou = faseEhLivre
    ? respostaDigitada.length > 0
    : respostaDigitada === respostaCorreta;

  if (acertou) {
    alert("✅ Resposta correta!");
    faseAtual++;

    if (faseAtual >= fases.length) {
      jogo.style.display = "none";
      fim.style.display = "block";
      return;
    }

    carregarFase();
  } else {
    alert("❌ Resposta incorreta.\n\nTente novamente.");
  }
}

// Eventos de clique e tecla Enter
if (btnResponder) {
  btnResponder.onclick = verificarResposta;
}

if (inputResposta) {
  inputResposta.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      verificarResposta();
    }
  });
}