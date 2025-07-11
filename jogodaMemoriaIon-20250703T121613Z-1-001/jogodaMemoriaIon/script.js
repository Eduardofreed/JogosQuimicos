"use strict";

const tabuleiro = document.getElementById('tabuleiro-jogo');
const placarJ1 = document.getElementById('pontos-j1');
const placarJ2 = document.getElementById('pontos-j2');
const statusTexto = document.getElementById('status-texto');
const botaoReiniciar = document.getElementById('botao-reiniciar');

const dadosBaseCartas = [
    { nome: 'Sódio', simbolo: 'Na', quantidade: 3, carga: 1, imagem: 'imagens/Na.png', massa: '22,990', eletronegatividade: '0,93', raio: '180pm', configuracao: '[Ne] 3s¹', curiosidade: 'É um metal tão macio que pode ser cortado com uma faca.' },
    { nome: 'Cloro', simbolo: 'Cl', quantidade: 6, carga: -1, imagem: 'imagens/Cl.png', massa: '35,453', eletronegatividade: '3,16', raio: '79pm', configuracao: '[Ne] 3s² 3p⁵', curiosidade: 'Foi usado como arma química (gás de cloro) na Primeira Guerra Mundial.' },
    { nome: 'Magnésio', simbolo: 'Mg', quantidade: 2, carga: 2, imagem: 'imagens/Mg.png', massa: '24,305', eletronegatividade: '1,31', raio: '150pm', configuracao: '[Ne] 3s²', curiosidade: 'Queima com uma luz branca e brilhante, sendo usado em fogos de artifício.' },
    { nome: 'Oxigênio', simbolo: 'O', quantidade: 6, carga: -2, imagem: 'imagens/O.png', massa: '15,999', eletronegatividade: '3,44', raio: '60pm', configuracao: '[He] 2s² 2p⁴', curiosidade: 'Compõe cerca de 21% da atmosfera da Terra.' },
    { nome: 'Alumínio', simbolo: 'Al', quantidade: 2, carga: 3, imagem: 'imagens/Al.png', massa: '26,982', eletronegatividade: '1,61', raio: '125pm', configuracao: '[Ne] 3s² 3p¹', curiosidade: 'É o metal mais abundante na crosta terrestre.' },
    { nome: 'Potássio', simbolo: 'K', quantidade: 5, carga: 1, imagem: 'imagens/K.png', massa: '39,098', eletronegatividade: '0,82', raio: '220pm', configuracao: '[Ar] 4s¹', curiosidade: 'Reage violentamente com a água, produzindo uma chama lilás.' },
    { nome: 'Bromo', simbolo: 'Br', quantidade: 5, carga: -1, imagem: 'imagens/Br.png', massa: '79,904', eletronegatividade: '2,96', raio: '94pm', configuracao: '[Ar] 3d¹⁰ 4s² 4p⁵', curiosidade: 'É um dos dois únicos elementos líquidos à temperatura ambiente (o outro é o mercúrio).' },
];

let cartasViradas = [];
let travarCliques = false;
let pontosJogador1 = 0;
let pontosJogador2 = 0;
let jogadorAtual = 1;

botaoReiniciar.addEventListener('click', iniciarJogo);

function criarBaralho() {
    const baralho = []; dadosBaseCartas.forEach(tipoCarta => { for (let i = 0; i < tipoCarta.quantidade; i++) { baralho.push({ ...tipoCarta }); } }); return baralho;
}
function embaralhar(baralho) { 
    for (let i = baralho.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[baralho[i], baralho[j]] = [baralho[j], baralho[i]]; }
}
function distribuirCartas(baralho) {
    tabuleiro.innerHTML = ''; baralho.forEach(infoCarta => { const cartaElemento = document.createElement('div'); cartaElemento.classList.add('carta'); cartaElemento.dataset.simbolo = infoCarta.simbolo; cartaElemento.dataset.carga = infoCarta.carga; const verso = document.createElement('div'); verso.classList.add('face', 'verso'); const frente = document.createElement('div'); frente.classList.add('face', 'frente'); frente.style.backgroundImage = `url(${infoCarta.imagem})`; cartaElemento.appendChild(verso); cartaElemento.appendChild(frente); cartaElemento.addEventListener('click', virarCarta); tabuleiro.appendChild(cartaElemento); });
}

