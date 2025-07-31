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
botaoReiniciar.addEventListener('click', iniciarJogo);
botoesAtributos.forEach(botao => {
    botao.addEventListener('click', (e) => escolherAtributo(e.target.dataset.atributo));
});

// DADOS DOS ELEMENTOS
const dadosElementos = [
    { 
        nome: 'Sódio', 
        simbolo: 'Na', 
        imagem: 'imagens/Na.png',
        eletronegatividade: 0.93,
        raioAtomico: 186,
        massaAtomica: 22.99,
        pontoFusao: 97.8,
        pontoEbulicao: 883,
        densidade: 0.97
    },
    { 
        nome: 'Cloro', 
        simbolo: 'Cl', 
        imagem: 'imagens/Cl.png',
        eletronegatividade: 3.16,
        raioAtomico: 99,
        massaAtomica: 35.45,
        pontoFusao: -101.5,
        pontoEbulicao: -34.04,
        densidade: 3.21
    },
    { 
        nome: 'Magnésio', 
        simbolo: 'Mg', 
        imagem: 'imagens/Mg.png',
        eletronegatividade: 1.31,
        raioAtomico: 160,
        massaAtomica: 24.31,
        pontoFusao: 650,
        pontoEbulicao: 1090,
        densidade: 1.74
    },
    { 
        nome: 'Oxigênio', 
        simbolo: 'O', 
        imagem: 'imagens/O.png',
        eletronegatividade: 3.44,
        raioAtomico: 66,
        massaAtomica: 16.00,
        pontoFusao: -218.8,
        pontoEbulicao: -183.0,
        densidade: 1.43
    },
    { 
        nome: 'Alumínio', 
        simbolo: 'Al', 
        imagem: 'imagens/Al.png',
        eletronegatividade: 1.61,
        raioAtomico: 143,
        massaAtomica: 26.98,
        pontoFusao: 660.3,
        pontoEbulicao: 2470,
        densidade: 2.70
    },
    { 
        nome: 'Potássio', 
        simbolo: 'K', 
        imagem: 'imagens/K.png',
        eletronegatividade: 0.82,
        raioAtomico: 227,
        massaAtomica: 39.10,
        pontoFusao: 63.5,
        pontoEbulicao: 759,
        densidade: 0.86
    },
    { 
        nome: 'Bromo', 
        simbolo: 'Br', 
        imagem: 'imagens/Br.png',
        eletronegatividade: 2.96,
        raioAtomico: 114,
        massaAtomica: 79.90,
        pontoFusao: -7.2,
        pontoEbulicao: 58.8,
        densidade: 3.12
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
    
    // Mostra a carta da CPU
    criarCarta(cartaAtualCPU, cartaCPU, true);
    cartaCPU.classList.remove('carta-oculta');
    
    // Compara os valores
    const valorJogador = cartaAtualJogador[atributo];
    const valorCPU = cartaAtualCPU[atributo];
    
    let vencedor;
    let mensagem;
    
    if (atributo === 'raio-atomico') {
        // Maior raio vence
        if (valorJogador > valorCPU) {
            vencedor = 'jogador';
            mensagem = `${nomeJogador1} vence! Raio maior (${valorJogador} pm > ${valorCPU} pm)`;
        } else if (valorCPU > valorJogador) {
            vencedor = 'cpu';
            mensagem = `${nomeJogador2} vence! Raio maior (${valorCPU} pm > ${valorJogador} pm)`;
        } else {
            vencedor = 'empate';
            mensagem = 'Empate! Raios iguais';
        }
    } else {
        // Maior eletronegatividade vence
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
    }
    
    statusTexto.textContent = mensagem;
    
    // Atualiza pontuação
    if (vencedor === 'jogador') {
        pontosJogador1++;
        pontosJ1.textContent = pontosJogador1;
    } else if (vencedor === 'cpu') {
        pontosJogador2++;
        pontosJ2.textContent = pontosJogador2;
    }
    
    // Prepara próxima rodada
    setTimeout(() => {
        proximaRodada();
    }, 3000);
}

function proximaRodada() {
    // Pega novas cartas
    cartaAtualJogador = pegarProximaCarta(baralhoJogador);
    cartaAtualCPU = pegarProximaCarta(baralhoCPU);
    
    if (!cartaAtualJogador || !cartaAtualCPU) {
        // Fim de jogo
        anunciarVencedor();
        return;
    }
    
    // Mostra carta do jogador e oculta da CPU
    criarCarta(cartaAtualJogador, cartaJogador, true);
    criarCarta(cartaAtualCPU, cartaCPU, false);
    cartaCPU.classList.add('carta-oculta');
    
    // Habilita os botões
    botoesAtributos.forEach(botao => botao.disabled = false);
    
    statusTexto.textContent = "Escolha um atributo";
}

function anunciarVencedor() {
    let mensagemFinal = "Fim de Jogo! ";
    if (pontosJogador1 > pontosJogador2) {
        mensagemFinal += `${nomeJogador1} venceu!`;
    } else if (pontosJogador2 > pontosJogador1) {
        mensagemFinal += `${nomeJogador2} venceu!`;
    } else {
        mensagemFinal += "Empate!";
    }
    statusTexto.textContent = mensagemFinal;
    
    // Desabilita os botões
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
    
    // Distribui cartas
    distribuirCartas();
    
    // Inicia primeira rodada
    proximaRodada();
}

// Inicia o jogo quando a página carrega
iniciarJogo(); 