"use strict";

// Importar função de salvar partida do sistema de ranking
if (typeof salvarPartidaRanking !== 'function') {
    // Fallback se não conseguir importar
    function salvarPartidaRanking() {
        console.log('Sistema de ranking não disponível');
    }
}

// Sistema de dificuldade progressiva para equações químicas
const niveisDificuldade = {
    facil: [
        {
            reagentes: [{ formula: { H: 2 } }, { formula: { O: 2 } }],
            produtos: [{ formula: { H: 2, O: 1 } }],
            dica: "Formação da água - reação fundamental da química!",
            explicacao: "Hidrogênio + Oxigênio → Água",
            dificuldade: 1
        },
        {
            reagentes: [{ formula: { H: 2 } }, { formula: { Cl: 2 } }],
            produtos: [{ formula: { H: 2, Cl: 2 } }],
            dica: "Formação do gás clorídrico - ácido importante na indústria!",
            explicacao: "Hidrogênio + Cloro → Gás Clorídrico",
            dificuldade: 1
        }
    ],
    medio: [
        {
            reagentes: [{ formula: { N: 2 } }, { formula: { H: 2 } }],
            produtos: [{ formula: { N: 1, H: 3 } }],
            dica: "Síntese de Haber-Bosch - produção industrial de amônia!",
            explicacao: "Nitrogênio + Hidrogênio → Amônia",
            dificuldade: 2
        },
        {
            reagentes: [{ formula: { C: 1 } }, { formula: { O: 2 } }],
            produtos: [{ formula: { C: 1, O: 2 } }],
            dica: "Formação do monóxido de carbono - gás tóxico!",
            explicacao: "Carbono + Oxigênio → Monóxido de Carbono",
            dificuldade: 2
        }
    ],
    dificil: [
        {
            reagentes: [{ formula: { C: 1, H: 4 } }, { formula: { O: 2 } }],
            produtos: [{ formula: { C: 1, O: 2 } }, { formula: { H: 2, O: 1 } }],
            dica: "Combustão do metano - reação do gás natural!",
            explicacao: "Metano + Oxigênio → Dióxido de Carbono + Água",
            dificuldade: 3
        },
        {
            reagentes: [{ formula: { Fe: 1 } }, { formula: { O: 2 } }],
            produtos: [{ formula: { Fe: 2, O: 3 } }],
            dica: "Oxidação do ferro - formação da ferrugem!",
            explicacao: "Ferro + Oxigênio → Óxido de Ferro (Ferrugem)",
            dificuldade: 3
        },
        {
            reagentes: [{ formula: { P: 4 } }, { formula: { O: 2 } }],
            produtos: [{ formula: { P: 2, O: 5 } }],
            dica: "Combustão do fósforo branco - reação violenta!",
            explicacao: "Fósforo + Oxigênio → Pentóxido de Fósforo",
            dificuldade: 4
        }
    ],
    avancado: [
        {
            reagentes: [{ formula: { Al: 1 } }, { formula: { O: 2 } }],
            produtos: [{ formula: { Al: 2, O: 3 } }],
            dica: "Formação do óxido de alumínio - usado em cerâmicas!",
            explicacao: "Alumínio + Oxigênio → Óxido de Alumínio",
            dificuldade: 4
        },
        {
            reagentes: [{ formula: { Ca: 1 } }, { formula: { O: 2 } }],
            produtos: [{ formula: { Ca: 1, O: 1 } }],
            dica: "Formação do óxido de cálcio - cal virgem!",
            explicacao: "Cálcio + Oxigênio → Óxido de Cálcio",
            dificuldade: 4
        }
    ]
};

// Estado do jogo com sistema de progressão
let estadoJogo = {
    nivelAtual: 'facil',
    equacaoAtual: 0,
    equacoesPorNivel: 2,
    pontos: 0,
    nivelCompleto: false,
    progressoNivel: 0
};

// Referências do DOM
const areaEquacao = document.getElementById('area-equacao');
const opcoesCoeficientes = document.getElementById('opcoes-coeficientes');
const areaContagem = document.getElementById('area-contagem');
const statusTexto = document.getElementById('status-texto');
const botaoProxima = document.getElementById('botao-proxima');
const pontosEl = document.getElementById('pontos-j1');
const nivelTexto = document.getElementById('nivel-texto');
const progressoFill = document.getElementById('progresso-fill');
const equacaoCounter = document.getElementById('equacao-counter');