function virarCarta(evento) {
    if (travarCliques || (cartasViradas.length >= 5 && !cartasViradas.includes(evento.currentTarget))) return;
    const cartaClicada = evento.currentTarget;
    if (cartaClicada.classList.contains('virada')) return;
    cartaClicada.classList.add('virada');
    if (!cartasViradas.includes(cartaClicada)) {
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

    // Combinação de 5 cargas
    if (cargas[0] + cargas[1] + cargas[2] + cargas[3] + cargas[4] === 0) {
        return { encontrou: true, combinacao: [...cartas] };
    }
    // Combinação de 4 cargas
    for (let i = 0; i < 5; i++) {
        for (let j = i + 1; j < 5; j++) {
            for (let k = j + 1; k < 5; k++) {
                for (let l = k + 1; l < 5; l++) {
                    if (cargas[i] + cargas[j] + cargas[k] + cargas[l] === 0) {
                        return { encontrou: true, combinacao: [cartas[i], cartas[j], cartas[k], cartas[l]] };
                    }
                }
            }
        }
    }
    // Combinação de 3 cargas
    for (let i = 0; i < 5; i++) {
        for (let j = i + 1; j < 5; j++) {
            for (let k = j + 1; k < 5; k++) {
                if (cargas[i] + cargas[j] + cargas[k] === 0) {
                    return { encontrou: true, combinacao: [cartas[i], cartas[j], cartas[k]] };
                }
            }
        }
    }
    // Combinação de 2 cargas
    for (let i = 0; i < 5; i++) {
        for (let j = i + 1; j < 5; j++) {
            if (cargas[i] + cargas[j] === 0) {
                return { encontrou: true, combinacao: [cartas[i], cartas[j]] };
            }
        }
    }
    return { encontrou: false, combinacao: [] };
}


/**
 * @param {Array} combinacao - As cartas que formam o composto.
 */
function tratarSucesso(combinacao) {
    combinacao.sort((a, b) => b.dataset.carga - a.dataset.carga);
    const compostoFormado = combinacao.map(c => c.dataset.simbolo).join('');
    
    const pontosGanhos = 1; 
    statusTexto.textContent = `Ponto para o Jogador ${jogadorAtual}! +${pontosGanhos} (${compostoFormado})`;

    if (jogadorAtual === 1) {
        pontosJogador1 += pontosGanhos;
        placarJ1.textContent = pontosJogador1;
    } else {
        pontosJogador2 += pontosGanhos;
        placarJ2.textContent = pontosJogador2;
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
    jogadorAtual = (jogadorAtual === 1) ? 2 : 1;
    statusTexto.textContent = `Vez do Jogador ${jogadorAtual}`;
    cartasViradas = [];
    travarCliques = false;

    verificarFimDeJogo();
}

function verificarFimDeJogo() {
    // Pega todas as cartas que ainda estão no tabuleiro
    const cartasRestantes = document.querySelectorAll('.carta');
    if (cartasRestantes.length < 2) { // Não dá pra fazer par com menos de 2 cartas
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
    
    // Se não houver mais cartas positivas OU negativas, o jogo acaba.
    if (!temPositivo || !temNegativo) {
        anunciarVencedor();
    }
}

function anunciarVencedor() {
    travarCliques = true; // Trava o jogo permanentemente
    let mensagemFinal = "Fim de Jogo! ";
    if (pontosJogador1 > pontosJogador2) {
        mensagemFinal += "O Jogador 1 venceu!";
    } else if (pontosJogador2 > pontosJogador1) {
        mensagemFinal += "O Jogador 2 venceu!";
    } else {
        mensagemFinal += "Empate!";
    }
    statusTexto.textContent = mensagemFinal;
}


function iniciarJogo() {
    pontosJogador1 = 0;
    pontosJogador2 = 0;
    placarJ1.textContent = pontosJogador1;
    placarJ2.textContent = pontosJogador2;
    jogadorAtual = 1;
    statusTexto.textContent = `Vez do Jogador ${jogadorAtual}`;
    const baralho = criarBaralho();
    embaralhar(baralho);
    distribuirCartas(baralho);
    cartasViradas = [];
    travarCliques = false;
}


iniciarJogo();
