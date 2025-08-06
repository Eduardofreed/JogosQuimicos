"use strict";

// --- REFERÊNCIAS AOS ELEMENTOS DO JOGO ---
const tabuleiro = document.getElementById('tabuleiro-jogo');
const labelJ1 = document.getElementById('label-j1');
const labelJ2 = document.getElementById('label-j2');
const pontosJ1 = document.getElementById('pontos-j1');
const pontosJ2 = document.getElementById('pontos-j2');
const statusTexto = document.getElementById('status-texto');
const botaoReiniciar = document.getElementById('botao-reiniciar');

// --- EVENT LISTENER DO JOGO ---
botaoReiniciar.addEventListener('click', iniciarJogo);

// --- DADOS DO JOGO ---
const dadosBaseCartas = [
    { nome: 'Sódio', simbolo: 'Na', quantidade: 3, carga: 1, imagem: 'imagens/Na.png' },
    { nome: 'Cloro', simbolo: 'Cl', quantidade: 6, carga: -1, imagem: 'imagens/Cl.png' },
    { nome: 'Magnésio', simbolo: 'Mg', quantidade: 2, carga: 2, imagem: 'imagens/Mg.png' },
    { nome: 'Oxigênio', simbolo: 'O', quantidade: 6, carga: -2, imagem: 'imagens/O.png' },
    { nome: 'Alumínio', simbolo: 'Al', quantidade: 2, carga: 3, imagem: 'imagens/Al.png' },
    { nome: 'Potássio', simbolo: 'K', quantidade: 5, carga: 1, imagem: 'imagens/K.png' },
    { nome: 'Bromo', simbolo: 'Br', quantidade: 5, carga: -1, imagem: 'imagens/Br.png' },
];

// --- VARIÁVEIS DE ESTADO DO JOGO ---
let cartasViradas = [];
let travarCliques = false;
let pontosJogador1 = 0;
let pontosJogador2 = 0;
let jogadorAtual = 1;
let nomeJogador1 = localStorage.getItem('nomeJogador1') || "Jogador 1";
let nomeJogador2 = localStorage.getItem('nomeJogador2') || "Jogador 2";

// --- FUNÇÕES DO JOGO ---
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
        frente.style.backgroundImage = `url(${infoCarta.imagem})`;

        cartaElemento.appendChild(verso);
        cartaElemento.appendChild(frente);

        cartaElemento.addEventListener('click', virarCarta);
        tabuleiro.appendChild(cartaElemento);
    });
}

function virarCarta(evento) {
    if (travarCliques) return;
    const cartaClicada = evento.currentTarget;
    if (cartaClicada.classList.contains('virada')) return;

    if (cartasViradas.length < 5) {
        cartaClicada.classList.add('virada');
        cartasViradas.push(cartaClicada);
    }

    if (cartasViradas.length === 5) {
        travarCliques = true;
        statusTexto.textContent = "Verificando combinação...";
        const resultado = verificarCombinacoes(cartasViradas);
        setTimeout(() => {
            if (resultado.encontrou) {
                tratarSucesso(resultado.combinacao);
            } else {
                tratarFalha();
            }
        }, 1500);
    }
}

function verificarCombinacoes(cartas) {
    const cargas = cartas.map(c => parseInt(c.dataset.carga));
    if (cargas.reduce((a, b) => a + b, 0) === 0 && cargas.length === 5)
        return { encontrou: true, combinacao: [...cartas] };

    // 4 cartas
    for (let i = 0; i < 5; i++)
        for (let j = i + 1; j < 5; j++)
            for (let k = j + 1; k < 5; k++)
                for (let l = k + 1; l < 5; l++)
                    if (cargas[i] + cargas[j] + cargas[k] + cargas[l] === 0)
                        return { encontrou: true, combinacao: [cartas[i], cartas[j], cartas[k], cartas[l]] };

    // 3 cartas
    for (let i = 0; i < 5; i++)
        for (let j = i + 1; j < 5; j++)
            for (let k = j + 1; k < 5; k++)
                if (cargas[i] + cargas[j] + cargas[k] === 0)
                    return { encontrou: true, combinacao: [cartas[i], cartas[j], cartas[k]] };

    // 2 cartas
    for (let i = 0; i < 5; i++)
        for (let j = i + 1; j < 5; j++)
            if (cargas[i] + cargas[j] === 0)
                return { encontrou: true, combinacao: [cartas[i], cartas[j]] };

    return { encontrou: false, combinacao: [] };
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
        return cargaB - cargaA;
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

function tratarSucesso(combinacao) {
    const compostoFormado = formatarComposto(combinacao);
    const pontosGanhos = 1;
    statusTexto.textContent = `Ponto para ${jogadorAtual === 1 ? nomeJogador1 : nomeJogador2}! +${pontosGanhos} (${compostoFormado})`;

    if (jogadorAtual === 1) {
        pontosJogador1 += pontosGanhos;
        pontosJ1.textContent = pontosJogador1;
    } else {
        pontosJogador2 += pontosGanhos;
        pontosJ2.textContent = pontosJogador2;
    }

    combinacao.forEach(carta => carta.classList.add('combinada'));
    setTimeout(() => {
        combinacao.forEach(carta => carta.remove());
        proximoTurno();
    }, 2000);
}

function tratarFalha() {
    statusTexto.textContent = "Nenhuma combinação encontrada.";
    setTimeout(() => {
        proximoTurno();
    }, 1500);
}

function proximoTurno() {
    cartasViradas.forEach(carta => {
        if (document.body.contains(carta)) {
            carta.classList.remove('virada');
        }
    });
    cartasViradas = [];
    travarCliques = false;
    jogadorAtual = (jogadorAtual === 1) ? 2 : 1;
    const nomeJogadorAtual = (jogadorAtual === 1) ? nomeJogador1 : nomeJogador2;
    statusTexto.textContent = `Vez de ${nomeJogadorAtual}`;
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
    if (pontosJogador1 > pontosJogador2) {
        mensagemFinal += `${nomeJogador1} venceu!`;
    } else if (pontosJogador2 > pontosJogador1) {
        mensagemFinal += `${nomeJogador2} venceu!`;
    } else {
        mensagemFinal += "Empate!";
    }
    statusTexto.textContent = mensagemFinal;
}

function iniciarJogo() {
    pontosJogador1 = 0;
    pontosJogador2 = 0;
    labelJ1.textContent = nomeJogador1;
    labelJ2.textContent = nomeJogador2;
    pontosJ1.textContent = pontosJogador1;
    pontosJ2.textContent = pontosJogador2;
    jogadorAtual = 1;
    statusTexto.textContent = `Vez de ${nomeJogador1}`;
    travarCliques = false;
    cartasViradas = [];
    const baralho = criarBaralho();
    embaralhar(baralho);
    distribuirCartas(baralho);
}

iniciarJogo();