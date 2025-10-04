"use strict";

// Referências do DOM
const tabuleiro = document.getElementById('tabuleiro-jogo');
const labelJ1 = document.getElementById('label-j1');
const labelJ2 = document.getElementById('label-j2');
const pontosJ1 = document.getElementById('pontos-j1');
const pontosJ2 = document.getElementById('pontos-j2');
const statusTexto = document.getElementById('status-texto');
const botaoReiniciar = document.getElementById('botao-reiniciar');
const curiosidadeContainer = document.getElementById('curiosidade-container');
const curiosidadeTitulo = document.getElementById('curiosidade-titulo');
const curiosidadeTexto = document.getElementById('curiosidade-texto');
const toggleCPU = document.getElementById('toggle-cpu');
const dificuldadeContainer = document.getElementById('dificuldade-container');
const selectDificuldade = document.getElementById('select-dificuldade');

// Event listener de reinício
botaoReiniciar.addEventListener('click', () => {
    tocarClick();
    iniciarJogo();
});

// Event listeners para o modo CPU
toggleCPU.addEventListener('change', function () {
    modoCPU = this.checked;
    dificuldadeContainer.style.display = modoCPU ? 'flex' : 'none';
    if (modoCPU) {
        labelJ2.textContent = "CPU";
    } else {
        labelJ2.textContent = nomeJogador2;
    }
});

selectDificuldade.addEventListener('change', function () {
    dificuldadeCPU = this.value;
});

// Dados do jogo
const dadosBaseCartas = [
    { nome: 'Sódio', simbolo: 'Na', quantidade: 3, carga: 1, imagem: 'imagens/Na_memoriaIonica.png' },
    { nome: 'Cloro', simbolo: 'Cl', quantidade: 6, carga: -1, imagem: 'imagens/Cl_memoriaIonica.png' },
    { nome: 'Magnésio', simbolo: 'Mg', quantidade: 2, carga: 2, imagem: 'imagens/Mg_memoriaIonica.png' },
    { nome: 'Oxigênio', simbolo: 'O', quantidade: 6, carga: -2, imagem: 'imagens/O_memoriaIonica.png' },
    { nome: 'Alumínio', simbolo: 'Al', quantidade: 2, carga: 3, imagem: 'imagens/Al_memoriaIonica.png' },
    { nome: 'Potássio', simbolo: 'K', quantidade: 5, carga: 1, imagem: 'imagens/K_memoriaIonica.png' },
    { nome: 'Bromo', simbolo: 'Br', quantidade: 5, carga: -1, imagem: 'imagens/Br_memoriaIonica.png' },
    { nome: 'Hidrogênio', simbolo: 'H', quantidade: 6, carga: 1, imagem: 'imagens/H_memoriaIonica.png' },
    { nome: 'Carbono', simbolo: 'C', quantidade: 6, carga: 0, imagem: 'imagens/C_memoriaIonica.png' },
    { nome: 'Nitrogênio', simbolo: 'N', quantidade: 6, carga: 0, imagem: 'imagens/N_memoriaIonica.png' }
];

const compostosValidos = [
    'NaCl', 'KBr', 'KCl', 'NaBr',
    'MgO', 'MgCl2', 'MgBr2',
    'K2O', 'KOH', 
    'Na2O', 'NaOH',
    'AlCl3', 'AlBr3',
    'Al2O3',
    'HCl', 'H2O', 'HNO3',
    'CO2', 'CH4' 
];

