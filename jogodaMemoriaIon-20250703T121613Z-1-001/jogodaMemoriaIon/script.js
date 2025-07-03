"use strict"; // Ativa um modo mais seguro e rigoroso do JavaScript

// ELEMENTOS DO HTML
// Guardamos uma referência ao tabuleiro para não ter que buscá-lo toda hora.
const tabuleiro = document.getElementById('tabuleiro-jogo');

// --- DADOS DO JOGO ---
const dadosBaseCartas = [
    { nome: 'Sódio', simbolo: 'Na', quantidade: 3, carga: 1, imagem: 'imgs/Na.png' },
    { nome: 'Magnésio', simbolo: 'Mg', quantidade: 2, carga: 2, imagem: 'imgs/Mg.png' },
    { nome: 'Potássio', simbolo: 'K', quantidade: 5, carga: 1, imagem: 'imgs/K.png' },
    { nome: 'Alumínio', simbolo: 'Al', quantidade: 2, carga: 3, imagem: 'imgs/Al.png' },
    { nome: 'Cálcio', simbolo: 'Ca', quantidade: 1, carga: 2, imagem: 'imgs/Ca.png' },
    { nome: 'Bário', simbolo: 'Ba', quantidade: 1, carga: 2, imagem: 'imgs/Ba.png' },
    { nome: 'Lítio', simbolo: 'Li', quantidade: 1, carga: 1, imagem: 'imgs/Li.png' },
    { nome: 'Césio', simbolo: 'Cs', quantidade: 1, carga: 1, imagem: 'imgs/Cs.png' },
    { nome: 'Cloro', simbolo: 'Cl', quantidade: 6, carga: -1, imagem: 'imgs/Cl.png' },
    { nome: 'Oxigênio', simbolo: 'O', quantidade: 6, carga: -2, imagem: 'imgs/O.png' },
    { nome: 'Bromo', simbolo: 'Br', quantidade: 5, carga: -1, imagem: 'imgs/Br.png' },
    { nome: 'Iodo', simbolo: 'I', quantidade: 2, carga: -1, imagem: 'imgs/I.png' }
];

// ESTADO DO JOGO
// Variáveis que vão controlar o estado atual do jogo
let cartasViradas = []; // Array para guardar as 5 cartas que o jogador virou na rodada
let travarCliques = false; // Impede que o jogador clique em outras cartas enquanto uma combinação é verificada

// FUNÇÕES PRINCIPAIS
// Cria o baralho completo com base nos dados e quantidades.
function criarBaralho() {
    const baralho = [];
    dadosBaseCartas.forEach(tipoCarta => {
        for (let i = 0; i < tipoCarta.quantidade; i++) {
            baralho.push({ ...tipoCarta });
        }
    });
    return baralho;
}

// Embaralha um array de cartas usando o algoritmo Fisher-Yates.
function embaralhar(baralho) {
    for (let i = baralho.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
    }
}

// Cria os elementos HTML para cada carta e os adiciona ao tabuleiro.
function distribuirCartas(baralho) {
    // Limpa o tabuleiro antes de adicionar as novas cartas
    tabuleiro.innerHTML = ''; 
    baralho.forEach(infoCarta => {
        // Para cada carta no baralho, criamos a estrutura HTML: <div class="carta">...</div>
        const cartaElemento = document.createElement('div');
        cartaElemento.classList.add('carta');

        // Guarda os dados químicos da carta diretamente no elemento HTML.
        // Isso será MUITO útil depois para verificar as combinações!
        cartaElemento.dataset.simbolo = infoCarta.simbolo;
        cartaElemento.dataset.carga = infoCarta.carga;

        // Cria a face do verso
        const verso = document.createElement('div');
        verso.classList.add('face', 'verso');
        
        // Cria a face da frente
        const frente = document.createElement('div');
        frente.classList.add('face', 'frente');
        frente.style.backgroundImage = `url(${infoCarta.imagem})`; // Define a imagem do elemento

        // Adiciona as faces à carta
        cartaElemento.appendChild(verso);
        cartaElemento.appendChild(frente);

        // Adiciona o "ouvinte de evento" de clique. Quando a carta for clicada, a função virarCarta será chamada.
        cartaElemento.addEventListener('click', virarCarta);

        // Adiciona a carta completa ao tabuleiro
        tabuleiro.appendChild(cartaElemento);
    });
}

// Lida com o clique em uma carta.
function virarCarta(evento) {
    // Se os cliques estiverem travados ou se já tiver 5 cartas viradas, não faz nada.
    if (travarCliques || cartasViradas.length >= 5) return;

    const cartaClicada = evento.currentTarget; // Pega o elemento <div class="carta"> que foi clicado

    // Se a carta clicada já estiver virada, não faz nada.
    if (cartaClicada.classList.contains('virada')) return;

    // Vira a carta adicionando a classe 'virada' (o CSS cuida da animação)
    cartaClicada.classList.add('virada');

    // Adiciona a carta ao nosso array de controle da rodada
    cartasViradas.push(cartaClicada);

    // Se o jogador acabou de virar a 5ª carta...
    if (cartasViradas.length === 5) {
        console.log("5 cartas viradas! Verificando combinações...");
        // Trava os cliques para o jogador não interferir
        travarCliques = true; 
        
        // AQUI chamaremos a função para verificar as combinações.
        // Por enquanto, vamos apenas simular uma espera e depois virá-las de volta.
        setTimeout(() => {
            console.log("Rodada finalizada (simulação).");
            // Lógica para remover cartas ou virá-las de volta entrará aqui.
        }, 2000); // Espera 2 segundos
    }
}

// INÍCIO DO JOGO 
function iniciarJogo() {
    console.log("Iniciando o jogo...");
    const baralho = criarBaralho();
    embaralhar(baralho);
    distribuirCartas(baralho);
    cartasViradas = []; // Reseta o array de cartas da rodada
    travarCliques = false; // Garante que os cliques estão liberados no início
}

iniciarJogo();
