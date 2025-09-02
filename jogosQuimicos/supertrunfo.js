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
    { 
        nome: 'Sódio', 
        simbolo: 'Na', 
        imagem: 'imagens/Na(2).png',
        eletronegatividade: 0.93,
        raioAtomico: 186,
        massaAtomica: 22.99,
        pontoFusao: 97.8,
        pontoEbulicao: 883,
        densidade: 0.97,
        energiaIonizacao: 495.8,
        afinidadeEletronica: 52.8,
        configuracaoEletronica: '[Ne] 3s¹',
        grupo: 'Metais Alcalinos',
        periodo: 3
    },
    { 
        nome: 'Cloro', 
        simbolo: 'Cl', 
        imagem: 'imagens/Cl(2).png',
        eletronegatividade: 3.16,
        raioAtomico: 99,
        massaAtomica: 35.45,
        pontoFusao: -101.5,
        pontoEbulicao: -34.04,
        densidade: 3.21,
        energiaIonizacao: 1251.2,
        afinidadeEletronica: 348.6,
        configuracaoEletronica: '[Ne] 3s² 3p⁵',
        grupo: 'Halogênios',
        periodo: 3
    },
    { 
        nome: 'Magnésio', 
        simbolo: 'Mg', 
        imagem: 'imagens/Mg(2).png',
        eletronegatividade: 1.31,
        raioAtomico: 160,
        massaAtomica: 24.31,
        pontoFusao: 650,
        pontoEbulicao: 1090,
        densidade: 1.74,
        energiaIonizacao: 737.7,
        afinidadeEletronica: 0,
        configuracaoEletronica: '[Ne] 3s²',
        grupo: 'Metais Alcalino-Terrosos',
        periodo: 3
    },
    { 
        nome: 'Oxigênio', 
        simbolo: 'O', 
        imagem: 'imagens/O(2).png',
        eletronegatividade: 3.44,
        raioAtomico: 66,
        massaAtomica: 16.00,
        pontoFusao: -218.8,
        pontoEbulicao: -183.0,
        densidade: 1.43,
        energiaIonizacao: 1313.9,
        afinidadeEletronica: 141.0,
        configuracaoEletronica: '[He] 2s² 2p⁴',
        grupo: 'Calcogênios',
        periodo: 2
    },
    { 
        nome: 'Alumínio', 
        simbolo: 'Al', 
        imagem: 'imagens/Al(2).png',
        eletronegatividade: 1.61,
        raioAtomico: 143,
        massaAtomica: 26.98,
        pontoFusao: 660.3,
        pontoEbulicao: 2470,
        densidade: 2.70,
        energiaIonizacao: 577.5,
        afinidadeEletronica: 42.5,
        configuracaoEletronica: '[Ne] 3s² 3p¹',
        grupo: 'Metais Representativos',
        periodo: 3
    },
    { 
        nome: 'Potássio', 
        simbolo: 'K', 
        imagem: 'imagens/K(2).png',
        eletronegatividade: 0.82,
        raioAtomico: 227,
        massaAtomica: 39.10,
        pontoFusao: 63.5,
        pontoEbulicao: 759,
        densidade: 0.86,
        energiaIonizacao: 418.8,
        afinidadeEletronica: 48.4,
        configuracaoEletronica: '[Ar] 4s¹',
        grupo: 'Metais Alcalinos',
        periodo: 4
    },
    { 
        nome: 'Bromo', 
        simbolo: 'Br', 
        imagem: 'imagens/Br(2).png',
        eletronegatividade: 2.96,
        raioAtomico: 114,
        massaAtomica: 79.90,
        pontoFusao: -7.2,
        pontoEbulicao: 58.8,
        densidade: 3.12,
        energiaIonizacao: 1139.9,
        afinidadeEletronica: 324.6,
        configuracaoEletronica: '[Ar] 3d¹⁰ 4s² 4p⁵',
        grupo: 'Halogênios',
        periodo: 4
    },
    { 
        nome: 'Ferro', 
        simbolo: 'Fe', 
        imagem: 'imagens/Fe.png',
        eletronegatividade: 1.83,
        raioAtomico: 126,
        massaAtomica: 55.85,
        pontoFusao: 1538,
        pontoEbulicao: 2862,
        densidade: 7.87,
        energiaIonizacao: 762.5,
        afinidadeEletronica: 15.7,
        configuracaoEletronica: '[Ar] 3d⁶ 4s²',
        grupo: 'Metais de Transição',
        periodo: 4
    },
    { 
        nome: 'Carbono', 
        simbolo: 'C', 
        imagem: 'imagens/C.png',
        eletronegatividade: 2.55,
        raioAtomico: 67,
        massaAtomica: 12.01,
        pontoFusao: 3500,
        pontoEbulicao: 4027,
        densidade: 2.26,
        energiaIonizacao: 1086.5,
        afinidadeEletronica: 121.9,
        configuracaoEletronica: '[He] 2s² 2p²',
        grupo: 'Não-Metais',
        periodo: 2
    },
    { 
        nome: 'Hidrogênio', 
        simbolo: 'H', 
        imagem: 'imagens/H.png',
        eletronegatividade: 2.20,
        raioAtomico: 53,
        massaAtomica: 1.008,
        pontoFusao: -259.2,
        pontoEbulicao: -252.9,
        densidade: 0.09,
        energiaIonizacao: 1312.0,
        afinidadeEletronica: 72.8,
        configuracaoEletronica: '1s¹',
        grupo: 'Não-Metais',
        periodo: 1
    },
    { 
        nome: 'Nitrogênio', 
        simbolo: 'N', 
        imagem: 'imagens/N.png',
        eletronegatividade: 3.04,
        raioAtomico: 56,
        massaAtomica: 14.01,
        pontoFusao: -210.1,
        pontoEbulicao: -195.8,
        densidade: 1.25,
        energiaIonizacao: 1402.3,
        afinidadeEletronica: -7.0,
        configuracaoEletronica: '[He] 2s² 2p³',
        grupo: 'Não-Metais',
        periodo: 2
    },
    { 
        nome: 'Cálcio', 
        simbolo: 'Ca', 
        imagem: 'imagens/Ca.png',
        eletronegatividade: 1.00,
        raioAtomico: 197,
        massaAtomica: 40.08,
        pontoFusao: 842,
        pontoEbulicao: 1484,
        densidade: 1.55,
        energiaIonizacao: 589.8,
        afinidadeEletronica: 2.37,
        configuracaoEletronica: '[Ar] 4s²',
        grupo: 'Metais Alcalino-Terrosos',
        periodo: 4
    }
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

