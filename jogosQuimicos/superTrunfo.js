"use strict";

// Referências aos elementos do jogo (preenchidas após DOM pronto)
let cartaJogador, cartaCPU, labelJ1, labelJ2, pontosJ1, pontosJ2, statusTexto, botaoReiniciar, botoesAtributos, botaoDica;

function setupSuperTrunfo() {
    cartaJogador = document.getElementById('carta-jogador-elemento');
    cartaCPU = document.getElementById('carta-cpu-elemento');
    labelJ1 = document.getElementById('label-j1');
    labelJ2 = document.getElementById('label-j2');
    pontosJ1 = document.getElementById('pontos-j1');
    pontosJ2 = document.getElementById('pontos-j2');
    statusTexto = document.getElementById('status-texto');
    botaoReiniciar = document.getElementById('botao-reiniciar');
    botaoDica = document.getElementById('botao-dica');
    botoesAtributos = document.querySelectorAll('.botao-atributo');

    if (botaoReiniciar) {
        botaoReiniciar.addEventListener('click', () => {
            tocarClick();
            iniciarJogo();
        });
    }
    const botaoHistorico = document.getElementById('botao-historico');
    if (botaoHistorico) {
        botaoHistorico.addEventListener('click', () => {
            tocarClick();
            mostrarHistorico();
        });
    }
    botoesAtributos.forEach(botao => {
        botao.addEventListener('click', (e) => {
            tocarClick();
            escolherAtributo(e.target.dataset.atributo);
        });
    });

    if (botaoDica) {
        inicializarDicas();
    }

    iniciarJogo();
}

document.addEventListener('DOMContentLoaded', setupSuperTrunfo);

// Dados dos elementos
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
    { nome: 'Flúor', simbolo: 'F', imagem: 'imagens/F.png', eletronegatividade: 3.98, raioAtomico: 50, massaAtomica: 18.998, pontoFusao: -219.6, densidade: 1.7, energiaIonizacao: 1681.0 },
    { nome: 'Argônio', simbolo: 'Ar', imagem: 'imagens/Ar.png', eletronegatividade: 0.00, raioAtomico: 99, massaAtomica: 39.95, pontoFusao: -189.4, densidade: 1.78, energiaIonizacao: 1520.6 },
    { nome: 'Neônio', simbolo: 'Ne', imagem: 'imagens/Ne.png', eletronegatividade: 0.00, raioAtomico: 71, massaAtomica: 20.18, pontoFusao: -248.6, densidade: 0.00, energiaIonizacao: 2080.7 },
    { nome: 'Hélio', simbolo: 'He', imagem: 'imagens/He.png', eletronegatividade: 0.00, raioAtomico: 31, massaAtomica: 4.003, pontoFusao: -269.7, densidade: 0.00, energiaIonizacao: 2372.3 },
    { nome: 'Berílio', simbolo: 'Be', imagem: 'imagens/Be.png', eletronegatividade: 1.57, raioAtomico: 112, massaAtomica: 9.012, pontoFusao: 1560, densidade: 1.85, energiaIonizacao: 900.6 },
    { nome: 'Magnésio', simbolo: 'Mg', imagem: 'imagens/Mg.png', eletronegatividade: 1.31, raioAtomico: 160, massaAtomica: 24.31, pontoFusao: 650, densidade: 1.74, energiaIonizacao: 737.7 }
];

// Variáveis de estado do jogo
let baralhoEquipe = [];
let baralhoCPU = [];
let cartaAtualEquipe = null;
let cartaAtualCPU = null;
let pontosEquipe = 0;
let pontosCPU = 0;
let nomeJogador1 = localStorage.getItem('nomeJogador1') || "Jogador 1";
let nomeJogador2 = localStorage.getItem('nomeJogador2') || "Jogador 2";
let nomeEquipeCustom = localStorage.getItem('nomeEquipe') || null;
let historicoPartidas = JSON.parse(localStorage.getItem('historicoSuperTrunfo')) || [];
let inicioPartida = null;

// Funções do histórico
function salvarPartida(vencedor, pontosEquipe, pontosCPU, duracao) {
    const partida = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        equipe: nomeEquipeCustom ? nomeEquipeCustom : `${nomeJogador1} & ${nomeJogador2}`,
        pontosEquipe,
        pontosCPU,
        vencedor,
        duracao,
        elementosUsados: dadosElementos.length
    };
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
        const emoji = partida.vencedor === 'empate' ? '🤝' : partida.vencedor === 'equipe' ? '🏆' : '🤖';
        historicoTexto += `${emoji} ${partida.data}\n`;
        historicoTexto += `   ${partida.equipe}: ${partida.pontosEquipe} vs CPU: ${partida.pontosCPU}\n`;
        historicoTexto += `   Vencedor: ${partida.vencedor === 'equipe' ? 'Equipe' : partida.vencedor === 'cpu' ? 'CPU' : 'Empate'} | Duração: ${partida.duracao}\n\n`;
    });
    alert(historicoTexto);
}

