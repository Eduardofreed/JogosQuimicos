"use strict";

// REFERÊNCIAS AOS ELEMENTOS DO JOGO
const cartaJogador = document.getElementById('carta-jogador-elemento');
const cartaCPU = document.getElementById('carta-cpu-elemento');
const labelJ1 = document.getElementById('label-j1');
const labelJ2 = document.getElementById('label-j2');
const pontosJ1 = document.getElementById('pontos-j1');
const pontosJ2 = document.getElementById('pontos-j2');
const statusTexto = document.getElementById('status-texto');
const botaoReiniciar = document.getElementById('botao-reiniciar');
const botoesAtributos = document.querySelectorAll('.botao-atributo');

// EVENT LISTENERS
botaoReiniciar.addEventListener('click', () => {
    tocarClick();
    iniciarJogo();
});
document.getElementById('botao-historico').addEventListener('click', () => {
    tocarClick();
    mostrarHistorico();
});
botoesAtributos.forEach(botao => {
    botao.addEventListener('click', (e) => {
        tocarClick();
        escolherAtributo(e.target.dataset.atributo);
    });
});

// DADOS DOS ELEMENTOS
const dadosElementos = [
    { nome: 'Sódio', simbolo: 'Na', imagem: 'imagens/Na.png', eletronegatividade: 0.93, raioAtomico: 186, massaAtomica: 22.99, pontoFusao: 97.8, densidade: 0.97, energiaIonizacao: 495.8 },
    { nome: 'Cloro', simbolo: 'Cl', imagem: 'imagens/Cl.png', eletronegatividade: 3.16, raioAtomico: 99, massaAtomica: 35.45, pontoFusao: -101.5, densidade: 3.21, energiaIonizacao: 1251.2 },
    { nome: 'Magnésio', simbolo: 'Mg', imagem: 'imagens/Mg.png', eletronegatividade: 1.31, raioAtomico: 160, massaAtomica: 24.31, pontoFusao: 650, densidade: 1.74, energiaIonizacao: 737.7 },
    { nome: 'Oxigênio', simbolo: 'O', imagem: 'imagens/O.png', eletronegatividade: 3.44, raioAtomico: 66, massaAtomica: 16.00, pontoFusao: -218.8, densidade: 1.43, energiaIonizacao: 1313.9 },
    { nome: 'Alumínio', simbolo: 'Al', imagem: 'imagens/Al.png', eletronegatividade: 1.61, raioAtomico: 143, massaAtomica: 26.98, pontoFusao: 660.3, densidade: 2.70, energiaIonizacao: 577.5 },
    { nome: 'Potássio', simbolo: 'K', imagem: 'imagens/K.png', eletronegatividade: 0.82, raioAtomico: 227, massaAtomica: 39.10, pontoFusao: 63.5, densidade: 0.86, energiaIonizacao: 418.8 },
    { nome: 'Bromo', simbolo: 'Br', imagem: 'imagens/Br.png', eletronegatividade: 2.96, raioAtomico: 114, massaAtomica: 79.90, pontoFusao: -7.2, densidade: 3.12, energiaIonizacao: 1139.9 },
    { nome: 'Ferro', simbolo: 'Fe', imagem: 'imagens/Fe.png', eletronegatividade: 1.83, raioAtomico: 126, massaAtomica: 55.85, pontoFusao: 1538, densidade: 7.87, energiaIonizacao: 762.5 },
    { nome: 'Carbono', simbolo: 'C', imagem: 'imagens/C.png', eletronegatividade: 2.55, raioAtomico: 67, massaAtomica: 12.01, pontoFusao: 3500, densidade: 2.26, energiaIonizacao: 1086.5 },
    { nome: 'Hidrogênio', simbolo: 'H', imagem: 'imagens/H.png', eletronegatividade: 2.20, raioAtomico: 53, massaAtomica: 1.008, pontoFusao: -259.2, densidade: 0.09, energiaIonizacao: 1312.0 },
    { nome: 'Nitrogênio', simbolo: 'N', imagem: 'imagens/N.png', eletronegatividade: 3.04, raioAtomico: 56, massaAtomica: 14.01, pontoFusao: -210.1, densidade: 1.25, energiaIonizacao: 1402.3 },
    { nome: 'Cálcio', simbolo: 'Ca', imagem: 'imagens/Ca.png', eletronegatividade: 1.00, raioAtomico: 197, massaAtomica: 40.08, pontoFusao: 842, densidade: 1.55, energiaIonizacao: 589.8 },
    { nome: 'Flúor', simbolo: 'F', imagem: 'imagens/F.png', eletronegatividade: 3.98, raioAtomico: 50, massaAtomica: 18.998, pontoFusao: -219.6, densidade: 1.7, energiaIonizacao: 1681.0 } // Super Trunfo
];

