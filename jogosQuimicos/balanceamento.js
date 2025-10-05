"use strict";

// Dados do jogo
const equacoes = [
    {
        reagentes: [{ formula: { H: 2 } }, { formula: { O: 2 } }],
        produtos: [{ formula: { H: 2, O: 1 } }],
        dica: "A famosa reação de formação da água!"
    },
    {
        reagentes: [{ formula: { N: 2 } }, { formula: { H: 2 } }],
        produtos: [{ formula: { N: 1, H: 3 } }],
        dica: "Síntese de Haber-Bosch, para produzir amônia."
    },
    {
        reagentes: [{ formula: { C: 1, H: 4 } }, { formula: { O: 2 } }],
        produtos: [{ formula: { C: 1, O: 2 } }, { formula: { H: 2, O: 1 } }],
        dica: "Queima do gás metano, presente no gás natural."
    },
    {
        reagentes: [{ formula: { Fe: 1 } }, { formula: { O: 2 } }],
        produtos: [{ formula: { Fe: 2, O: 3 } }],
        dica: "A reação que forma a ferrugem (óxido de ferro)."
    },
    {
        reagentes: [{ formula: { P: 4 } }, { formula: { O: 2 } }],
        produtos: [{ formula: { P: 2, O: 5 } }],
        dica: "Combustão do fósforo branco."
    }
];

// Referências do DOM
const areaEquacao = document.getElementById('area-equacao');
const opcoesCoeficientes = document.getElementById('opcoes-coeficientes');
const areaContagem = document.getElementById('area-contagem');
const statusTexto = document.getElementById('status-texto');
const botaoProxima = document.getElementById('botao-proxima');
const pontosEl = document.getElementById('pontos-j1');

// Estado do jogo
let equacaoAtual;
let coeficientes;
let pontos = 0;
let nomeJogador1 = localStorage.getItem('nomeJogador1') || "Jogador 1";
let nomeJogador2 = localStorage.getItem('nomeJogador2') || "Jogador 2";
let nomeEquipeCustom = localStorage.getItem('nomeEquipe') || "Equipe";

// Funções do jogo
function iniciarJogo() {
    gerarCoeficientesArrastaveis();
    carregarProximaEquacao();
    botaoProxima.addEventListener('click', carregarProximaEquacao);
}

// Carrega a próxima equação química aleatoriamente
function carregarProximaEquacao() {
    equacaoAtual = equacoes[Math.floor(Math.random() * equacoes.length)];
    coeficientes = {
        reagentes: Array(equacaoAtual.reagentes.length).fill(1),
        produtos: Array(equacaoAtual.produtos.length).fill(1)
    };
    renderizarEquacao();
    atualizarContagem();
    statusTexto.textContent = `${equacaoAtual.dica} - ${nomeEquipeCustom}: ${nomeJogador1} e ${nomeJogador2}, trabalhem juntos!`;
    botaoProxima.disabled = true;
    tocarClick();
}

function renderizarEquacao() {
    areaEquacao.innerHTML = '';

    const criarParteEquacao = (moleculas, tipo) => {
        moleculas.forEach((mol, index) => {
            const slot = document.createElement('div');
            slot.className = 'coeficiente-slot';
            slot.dataset.tipo = tipo;
            slot.dataset.index = index;
            slot.textContent = coeficientes[tipo][index];
            areaEquacao.appendChild(slot);

            // Adiciona a fórmula
            const formulaEl = document.createElement('div');
            formulaEl.className = 'formula-quimica';
            formulaEl.innerHTML = formatarFormula(mol.formula);
            areaEquacao.appendChild(formulaEl);

            // Adiciona o sinal de '+' se não for o último
            if (index < moleculas.length - 1) {
                const plus = document.createElement('div');
                plus.textContent = '+';
                areaEquacao.appendChild(plus);
            }
        });
    };

    criarParteEquacao(equacaoAtual.reagentes, 'reagentes');

    const seta = document.createElement('div');
    seta.className = 'seta-reacao';
    seta.textContent = '→';
    areaEquacao.appendChild(seta);

    criarParteEquacao(equacaoAtual.produtos, 'produtos');
    adicionarEventosDeDrop();
}