// Estado do jogo (mantido para compatibilidade)
let equacaoAtual;
let coeficientes;
let pontos = 0;
let nomeJogador1 = localStorage.getItem('nomeJogador1') || "Jogador 1";
let nomeJogador2 = localStorage.getItem('nomeJogador2') || "Jogador 2";
let nomeEquipeCustom = localStorage.getItem('nomeEquipe') || "Equipe";

// Funções do jogo
function iniciarJogo() {
    // Inicializar sistema de progresso
    estadoJogo = {
        nivelAtual: 'facil',
        equacaoAtual: 0,
        equacoesPorNivel: 2,
        pontos: 0,
        nivelCompleto: false,
        progressoNivel: 0
    };

    gerarCoeficientesArrastaveis();
    atualizarInterface();

    // Garantir que a interface seja atualizada antes de carregar a equação
    setTimeout(() => {
        carregarProximaEquacao();
        botaoProxima.addEventListener('click', avancarParaProximaEquacao);
    }, 100);
}

// Carrega a próxima equação baseada no sistema de progressão
function carregarProximaEquacao() {
    const nivel = niveisDificuldade[estadoJogo.nivelAtual];
    const indiceEquacao = estadoJogo.equacaoAtual;

    if (indiceEquacao >= nivel.length) {
        // Nível completo, avançar para o próximo nível
        avancarNivel();
        return;
    }

    equacaoAtual = nivel[indiceEquacao];

    // Reset completo do estado da equação anterior
    resetEstadoEquacao();

    coeficientes = {
        reagentes: Array(equacaoAtual.reagentes.length).fill(1),
        produtos: Array(equacaoAtual.produtos.length).fill(1)
    };

    renderizarEquacao();
    atualizarContagem();
    atualizarInterface();

    botaoProxima.disabled = true;
    tocarClick();
}

function avancarNivel() {
    const niveis = ['facil', 'medio', 'dificil', 'avancado'];
    const indiceAtual = niveis.indexOf(estadoJogo.nivelAtual);

    if (indiceAtual >= niveis.length - 1) {
        // Último nível completo - jogo terminado
        finalizarJogo();
        return;
    }

    // Avançar para o próximo nível
    estadoJogo.nivelAtual = niveis[indiceAtual + 1];
    estadoJogo.equacaoAtual = 0;
    estadoJogo.nivelCompleto = false;

    statusTexto.textContent = `Parabéns! Nível ${estadoJogo.nivelAtual} desbloqueado!`;
    tocarVitoriaFinal();

    setTimeout(() => {
        carregarProximaEquacao();
    }, 2000);
}

function finalizarJogo() {
    statusTexto.textContent = `🎉 Parabéns! Você completou todos os níveis! Pontuação final: ${estadoJogo.pontos}`;
    botaoProxima.disabled = true;
    tocarVitoriaFinal();

    // Salvar partida final no ranking
    const jogo = 'Balanceamento de Equações';
    salvarPartida(nomeEquipeCustom || nomeJogador1, 'Sistema', estadoJogo.pontos, 0, jogo, 'avancado', 0);
}

function atualizarInterface() {
    // Verificar se os elementos existem antes de tentar acessá-los
    if (!nivelTexto || !equacaoCounter || !progressoFill) {
        return;
    }

    // Atualizar nível
    nivelTexto.textContent = estadoJogo.nivelAtual.charAt(0).toUpperCase() + estadoJogo.nivelAtual.slice(1);

    // Atualizar contador de equação
    const nivel = niveisDificuldade[estadoJogo.nivelAtual];
    if (nivel) {
        equacaoCounter.textContent = `Equação ${estadoJogo.equacaoAtual + 1}/${nivel.length}`;

        // Atualizar barra de progresso
        const progresso = ((estadoJogo.equacaoAtual + 1) / nivel.length) * 100;
        progressoFill.style.width = `${progresso}%`;
    }

    // Atualizar status apenas se equacaoAtual existir
    if (equacaoAtual) {
        if (equacaoAtual.explicacao) {
            statusTexto.textContent = `${equacaoAtual.dica} ${equacaoAtual.explicacao} - ${nomeEquipeCustom}: ${nomeJogador1} e ${nomeJogador2}, trabalhem juntos! Arraste os coeficientes para balancear!`;
        } else {
            statusTexto.textContent = `${equacaoAtual.dica} - ${nomeEquipeCustom}: ${nomeJogador1} e ${nomeJogador2}, trabalhem juntos! Arraste os coeficientes para balancear!`;
        }
    }
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

            // Marca que o jogador interagiu
            jogadorInteragiuComCoeficientes = true;

            atualizarContagem();
        });
    });
}

