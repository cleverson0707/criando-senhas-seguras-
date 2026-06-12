// Seleção dos elementos DOM
const campoSenha = document.querySelector('#campo-senha');
const btnRevelar = document.querySelector('#btn-revelar');
const btnCopiar = document.querySelector('#btn-copiar');
const btnMenos = document.querySelector('#btn-menos');
const btnMais = document.querySelector('#btn-mais');
const contadorNumero = document.querySelector('#contador-numero');
const avisoTamanho = document.querySelector('#aviso-tamanho');
const btnGerar = document.querySelector('#btn-gerar');
const textoForca = document.querySelector('#texto-forca');
const barraProgresso = document.querySelector('#barra-forca-progresso');
const listaHistorico = document.querySelector('#lista-historico');

// Checkboxes de opções
const chkMaiusculas = document.querySelector('#chk-maiusculas');
const chkMinusculas = document.querySelector('#chk-minusculas');
const chkNumeros = document.querySelector('#chk-numeros');
const chkEspComuns = document.querySelector('#chk-especiais-comuns');
const chkEspRaros = document.querySelector('#chk-especiais-raros');
const chkEspacos = document.querySelector('#chk-espacos');
const chkUnicode = document.querySelector('#chk-unicode');
const chkCriptografia = document.querySelector('#chk-criptografia');

let tamanhoSenha = 8;

// Eventos de alteração de tamanho (+ e -)
btnMais.addEventListener('click', () => {
  tamanhoSenha++;
  atualizarInterfaceContador();
});

btnMenos.addEventListener('click', () => {
  tamanhoSenha--;
  atualizarInterfaceContador();
});

function atualizarInterfaceContador() {
  contadorNumero.textContent = tamanhoSenha;
  
  if (tamanhoSenha < 6) {
    btnGerar.disabled = true;
    avisoTamanho.classList.remove('hidden');
  } else {
    btnGerar.disabled = false;
    avisoTamanho.classList.add('hidden');
  }
}

// Alternar visualização (Olhinho ocultar/revelar)
btnRevelar.addEventListener('click', () => {
  campoSenha.classList.toggle('senha-oculta');
  btnRevelar.textContent = campoSenha.classList.contains('senha-oculta') ? "👁️" : "🙈";
});

// Ação do botão copiar
btnCopiar.addEventListener('click', () => {
  const senhaParaCopiar = campoSenha.textContent;
  if (senhaParaCopiar && senhaParaCopiar !== "Clique em Gerar" && senhaParaCopiar !== "Selecione uma opção!") {
    navigator.clipboard.writeText(senhaParaCopiar).then(() => {
      const textoOriginal = btnCopiar.textContent;
      btnCopiar.textContent = "Copiado! ✓";
      btnCopiar.style.backgroundColor = "#00ff66";
      btnCopiar.style.color = "#121212";
      
      setTimeout(() => {
        btnCopiar.textContent = textoOriginal;
        btnCopiar.style.backgroundColor = "";
        btnCopiar.style.color = "";
      }, 2000);
    });
  }
});

// Função Nativa Assíncrona para geração de Criptografia SHA-256
async function criptografarSHA256(texto) {
  const msgBuffer = new TextEncoder().encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Motor de Geração de Senha Avançado
function gerarSenhaBase(tamanho) {
  let poolCaracteres = [];

  if (chkMaiusculas.checked) poolCaracteres.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (chkMinusculas.checked) poolCaracteres.push(...'abcdefghijklmnopqrstuvwxyz');
  if (chkNumeros.checked)    poolCaracteres.push(...'0123456789');
  if (chkEspComuns.checked)  poolCaracteres.push(...'!@#$%*');
  if (chkEspRaros.checked)   poolCaracteres.push(...'{}[]<>/\\');
  if (chkEspacos.checked)    poolCaracteres.push(' ');
  if (chkUnicode.checked)    poolCaracteres.push('🚀', '🔒', '★', '🔥', '⚡', '🤖');

  if (poolCaracteres.length === 0) return '';

  let resultado = '';
  for (let i = 0; i < tamanho; i++) {
    const indice = Math.floor(Math.random() * poolCaracteres.length);
    resultado += poolCaracteres[indice];
  }
  return resultado;
}

// Avaliador de Força de Senha Dinâmico
function avaliarForcaSenha(senha, criptoAtiva) {
  barraProgresso.className = ""; // Reseta as classes da barra
  
  if (!senha) {
    textoForca.textContent = "Segurança: ---";
    return;
  }

  if (criptoAtiva) {
    textoForca.textContent = "Segurança: Nível Militar (SHA-256) 🚀";
    barraProgresso.classList.add('forte');
    return;
  }

  // Avaliação baseada no tamanho e variedade
  if (tamanhoSenha < 8) {
    textoForca.textContent = "Segurança: Vulnerável ⚠️";
    barraProgresso.classList.add('fraca');
  } else if (tamanhoSenha >= 8 && tamanhoSenha < 12) {
    textoForca.textContent = "Segurança: Aceitável ⚖️";
    barraProgresso.classList.add('media');
  } else {
    textoForca.textContent = "Segurança: Inviolável 💪";
    barraProgresso.classList.add('forte');
  }
}

// Adicionar senha gerada ao painel de histórico local
function gerenciarHistorico(senha) {
  const li = document.createElement('li');
  li.textContent = senha;
  listaHistorico.insertBefore(li, listaHistorico.firstChild);
  
  if (listaHistorico.children.length > 3) {
    listaHistorico.removeChild(listaHistorico.lastChild);
  }
}

// Acionador Principal da Geração
btnGerar.addEventListener('click', async () => {
  let senhaFinal = gerarSenhaBase(tamanhoSenha);

  if (!senhaFinal) {
    campoSenha.textContent = "Selecione uma opção!";
    avaliarForcaSenha('', false);
    return;
  }

  if (chkCriptografia.checked) {
    senhaFinal = await criptografarSHA256(senhaFinal);
  }

  campoSenha.textContent = senhaFinal;
  avaliarForcaSenha(senhaFinal, chkCriptografia.checked);
  gerenciarHistorico(senhaFinal);
});