function formatarFormula(formula) {
    let html = '';
    for (const elemento in formula) {
        html += elemento;
        if (formula[elemento] > 1) {
            html += `<sub>${formula[elemento]}</sub>`;
        }
    }
    return html;
}

function gerarCoeficientesArrastaveis() {
    opcoesCoeficientes.innerHTML = '';
    for (let i = 1; i <= 6; i++) {
        const coefEl = document.createElement('div');
        coefEl.className = 'coeficiente-draggable';
        coefEl.textContent = i;
        coefEl.draggable = true;
        coefEl.dataset.valor = i;
        coefEl.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', i);
        });
        opcoesCoeficientes.appendChild(coefEl);
    }
}

function adicionarEventosDeDrop() {
    const slots = document.querySelectorAll('.coeficiente-slot');
    slots.forEach(slot => {
        slot.addEventListener('dragover', e => {
            e.preventDefault();
            slot.classList.add('hover');
        });
        slot.addEventListener('dragleave', () => slot.classList.remove('hover'));
        slot.addEventListener('drop', e => {
            e.preventDefault();
            slot.classList.remove('hover');
            const valor = e.dataTransfer.getData('text/plain');
            const tipo = slot.dataset.tipo;
            const index = parseInt(slot.dataset.index);

            coeficientes[tipo][index] = parseInt(valor);
            slot.textContent = valor;
            tocarVirarCarta();
            atualizarContagem();
        });
    });
}

// Atualiza a contagem conforme o resultado final e corresponde balanceamento
function atualizarContagem() {
    const contagens = {}; // Contagem de início nula

    const contarAtomos = (moleculas, coefs, lado) => {
        moleculas.forEach((mol, index) => {
            const coef = coefs[index];
            for (const elemento in mol.formula) {
                if (!contagens[elemento]) contagens[elemento] = { reagentes: 0, produtos: 0 };
                contagens[elemento][lado] += mol.formula[elemento] * coef;
            }
        });
    };

    contarAtomos(equacaoAtual.reagentes, coeficientes.reagentes, 'reagentes');
    contarAtomos(equacaoAtual.produtos, coeficientes.produtos, 'produtos');

    renderizarContagem(contagens);
    verificarBalanceamento(contagens);
}

// Realiza contagem de elemento a partir do div do reagente
function renderizarContagem(contagens) {
    areaContagem.innerHTML = '';
    for (const elemento in contagens) {
        const cont = contagens[elemento];
        const el = document.createElement('div');
        el.className = 'contador-atomo';
        el.id = `contador-${elemento}`;
        el.innerHTML = `
            <div class="simbolo">${elemento}</div>
            <div class="contagem">
                <span>${cont.reagentes}</span>
                <span>${cont.produtos}</span>
            </div>
        `;
        areaContagem.appendChild(el);
    }
}

// Conta balanceamento pela contagem de reagentes
function verificarBalanceamento(contagens) {
    let tudoBalanceado = true;
    for (const elemento in contagens) {
        const cont = contagens[elemento];
        const el = document.getElementById(`contador-${elemento}`);
        if (cont.reagentes === cont.produtos && cont.reagentes > 0) {
            el.classList.add('balanceado');
        } else {
            el.classList.remove('balanceado');
            tudoBalanceado = false;
        }
    }

    if (tudoBalanceado) {
        statusTexto.textContent = `Equação Balanceada! Parabéns ${nomeEquipeCustom}: ${nomeJogador1} e ${nomeJogador2}!`;
        botaoProxima.disabled = false;
        pontos++;
        pontosEl.textContent = pontos;
        tocarCombinacao();
    }
}

iniciarJogo();