const compostosConhecidos = {
    'NaCl': 'NaCl (Cloreto de Sódio), o famoso sal de cozinha!',
    'MgO': 'MgO (Óxido de Magnésio), usado como antiácido.',
    'Al2O3': 'Al₂O₃ (Óxido de Alumínio), conhecido como alumina, uma excelente isolante elétrica, muito utilizada em componentes eletrônicos.',
    'KCl': 'KCl (Cloreto de Potássio), usado em fertilizantes.',
    'KBr': 'KBr (Brometo de Potássio), um sal com propriedades sedativas.',
    'NaBr': 'NaBr (Brometo de Sódio), um sal usado para tratar epilepsia.',
    'KOH': 'KOH (Hidróxido de Potássio), também conhecido como potassa cáustica, é uma base forte usada em diversas aplicações industriais, incluindo a fabricação de sabão e como eletrólito em baterias.',
    'K2O': 'K₂O (Óxido de Potássio), um óxido básico que reage vigorosamente com água para formar hidróxido de potássio (KOH).',
    'MgBr2': 'MgBr₂ (Brometo de Magnésio), é empregado como retardante de chamas, reduzindo a inflamabilidade em materiais como algodão quando adicionado na concentração de 0,125 mol/L.',
    'MgCl2': 'MgCl₂ (Cloreto de Magnésio), encontrado na água do mar.',
    'Na2O': 'Na₂O (Óxido de Sódio), um óxido básico forte.',
    'AlCl3': 'AlCl₃ (Cloreto de Alumínio), usado como catalisador.',
    'HCl': 'HCl (Ácido Clorídrico), um ácido forte usado em diversas aplicações industriais, incluindo a fabricação de produtos químicos e a remoção de impurezas.',
    'H2O': 'H₂O (Água), a substância mais abundante na Terra.',
    'HNO3': 'HNO₃ (Ácido Nítrico), um ácido forte usado na produção de fertilizantes, corantes e até mesmo explosivos como o TNT.',
    'CO2': 'CO₂ (Dióxido de Carbono), um gás essencial para a fotossíntese das plantas e usado para gaseificar bebidas e em extintores de incêndio.',
    'CH4': 'CH₄ (Metano), um gás conhecido como gás natural, usado principalmente como combustível para aquecimento e geração de eletricidade.'
};


// Variáveis de estado do Jogo
let cartasViradas = [];
let travarCliques = false;
let pontosJogador1 = 0;
let pontosJogador2 = 0;
let jogadorAtual = 1;
let nomeJogador1 = localStorage.getItem('nomeJogador1') || "Jogador 1";
let nomeJogador2 = localStorage.getItem('nomeJogador2') || "Jogador 2";
let modoJogo = localStorage.getItem('modoJogo') || 'multiplayer'; // 'singleplayer' ou 'multiplayer'
let modoCPU = false;
let dificuldadeCPU = 'medio'; // 'facil', 'medio', 'dificil'


// Funções do jogo
function jogadaCPU() {
    if (!modoCPU || jogadorAtual !== 2) return;

    travarCliques = true;
    statusTexto.textContent = "CPU está pensando...";

    setTimeout(() => {
        const cartasDisponiveis = Array.from(document.querySelectorAll('.carta:not(.virada):not(.combinada)'));

        if (cartasDisponiveis.length < 2) {
            verificarFimDeJogo();
            return;
        }

        let cartasSelecionadas = [];
        let maxCartas = 5;

        // Define o número máximo de cartas com base na dificuldade
        switch (dificuldadeCPU) {
            case 'facil':
                maxCartas = Math.floor(Math.random() * 2) + 2; // 2-3 cartas
                break;
            case 'medio':
                maxCartas = Math.floor(Math.random() * 2) + 3; // 3-4 cartas
                break;
            case 'dificil':
                maxCartas = Math.floor(Math.random() * 2) + 4; // 4-5 cartas
                break;
        }

        // Limita ao número de cartas disponíveis
        maxCartas = Math.min(maxCartas, cartasDisponiveis.length);

        // Seleciona cartas aleatoriamente
        for (let i = 0; i < maxCartas; i++) {
            const indice = Math.floor(Math.random() * cartasDisponiveis.length);
            const carta = cartasDisponiveis.splice(indice, 1)[0];
            cartasSelecionadas.push(carta);
            carta.classList.add('virada');
            tocarVirarCarta();
        }

        cartasViradas = cartasSelecionadas;
        statusTexto.textContent = "CPU está verificando combinações...";

        setTimeout(() => {
            const combosEncontrados = encontrarTodosOsCombos(cartasViradas);
            if (combosEncontrados.length > 0) {
                tratarSucesso(combosEncontrados);
            } else {
                tratarFalha();
            }
        }, 1500);

    }, 1500); // 1.5 segundos de delay para parecer que está pensando
}

function criarBaralho() {
    const baralho = [];
    dadosBaseCartas.forEach(tipoCarta => {
        for (let i = 0; i < tipoCarta.quantidade; i++) {
            baralho.push({ ...tipoCarta });
        }
    });
    return baralho;
}

function embaralhar(baralho) {
    for (let i = baralho.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
    }
}