// VARIÁVEIS DE ESTADO DO JOGO
let baralhoJogador = [];
let baralhoCPU = [];
let cartaAtualJogador = null;
let cartaAtualCPU = null;
let pontosJogador1 = 0;
let pontosJogador2 = 0;
let jogadorAtual = 1;
let nomeJogador1 = localStorage.getItem('nomeJogador1') || "Jogador 1";
let nomeJogador2 = localStorage.getItem('nomeJogador2') || "Jogador 2";
let historicoPartidas = JSON.parse(localStorage.getItem('historicoSuperTrunfo')) || [];
let inicioPartida = null;

// FUNÇÕES DO HISTÓRICO (sem alterações)
function salvarPartida(vencedor, pontosJ1, pontosJ2, duracao) {
    const partida = { id: Date.now(), data: new Date().toLocaleString('pt-BR'), jogador1: nomeJogador1, jogador2: nomeJogador2, pontosJ1, pontosJ2, vencedor, duracao, elementosUsados: dadosElementos.length };
    historicoPartidas.unshift(partida);
    if (historicoPartidas.length > 50) {
        historicoPartidas = historicoPartidas.slice(0, 50);
    }
    localStorage.setItem('historicoSuperTrunfo', JSON.stringify(historicoPartidas));
}
function calcularDuracao() {
    if (!inicioPartida) return '0:00';
    const duracao = Math.floor((Date.now() - inicioPartida) / 1000);
    const minutos = Math.floor(duracao / 60);
    const segundos = duracao % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
}
function mostrarHistorico() {
    if (historicoPartidas.length === 0) {
        alert('Nenhuma partida registrada ainda!');
        return;
    }
    let historicoTexto = 'HISTÓRICO DE PARTIDAS\n\n';
    historicoPartidas.slice(0, 10).forEach((partida) => {
        const emoji = partida.vencedor === 'empate' ? '🤝' : partida.vencedor === nomeJogador1 ? '🏆' : '🥈';
        historicoTexto += `${emoji} ${partida.data}\n`;
        historicoTexto += `   ${partida.jogador1}: ${partida.pontosJ1} vs ${partida.jogador2}: ${partida.pontosJ2}\n`;
        historicoTexto += `   Vencedor: ${partida.vencedor} | Duração: ${partida.duracao}\n\n`;
    });
    alert(historicoTexto);
}

// FUNÇÕES DO JOGO
function criarBaralho() {
    return dadosElementos.map(el => ({ ...el }));
}

function embaralhar(baralho) {
    for (let i = baralho.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
    }
}

function distribuirCartas() {
    const baralhoCompleto = criarBaralho();
    embaralhar(baralhoCompleto);
    const meio = Math.ceil(baralhoCompleto.length / 2);
    baralhoJogador = baralhoCompleto.slice(0, meio);
    baralhoCPU = baralhoCompleto.slice(meio);
}

function criarCarta(elemento, container, mostrarDados = true) {
    container.innerHTML = '';
    const cartaImagem = document.createElement('img');
    cartaImagem.src = mostrarDados ? elemento.imagem : 'imagens/verso-institucional.png';
    cartaImagem.alt = mostrarDados ? `Carta do elemento ${elemento.nome}` : 'Carta Oculta';
    container.appendChild(cartaImagem);
}

function pegarProximaCarta(baralho) {
    return baralho.shift() || null;
}