// Funções do jogo
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
    baralhoEquipe = baralhoCompleto.slice(0, meio);
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
    if (!cartaAtualEquipe || !cartaAtualCPU) return;
    botoesAtributos.forEach(botao => botao.disabled = true);
    criarCarta(cartaAtualCPU, cartaCPU, true);
    cartaCPU.classList.remove('carta-oculta');

    const mapaAtributos = {
        'eletronegatividade': 'eletronegatividade', 'raio-atomico': 'raioAtomico',
        'massa-atomica': 'massaAtomica', 'ponto-fusao': 'pontoFusao',
        'densidade': 'densidade', 'energia-ionizacao': 'energiaIonizacao'
    };
    const chave = mapaAtributos[atributo];
    const valorEquipe = cartaAtualEquipe[chave];
    const valorCPU = cartaAtualCPU[chave];
    let vencedor, mensagem;

    // Lógica da carta Super Trunfo (Flúor)
    if (chave === 'eletronegatividade') {
        if (cartaAtualEquipe.nome === 'Flúor') {
            vencedor = 'equipe';
            mensagem = `Equipe vence com o Super Trunfo Flúor!`;
        } else if (cartaAtualCPU.nome === 'Flúor') {
            vencedor = 'cpu';
            mensagem = `CPU vence com o Super Trunfo Flúor!`;
        }
    }

    if (!vencedor) { // Se o Super Trunfo não decidiu a rodada
        let comparacao;
        let regra = 'maior'; // padrão

        // Regras invertidas
        if (chave === 'raioAtomico' || chave === 'pontoFusao') {
            regra = 'menor';
            comparacao = valorEquipe < valorCPU;
        } else { // Regra normal
            comparacao = valorEquipe > valorCPU;
        }

        if (valorEquipe === valorCPU) {
            vencedor = 'empate';
            mensagem = `Empate! Valores iguais.`;
        } else if (comparacao) {
            vencedor = 'equipe';
            mensagem = `Equipe vence! ${regra.charAt(0).toUpperCase() + regra.slice(1)} valor.`;
        } else {
            vencedor = 'cpu';
            mensagem = `CPU vence! ${regra.charAt(0).toUpperCase() + regra.slice(1)} valor.`;
        }
    }

    statusTexto.textContent = mensagem;
    if (vencedor === 'equipe') pontosJ1.textContent = ++pontosEquipe;
    else if (vencedor === 'cpu') pontosJ2.textContent = ++pontosCPU;

    setTimeout(proximaRodada, 3000);
}

function proximaRodada() {
    cartaAtualEquipe = pegarProximaCarta(baralhoEquipe);
    cartaAtualCPU = pegarProximaCarta(baralhoCPU);

    if (!cartaAtualEquipe || !cartaAtualCPU) {
        anunciarVencedor();
        return;
    }

    criarCarta(cartaAtualEquipe, cartaJogador, true);
    criarCarta(cartaAtualCPU, cartaCPU, false);
    cartaCPU.classList.add('carta-oculta');
    botoesAtributos.forEach(botao => botao.disabled = false);
    statusTexto.textContent = "Escolha um atributo para a equipe";
}

function anunciarVencedor() {
    let mensagemFinal = "Fim de Jogo! ";
    let vencedor;
    if (pontosEquipe > pontosCPU) {
        mensagemFinal += `Equipe venceu! ${nomeJogador1} e ${nomeJogador2} ganharam!`;
        vencedor = 'equipe';
    } else if (pontosCPU > pontosEquipe) {
        mensagemFinal += `CPU venceu! Tente novamente!`;
        vencedor = 'cpu';
    } else {
        mensagemFinal += "Empate!";
        vencedor = 'empate';
    }
    statusTexto.textContent = mensagemFinal;

    // Salvar partida no ranking
    salvarPartida(vencedor, pontosEquipe, pontosCPU, calcularDuracao());
}

function iniciarJogo() {
    pontosEquipe = 0;
    pontosCPU = 0;
    pontosJ1.textContent = pontosEquipe;
    pontosJ2.textContent = pontosCPU;
    labelJ1.textContent = nomeEquipeCustom ? nomeEquipeCustom : "Equipe";
    labelJ2.textContent = "CPU";
    inicioPartida = Date.now();
    distribuirCartas();
    proximaRodada();
}

// Sistema de dicas (3 usos): sugere o melhor atributo previsto pela carta atual da equipe
let dicasRestantes = 5;
function inicializarDicas() {
    atualizarRotuloDica();
    botaoDica.addEventListener('click', () => {
        if (dicasRestantes <= 0 || !cartaAtualEquipe) return;
        tocarClick();
        const sugestao = gerarSugestaoTexto(cartaAtualEquipe);
        statusTexto.textContent = sugestao;
        dicasRestantes--;
        atualizarRotuloDica();
        if (dicasRestantes === 0) botaoDica.disabled = true;
    });
}

function atualizarRotuloDica() {
    botaoDica.querySelector('.botao-texto').textContent = `Dica (${dicasRestantes})`;
}

function gerarSugestaoTexto(carta) {
    // Regras de texto por atributo com thresholds simples para evitar sempre a mesma dica
    if (carta.nome === 'Flúor') {
        return 'Dica: O flúor tem altíssima eletronegatividade. Pense nesse atributo.';
    }
    const dicas = [];
    if (carta.eletronegatividade >= 3.2) dicas.push('Sua carta é bastante eletronegativa.');
    if (carta.raioAtomico <= 80) dicas.push('Raio atômico pequeno tende a ser vantajoso.');
    if (carta.massaAtomica >= 40) dicas.push('Massa atômica elevada pode ajudar.');
    if (carta.pontoFusao <= -150) dicas.push('Ponto de fusão muito baixo é interessante (menor vence).');
    if (carta.densidade >= 3) dicas.push('Densidade alta pode ser uma boa aposta.');
    if (carta.energiaIonizacao >= 900) dicas.push('Energia de ionização alta é um bom indicativo.');

    if (dicas.length === 0) {
        return 'Dica: avalie cuidadosamente cada atributo; pequenas diferenças podem decidir.';
    }
    // Rotaciona as mensagens para evitar repetição constante
    const idx = Math.floor(Math.random() * dicas.length);
    return `Dica: ${dicas[idx]}`;
}