function distribuirCartas(baralho) {
    tabuleiro.innerHTML = '';
    baralho.forEach(infoCarta => {
        const cartaElemento = document.createElement('div');
        cartaElemento.classList.add('carta');
        cartaElemento.dataset.simbolo = infoCarta.simbolo;
        cartaElemento.dataset.carga = infoCarta.carga;
        const verso = document.createElement('div');
        verso.classList.add('face', 'verso');
        const frente = document.createElement('div');
        frente.classList.add('face', 'frente');
        frente.style.backgroundImage = `url('${infoCarta.imagem}')`;
        cartaElemento.appendChild(verso);
        cartaElemento.appendChild(frente);
        cartaElemento.addEventListener('click', virarCarta);
        tabuleiro.appendChild(cartaElemento);
    });
}

function virarCarta(evento) {
    // Impede jogadas durante o turno da CPU
    if (travarCliques || (modoCPU && jogadorAtual === 2)) return;

    const cartaClicada = evento.currentTarget;
    if (cartaClicada.classList.contains('virada')) return;

    if (cartasViradas.length < 5) {
        cartaClicada.classList.add('virada');
        cartasViradas.push(cartaClicada);
        tocarVirarCarta();
    }

    if (cartasViradas.length === 5) {
        travarCliques = true;
        statusTexto.textContent = "Verificando combinações...";
        setTimeout(() => {
            const combosEncontrados = encontrarTodosOsCombos(cartasViradas);
            if (combosEncontrados.length > 0) {
                tratarSucesso(combosEncontrados);
            } else {
                tratarFalha();
            }
        }, 1500);
    }
}

function encontrarTodosOsCombos(cartas) {
    let poolDeCartas = [...cartas];
    const combosRealizados = [];

    let encontrouComboNestaRodada = true;
    while (encontrouComboNestaRodada) {
        encontrouComboNestaRodada = false;
        // Itera por todos os subconjuntos possíveis do pool de cartas atual
        for (let i = (1 << poolDeCartas.length) - 1; i > 0; i--) {
            const subconjunto = [];
            let cargaTotal = 0;
            for (let j = 0; j < poolDeCartas.length; j++) {
                if ((i >> j) & 1) {
                    subconjunto.push(poolDeCartas[j]);
                    cargaTotal += parseInt(poolDeCartas[j].dataset.carga);
                }
            }

            if (subconjunto.length >= 2 && cargaTotal === 0) {
                const formula = formatarComposto(subconjunto);
                if (compostosValidos.includes(formula)) {
                    combosRealizados.push(subconjunto);
                    // Remove as cartas usadas do pool para a próxima iteração
                    poolDeCartas = poolDeCartas.filter(carta => !subconjunto.includes(carta));
                    encontrouComboNestaRodada = true;
                    break; // Sai do loop de subconjuntos para recomeçar a busca no pool reduzido
                }
            }
        }
    }
    return combosRealizados; // Retorna uma lista de combos (lista de listas de cartas)
}


function formatarComposto(combinacao) {
    const contagem = {};
    combinacao.forEach(carta => {
        const simbolo = carta.dataset.simbolo;
        contagem[simbolo] = (contagem[simbolo] || 0) + 1;
    });

    const simbolosUnicos = Object.keys(contagem);
    simbolosUnicos.sort((a, b) => {
        const cargaA = parseInt(dadosBaseCartas.find(c => c.simbolo === a).carga);
        const cargaB = parseInt(dadosBaseCartas.find(c => c.simbolo === b).carga);
        if (cargaA > 0 && cargaB < 0) return -1;
        if (cargaA < 0 && cargaB > 0) return 1;
        return a.localeCompare(b);
    });

    let formula = '';
    simbolosUnicos.forEach(simbolo => {
        formula += simbolo;
        const quantidade = contagem[simbolo];
        if (quantidade > 1) {
            formula += quantidade;
        }
    });
    return formula;
}