// FUNÇÕES DO HISTÓRICO
function salvarPartida(vencedor, pontosJ1, pontosJ2, duracao) {
    const partida = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        jogador1: nomeJogador1,
        jogador2: nomeJogador2,
        pontosJ1: pontosJ1,
        pontosJ2: pontosJ2,
        vencedor: vencedor,
        duracao: duracao,
        elementosUsados: dadosElementos.length
    };
    
    historicoPartidas.unshift(partida); // Adiciona no início
    
    // Manter apenas as últimas 50 partidas
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
    
    let historicoTexto = '📊 HISTÓRICO DE PARTIDAS\n\n';
    historicoPartidas.slice(0, 10).forEach((partida, index) => {
        const emoji = partida.vencedor === 'empate' ? '🤝' : 
                     partida.vencedor === nomeJogador1 ? '🏆' : '🥈';
        historicoTexto += `${emoji} ${partida.data}\n`;
        historicoTexto += `   ${partida.jogador1}: ${partida.pontosJ1} vs ${partida.jogador2}: ${partida.pontosJ2}\n`;
        historicoTexto += `   Vencedor: ${partida.vencedor} | Duração: ${partida.duracao}\n\n`;
    });
    
    alert(historicoTexto);
}

// FUNÇÕES DO JOGO
function criarBaralho() {
    const baralho = [];
    dadosElementos.forEach(elemento => {
        baralho.push({ ...elemento });
    });
    return baralho;
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
    
    // Divide o baralho entre jogador e CPU
    const meio = Math.ceil(baralhoCompleto.length / 2);
    baralhoJogador = baralhoCompleto.slice(0, meio);
    baralhoCPU = baralhoCompleto.slice(meio);
    
    console.log('Cartas distribuídas:', baralhoJogador.length, 'para jogador,', baralhoCPU.length, 'para CPU');
}