function escolherAtributo(atributo) {
    if (!cartaAtualJogador || !cartaAtualCPU) return;
    botoesAtributos.forEach(botao => botao.disabled = true);
    criarCarta(cartaAtualCPU, cartaCPU, true);
    cartaCPU.classList.remove('carta-oculta');

    const mapaAtributos = {
        'eletronegatividade': 'eletronegatividade', 'raio-atomico': 'raioAtomico',
        'massa-atomica': 'massaAtomica', 'ponto-fusao': 'pontoFusao',
        'densidade': 'densidade', 'energia-ionizacao': 'energiaIonizacao'
    };
    const chave = mapaAtributos[atributo];
    const valorJogador = cartaAtualJogador[chave];
    const valorCPU = cartaAtualCPU[chave];
    let vencedor, mensagem;

    // Lógica da carta Super Trunfo (Flúor)
    if (chave === 'eletronegatividade') {
        if (cartaAtualJogador.nome === 'Flúor') {
            vencedor = 'jogador';
            mensagem = `${nomeJogador1} vence com o Super Trunfo Flúor!`;
        } else if (cartaAtualCPU.nome === 'Flúor') {
            vencedor = 'cpu';
            mensagem = `${nomeJogador2} vence com o Super Trunfo Flúor!`;
        }
    }

    if (!vencedor) { // Se o Super Trunfo não decidiu a rodada
        let comparacao;
        let regra = 'maior'; // padrão

        // Regras invertidas
        if (chave === 'raioAtomico' || chave === 'pontoFusao') {
            regra = 'menor';
            comparacao = valorJogador < valorCPU;
        } else { // Regra normal
            comparacao = valorJogador > valorCPU;
        }

        if (valorJogador === valorCPU) {
            vencedor = 'empate';
            mensagem = `Empate! Valores iguais.`;
        } else if (comparacao) {
            vencedor = 'jogador';
            mensagem = `${nomeJogador1} vence! ${regra.charAt(0).toUpperCase() + regra.slice(1)} valor.`;
        } else {
            vencedor = 'cpu';
            mensagem = `${nomeJogador2} vence! ${regra.charAt(0).toUpperCase() + regra.slice(1)} valor.`;
        }
    }

    statusTexto.textContent = mensagem;
    if (vencedor === 'jogador') pontosJ1.textContent = ++pontosJogador1;
    else if (vencedor === 'cpu') pontosJ2.textContent = ++pontosJogador2;

    setTimeout(proximaRodada, 3000);
}

function proximaRodada() {
    cartaAtualJogador = pegarProximaCarta(baralhoJogador);
    cartaAtualCPU = pegarProximaCarta(baralhoCPU);

    if (!cartaAtualJogador || !cartaAtualCPU) {
        anunciarVencedor();
        return;
    }

    criarCarta(cartaAtualJogador, cartaJogador, true);
    criarCarta(cartaAtualCPU, cartaCPU, false);
    cartaCPU.classList.add('carta-oculta');
    botoesAtributos.forEach(botao => botao.disabled = false);
    statusTexto.textContent = "Escolha um atributo";
}

function anunciarVencedor() {
    let mensagemFinal = "Fim de Jogo! ";
    let vencedor;
    if (pontosJogador1 > pontosJogador2) {
        vencedor = nomeJogador1;
        mensagemFinal += `${vencedor} venceu!`;
    } else if (pontosJogador2 > pontosJogador1) {
        vencedor = nomeJogador2;
        mensagemFinal += `${vencedor} venceu!`;
    } else {
        vencedor = 'empate';
        mensagemFinal += "Empate!";
    }
    statusTexto.textContent = mensagemFinal;
    if (vencedor !== 'empate') tocarVitoriaFinal();
    salvarPartida(vencedor, pontosJogador1, pontosJogador2, calcularDuracao());
    botoesAtributos.forEach(botao => botao.disabled = true);
}

function iniciarJogo() {
    pontosJogador1 = 0;
    pontosJogador2 = 0;
    pontosJ1.textContent = pontosJogador1;
    pontosJ2.textContent = pontosJogador2;
    labelJ1.textContent = nomeJogador1;
    labelJ2.textContent = nomeJogador2;
    inicioPartida = Date.now();
    distribuirCartas();
    proximaRodada();
}

iniciarJogo();