// Função de Sucesso para Combos
function tratarSucesso(combos) {
    let pontosGanhos = 0;
    let todasCartasDoCombo = [];
    let textoCuriosidade = "";

    // Calcula pontos e prepara mensagens para cada combo encontrado
    combos.forEach(combo => {
        pontosGanhos += combo.length >= 3 ? 2 : 1;
        todasCartasDoCombo.push(...combo);
        const compostoFormado = formatarComposto(combo);
        textoCuriosidade += (compostosConhecidos[compostoFormado] || `Você formou o composto válido ${compostoFormado}!`) + "<br><br>";
    });

    // Adiciona um ponto de bônus se mais de um combo foi feito
    if (combos.length > 1) {
        pontosGanhos++;
        curiosidadeTitulo.textContent = "COMBO!";
    } else {
        curiosidadeTitulo.textContent = "Composto Formado!";
    }

    statusTexto.textContent = `Ponto para ${jogadorAtual === 1 ? nomeJogador1 : nomeJogador2}! +${pontosGanhos}`;
    curiosidadeTexto.innerHTML = textoCuriosidade;
    curiosidadeContainer.className = 'curiosidade-container-visivel';

    if (jogadorAtual === 1) {
        pontosJogador1 += pontosGanhos;
        pontosJ1.textContent = pontosJogador1;
    } else {
        pontosJogador2 += pontosGanhos;
        pontosJ2.textContent = pontosJogador2;
    }

    tocarCombinacao();
    todasCartasDoCombo.forEach(carta => carta.classList.add('combinada'));

    setTimeout(() => {
        curiosidadeContainer.className = 'curiosidade-container-oculto';
        todasCartasDoCombo.forEach(carta => carta.remove());
        const cartasNaoUsadas = cartasViradas.filter(c => !todasCartasDoCombo.includes(c));
        cartasNaoUsadas.forEach(c => c.classList.remove('virada'));

        proximoTurno();
    }, 1200 + (combos.length * 1000)); // Adiciona tempo extra para ler múltiplos combos
}

function tratarFalha() {
    statusTexto.textContent = "Nenhuma combinação válida encontrada.";
    setTimeout(() => {
        cartasViradas.forEach(c => c.classList.remove('virada'));
        proximoTurno();
    }, 1500);
}

function proximoTurno() {
    cartasViradas = [];
    travarCliques = false;
    jogadorAtual = (jogadorAtual === 1) ? 2 : 1;

    if (modoCPU && jogadorAtual === 2) {
        statusTexto.textContent = "Vez da CPU";
        setTimeout(jogadaCPU, 1000);
    } else {
        const nomeJogadorAtual = (jogadorAtual === 1) ? nomeJogador1 : (modoCPU ? "CPU" : nomeJogador2);
        statusTexto.textContent = `Vez de ${nomeJogadorAtual}`;
    }

    verificarFimDeJogo();
}

function verificarFimDeJogo() {
    const cartasRestantes = document.querySelectorAll('.carta');
    if (cartasRestantes.length < 2) {
        anunciarVencedor();
        return;
    }
    let temPositivo = false;
    let temNegativo = false;
    for (let carta of cartasRestantes) {
        const carga = parseInt(carta.dataset.carga);
        if (carga > 0) temPositivo = true;
        if (carga < 0) temNegativo = true;
    }
    if (!temPositivo || !temNegativo) {
        anunciarVencedor();
    }
}

function anunciarVencedor() {
    travarCliques = true;
    let mensagemFinal = "Fim de Jogo! ";
    let vencedor;
    if (pontosJogador1 > pontosJogador2) {
        mensagemFinal += `${nomeJogador1} venceu!`;
        vencedor = nomeJogador1;
    } else if (pontosJogador2 > pontosJogador1) {
        mensagemFinal += `${nomeJogador2} venceu!`;
        vencedor = nomeJogador2;
    } else {
        mensagemFinal += "Empate!";
        vencedor = 'empate';
    }
    statusTexto.textContent = mensagemFinal;
    if (vencedor !== 'empate') {
        tocarVitoriaFinal();
    }

}

function iniciarJogo() {
    pontosJogador1 = 0;
    pontosJogador2 = 0;
    labelJ1.textContent = nomeJogador1;

    // Ajusta o label do jogador 2 com base no modo
    if (modoCPU) {
        labelJ2.textContent = "CPU";
    } else {
        labelJ2.textContent = nomeJogador2;
    }

    pontosJ1.textContent = pontosJogador1;
    pontosJ2.textContent = pontosJogador2;
    jogadorAtual = 1;
    statusTexto.textContent = `Vez de ${modoCPU && jogadorAtual === 2 ? "CPU" : nomeJogador1}`;
    travarCliques = false;
    cartasViradas = [];
    curiosidadeContainer.className = 'curiosidade-container-oculto';
    const baralho = criarBaralho();
    embaralhar(baralho);
    distribuirCartas(baralho);
}

iniciarJogo();