function criarCarta(elemento, container, mostrarDados = true) {
    container.innerHTML = '';
    
    const carta = document.createElement('div');
    carta.className = 'carta-super-trunfo-inner';
    
    // Cabeçalho da carta
    const cabecalho = document.createElement('div');
    cabecalho.className = 'carta-cabecalho';
    cabecalho.innerHTML = `
        <h4>${elemento.nome}</h4>
        <div class="simbolo-elemento">${elemento.simbolo}</div>
    `;
    
    // Imagem do elemento
    const imagem = document.createElement('div');
    imagem.className = 'carta-imagem';
    imagem.style.backgroundImage = `url(${elemento.imagem})`;
    
    // Dados do elemento (se não for carta oculta)
    const dados = document.createElement('div');
    dados.className = 'carta-dados';
    
    if (mostrarDados) {
        dados.innerHTML = `
            <div class="dado-elemento">
                <span class="label">Eletronegatividade:</span>
                <span class="valor">${elemento.eletronegatividade}</span>
            </div>
            <div class="dado-elemento">
                <span class="label">Raio Atômico:</span>
                <span class="valor">${elemento.raioAtomico} pm</span>
            </div>
            <div class="dado-elemento">
                <span class="label">Massa Atômica:</span>
                <span class="valor">${elemento.massaAtomica} u</span>
            </div>
            <div class="dado-elemento">
                <span class="label">Ponto de Fusão:</span>
                <span class="valor">${elemento.pontoFusao}°C</span>
            </div>
            <div class="dado-elemento">
                <span class="label">Densidade:</span>
                <span class="valor">${elemento.densidade} g/cm³</span>
            </div>
            <div class="dado-elemento">
                <span class="label">Energia Ionização:</span>
                <span class="valor">${elemento.energiaIonizacao} kJ/mol</span>
            </div>
            <div class="dado-elemento">
                <span class="label">Grupo:</span>
                <span class="valor">${elemento.grupo}</span>
            </div>
            <div class="dado-elemento">
                <span class="label">Período:</span>
                <span class="valor">${elemento.periodo}</span>
            </div>
        `;
    } else {
        dados.innerHTML = `
            <div class="carta-oculta-texto">?</div>
        `;
    }
    
    carta.appendChild(cabecalho);
    carta.appendChild(imagem);
    carta.appendChild(dados);
    container.appendChild(carta);
}

function pegarProximaCarta(baralho) {
    return baralho.length > 0 ? baralho.shift() : null;
}