// Atualiza a contagem conforme o resultado final e corresponde balanceamento
function atualizarContagem() {
    // Só atualiza se temos uma equação carregada
    if (!equacaoAtual) return;

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
    // Só verifica balanceamento se houve interação do jogador
    if (jogadorInteragiu()) {
        verificarBalanceamento(contagens);
    }
}

// Variável para rastrear se o jogador interagiu
let jogadorInteragiuComCoeficientes = false;

function jogadorInteragiu() {
    return jogadorInteragiuComCoeficientes;
}

// Realiza contagem de elemento a partir do div do reagente
function renderizarContagem(contagens) {
    if (!areaContagem) return;

    areaContagem.innerHTML = '';

    // Se não houve interação do jogador, mostra mensagem inicial organizada
    if (!jogadorInteragiu()) {
        const mensagemInicial = document.createElement('div');
        mensagemInicial.className = 'mensagem-inicial-contagem';
        mensagemInicial.innerHTML = `
            <div class="mensagem-conteudo">
                <h4>📊 Contagem de Átomos</h4>
                <p>Arraste os coeficientes numéricos para os espaços da equação.</p>
                <p>A contagem aparecerá aqui automaticamente!</p>
            </div>
        `;
        areaContagem.appendChild(mensagemInicial);
        return;
    }

    // Se há elementos para contar, exibe a contagem
    const elementos = Object.keys(contagens);
    if (elementos.length === 0) {
        return;
    }

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
    console.log('Verificando balanceamento...', { contagens, jogadorInteragiu: jogadorInteragiu() });

    let tudoBalanceado = true;
    for (const elemento in contagens) {
        const cont = contagens[elemento];
        const el = document.getElementById(`contador-${elemento}`);
        if (el) {
            if (cont.reagentes === cont.produtos && cont.reagentes > 0) {
                el.classList.add('balanceado');
            } else {
                el.classList.remove('balanceado');
                tudoBalanceado = false;
            }
        }
    }

    if (tudoBalanceado) {
        console.log('Equação balanceada detectada');
        // Só avança automaticamente se o jogador interagiu
        if (jogadorInteragiu()) {
            console.log('Jogador interagiu, avançando automaticamente');
            // Calcular pontos baseado na dificuldade
            const pontosGanhos = calcularPontosPorDificuldade(equacaoAtual.dificuldade);
            estadoJogo.pontos += pontosGanhos;

            statusTexto.textContent = `Equação Balanceada! +${pontosGanhos} pontos! Parabéns ${nomeEquipeCustom}!`;
            botaoProxima.disabled = false;
            pontosEl.textContent = estadoJogo.pontos;
            tocarCombinacao();

            // Avançar para próxima equação após um delay
            setTimeout(() => {
                avancarParaProximaEquacao();
            }, 2000);
        } else {
            console.log('Jogador não interagiu, mostrando opção manual');
            // Se não houve interação, apenas marca visualmente como balanceado mas não avança
            statusTexto.textContent = `Equação já estava balanceada! Ajuste os coeficientes se necessário ou clique em "Próxima Equação".`;
            botaoProxima.disabled = false;
        }
    }
}

function calcularPontosPorDificuldade(dificuldade) {
    switch (dificuldade) {
        case 1: return 10;  // Fácil
        case 2: return 15;  // Médio
        case 3: return 20;  // Difícil
        case 4: return 25;  // Avançado
        default: return 10;
    }
}

function avancarParaProximaEquacao() {
    console.log('Avançando para próxima equação...', estadoJogo);

    estadoJogo.equacaoAtual++;
    estadoJogo.progressoNivel++;

    if (estadoJogo.equacaoAtual >= niveisDificuldade[estadoJogo.nivelAtual].length) {
        // Verificar se completou o nível
        if (estadoJogo.progressoNivel >= estadoJogo.equacoesPorNivel) {
            avancarNivel();
        }
    } else {
        carregarProximaEquacao();
    }
}

function resetEstadoEquacao() {
    // Reset completo do estado da equação atual
    jogadorInteragiuComCoeficientes = false;

    // Limpar áreas visuais
    if (areaEquacao) areaEquacao.innerHTML = '';
    if (areaContagem) areaContagem.innerHTML = '';

    // Reset dos coeficientes para valores padrão
    if (equacaoAtual) {
        coeficientes = {
            reagentes: Array(equacaoAtual.reagentes.length).fill(1),
            produtos: Array(equacaoAtual.produtos.length).fill(1)
        };
    }
}

iniciarJogo();