function escolherAtributo(atributo) {
    if (!cartaAtualJogador || !cartaAtualCPU) {
        statusTexto.textContent = "Aguarde, preparando as cartas...";
        return;
    }
    
    // Desabilita os botões durante a comparação
    botoesAtributos.forEach(botao => botao.disabled = true);
    

    criarCarta(cartaAtualCPU, cartaCPU, true);
    cartaCPU.classList.remove('carta-oculta');
    
    // Mapear atributo e comparar valores
    const mapaAtributos = {
        'eletronegatividade': 'eletronegatividade',
        'raio-atomico': 'raioAtomico',
        'massa-atomica': 'massaAtomica',
        'ponto-fusao': 'pontoFusao',
        'densidade': 'densidade',
        'energia-ionizacao': 'energiaIonizacao'
    };

    const chave = mapaAtributos[atributo];
    if (!chave) {
        statusTexto.textContent = 'Atributo inválido.';
        return;
    }

    const valorJogador = cartaAtualJogador[chave];
    const valorCPU = cartaAtualCPU[chave];
    
    let vencedor;
    let mensagem;
    let unidade = '';

    // Definir unidade e lógica de comparação para cada atributo
    switch (chave) {
        case 'raioAtomico':
            unidade = ' pm';
            if (valorJogador > valorCPU) {
                vencedor = 'jogador';
                mensagem = `${nomeJogador1} vence! Raio atômico maior (${valorJogador}${unidade} > ${valorCPU}${unidade})`;
            } else if (valorCPU > valorJogador) {
                vencedor = 'cpu';
                mensagem = `${nomeJogador2} vence! Raio atômico maior (${valorCPU}${unidade} > ${valorJogador}${unidade})`;
            } else {
                vencedor = 'empate';
                mensagem = 'Empate! Raios atômicos iguais';
            }
            break;
        case 'massaAtomica':
            unidade = ' u';
            if (valorJogador > valorCPU) {
                vencedor = 'jogador';
                mensagem = `${nomeJogador1} vence! Massa atômica maior (${valorJogador}${unidade} > ${valorCPU}${unidade})`;
            } else if (valorCPU > valorJogador) {
                vencedor = 'cpu';
                mensagem = `${nomeJogador2} vence! Massa atômica maior (${valorCPU}${unidade} > ${valorJogador}${unidade})`;
            } else {
                vencedor = 'empate';
                mensagem = 'Empate! Massas atômicas iguais';
            }
            break;
        case 'pontoFusao':
            unidade = '°C';
            if (valorJogador > valorCPU) {
                vencedor = 'jogador';
                mensagem = `${nomeJogador1} vence! Ponto de fusão maior (${valorJogador}${unidade} > ${valorCPU}${unidade})`;
            } else if (valorCPU > valorJogador) {
                vencedor = 'cpu';
                mensagem = `${nomeJogador2} vence! Ponto de fusão maior (${valorCPU}${unidade} > ${valorJogador}${unidade})`;
            } else {
                vencedor = 'empate';
                mensagem = 'Empate! Pontos de fusão iguais';
            }
            break;
        case 'densidade':
            unidade = ' g/cm³';
            if (valorJogador > valorCPU) {
                vencedor = 'jogador';
                mensagem = `${nomeJogador1} vence! Densidade maior (${valorJogador}${unidade} > ${valorCPU}${unidade})`;
            } else if (valorCPU > valorJogador) {
                vencedor = 'cpu';
                mensagem = `${nomeJogador2} vence! Densidade maior (${valorCPU}${unidade} > ${valorJogador}${unidade})`;
            } else {
                vencedor = 'empate';
                mensagem = 'Empate! Densidades iguais';
            }
            break;
        case 'energiaIonizacao':
            unidade = ' kJ/mol';
            if (valorJogador > valorCPU) {
                vencedor = 'jogador';
                mensagem = `${nomeJogador1} vence! Energia de ionização maior (${valorJogador}${unidade} > ${valorCPU}${unidade})`;
            } else if (valorCPU > valorJogador) {
                vencedor = 'cpu';
                mensagem = `${nomeJogador2} vence! Energia de ionização maior (${valorCPU}${unidade} > ${valorJogador}${unidade})`;
            } else {
                vencedor = 'empate';
                mensagem = 'Empate! Energias de ionização iguais';
            }
            break;
        default: 
            if (valorJogador > valorCPU) {
                vencedor = 'jogador';
                mensagem = `${nomeJogador1} vence! Eletronegatividade maior (${valorJogador} > ${valorCPU})`;
            } else if (valorCPU > valorJogador) {
                vencedor = 'cpu';
                mensagem = `${nomeJogador2} vence! Eletronegatividade maior (${valorCPU} > ${valorJogador})`;
            } else {
                vencedor = 'empate';
                mensagem = 'Empate! Eletronegatividades iguais';
            }
            break;
    }
    
    statusTexto.textContent = mensagem;
    
    if (vencedor === 'jogador') {
        pontosJogador1++;
        pontosJ1.textContent = pontosJogador1;
    } else if (vencedor === 'cpu') {
        pontosJogador2++;
        pontosJ2.textContent = pontosJogador2;
    }
    
    setTimeout(() => {
        proximaRodada();
    }, 3000);
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
    
    // Toca som de vitória final (exceto em empate)
    if (vencedor !== 'empate') {
        tocarVitoriaFinal();
    }
    
    // Salva a partida no histórico
    const duracao = calcularDuracao();
    salvarPartida(vencedor, pontosJogador1, pontosJogador2, duracao);
    
    botoesAtributos.forEach(botao => botao.disabled = true);
}

function iniciarJogo() {
    // Reseta pontuação
    pontosJogador1 = 0;
    pontosJogador2 = 0;
    pontosJ1.textContent = pontosJogador1;
    pontosJ2.textContent = pontosJogador2;
    
    // Atualiza nomes
    labelJ1.textContent = nomeJogador1;
    labelJ2.textContent = nomeJogador2;
    
    inicioPartida = Date.now();
    
    distribuirCartas();
    
    proximaRodada();
}

iniciarJogo(); 