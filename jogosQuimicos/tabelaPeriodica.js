"use strict";

// Referências do DOM
const tabelaPeriodica = document.getElementById('tabela-periodica');
const elementosPaleta = document.getElementById('elementos-paleta');
const statusTexto = document.getElementById('status-texto');
const nivelTexto = document.getElementById('nivel-texto');
const progressoFill = document.getElementById('progresso-fill');
const pontosEquipe = document.getElementById('pontos-equipe');
const selectModo = document.getElementById('select-modo');
const toggleNumeros = document.getElementById('toggle-numeros');
const toggleSimbolos = document.getElementById('toggle-simbolos');
const botaoNovoJogo = document.getElementById('botao-novo-jogo');
const botaoDica = document.getElementById('botao-dica');

// Dados dos elementos químicos com suas posições na tabela periódica
const elementosQuimicos = [
    // Período 1
    { numero: 1, simbolo: 'H', nome: 'Hidrogênio', grupo: 1, periodo: 1, categoria: 'não-metal' },
    { numero: 2, simbolo: 'He', nome: 'Hélio', grupo: 18, periodo: 1, categoria: 'gás nobre' },

    // Período 2
    { numero: 3, simbolo: 'Li', nome: 'Lítio', grupo: 1, periodo: 2, categoria: 'metal alcalino' },
    { numero: 4, simbolo: 'Be', nome: 'Berílio', grupo: 2, periodo: 2, categoria: 'metal alcalino-terroso' },
    { numero: 5, simbolo: 'B', nome: 'Boro', grupo: 13, periodo: 2, categoria: 'semimetal' },
    { numero: 6, simbolo: 'C', nome: 'Carbono', grupo: 14, periodo: 2, categoria: 'não-metal' },
    { numero: 7, simbolo: 'N', nome: 'Nitrogênio', grupo: 15, periodo: 2, categoria: 'não-metal' },
    { numero: 8, simbolo: 'O', nome: 'Oxigênio', grupo: 16, periodo: 2, categoria: 'não-metal' },
    { numero: 9, simbolo: 'F', nome: 'Flúor', grupo: 17, periodo: 2, categoria: 'não-metal' },
    { numero: 10, simbolo: 'Ne', nome: 'Neônio', grupo: 18, periodo: 2, categoria: 'gás nobre' },

    // Período 3
    { numero: 11, simbolo: 'Na', nome: 'Sódio', grupo: 1, periodo: 3, categoria: 'metal alcalino' },
    { numero: 12, simbolo: 'Mg', nome: 'Magnésio', grupo: 2, periodo: 3, categoria: 'metal alcalino-terroso' },
    { numero: 13, simbolo: 'Al', nome: 'Alumínio', grupo: 13, periodo: 3, categoria: 'metal' },
    { numero: 14, simbolo: 'Si', nome: 'Silício', grupo: 14, periodo: 3, categoria: 'semimetal' },
    { numero: 15, simbolo: 'P', nome: 'Fósforo', grupo: 15, periodo: 3, categoria: 'não-metal' },
    { numero: 16, simbolo: 'S', nome: 'Enxofre', grupo: 16, periodo: 3, categoria: 'não-metal' },
    { numero: 17, simbolo: 'Cl', nome: 'Cloro', grupo: 17, periodo: 3, categoria: 'não-metal' },
    { numero: 18, simbolo: 'Ar', nome: 'Argônio', grupo: 18, periodo: 3, categoria: 'gás nobre' },

    // Período 4
    { numero: 19, simbolo: 'K', nome: 'Potássio', grupo: 1, periodo: 4, categoria: 'metal alcalino' },
    { numero: 20, simbolo: 'Ca', nome: 'Cálcio', grupo: 2, periodo: 4, categoria: 'metal alcalino-terroso' },
    { numero: 21, simbolo: 'Sc', nome: 'Escândio', grupo: 3, periodo: 4, categoria: 'metal de transição' },
    { numero: 22, simbolo: 'Ti', nome: 'Titânio', grupo: 4, periodo: 4, categoria: 'metal de transição' },
    { numero: 23, simbolo: 'V', nome: 'Vanádio', grupo: 5, periodo: 4, categoria: 'metal de transição' },
    { numero: 24, simbolo: 'Cr', nome: 'Cromo', grupo: 6, periodo: 4, categoria: 'metal de transição' },
    { numero: 25, simbolo: 'Mn', nome: 'Manganês', grupo: 7, periodo: 4, categoria: 'metal de transição' },
    { numero: 26, simbolo: 'Fe', nome: 'Ferro', grupo: 8, periodo: 4, categoria: 'metal de transição' },
    { numero: 27, simbolo: 'Co', nome: 'Cobalto', grupo: 9, periodo: 4, categoria: 'metal de transição' },
    { numero: 28, simbolo: 'Ni', nome: 'Níquel', grupo: 10, periodo: 4, categoria: 'metal de transição' },
    { numero: 29, simbolo: 'Cu', nome: 'Cobre', grupo: 11, periodo: 4, categoria: 'metal de transição' },
    { numero: 30, simbolo: 'Zn', nome: 'Zinco', grupo: 12, periodo: 4, categoria: 'metal de transição' },
    { numero: 31, simbolo: 'Ga', nome: 'Gálio', grupo: 13, periodo: 4, categoria: 'metal' },
    { numero: 32, simbolo: 'Ge', nome: 'Germânio', grupo: 14, periodo: 4, categoria: 'semimetal' },
    { numero: 33, simbolo: 'As', nome: 'Arsênio', grupo: 15, periodo: 4, categoria: 'semimetal' },
    { numero: 34, simbolo: 'Se', nome: 'Selênio', grupo: 16, periodo: 4, categoria: 'não-metal' },
    { numero: 35, simbolo: 'Br', nome: 'Bromo', grupo: 17, periodo: 4, categoria: 'não-metal' },
    { numero: 36, simbolo: 'Kr', nome: 'Criptônio', grupo: 18, periodo: 4, categoria: 'gás nobre' }
];

// Estado do jogo
let jogoAtual = {
    modo: 'periodos',
    elementosSelecionados: [],
    elementosPosicionados: new Set(),
    elementosCorretos: 0,
    pontos: 0,
    dicasUsadas: 0,
    maximoDicas: 3
};

// Função para obter elementos baseado no modo de jogo
function obterElementosPorModo(modo) {
    switch (modo) {
        case 'grupos':
            // Apenas elementos dos grupos principais (1, 2, 13-18)
            return elementosQuimicos.filter(el =>
                [1, 2, 13, 14, 15, 16, 17, 18].includes(el.grupo)
            );
        case 'periodos':
            // Elementos até o período 4
            return elementosQuimicos.filter(el => el.periodo <= 4);
        case 'completo':
        default:
            // Todos os elementos disponíveis
            return elementosQuimicos.slice(0, 36); // Limitado aos primeiros 36 elementos
    }
}

// Função para criar a tabela periódica
function criarTabela() {
    tabelaPeriodica.innerHTML = '';

    // Criar grid de 7 períodos x 18 grupos (com espaços para o layout tradicional)
    for (let periodo = 1; periodo <= 7; periodo++) {
        for (let grupo = 1; grupo <= 18; grupo++) {
            const elementoDiv = document.createElement('div');
            elementoDiv.className = 'elemento vazio';
            elementoDiv.dataset.periodo = periodo;
            elementoDiv.dataset.grupo = grupo;

            // Adicionar elementos específicos se existirem
            const elemento = elementosQuimicos.find(el => el.periodo === periodo && el.grupo === grupo);
            if (elemento) {
                elementoDiv.className = 'elemento';
                elementoDiv.dataset.numero = elemento.numero;
                elementoDiv.dataset.simbolo = elemento.simbolo;
                elementoDiv.dataset.nome = elemento.nome;
                elementoDiv.dataset.categoria = elemento.categoria;

                if (toggleNumeros.checked) {
                    elementoDiv.innerHTML = `<div class="elemento-numero">${elemento.numero}</div>`;
                }

                if (toggleSimbolos.checked) {
                    elementoDiv.innerHTML += `<div class="elemento-simbolo">${elemento.simbolo}</div>`;
                }

                elementoDiv.innerHTML += `<div class="elemento-nome">${elemento.nome}</div>`;

                // Adicionar eventos de drag and drop
                elementoDiv.addEventListener('dragover', permitirDrop);
                elementoDiv.addEventListener('drop', soltarElemento);
                elementoDiv.addEventListener('dragleave', removerHover);

                // Tooltip com informações
                elementoDiv.addEventListener('mouseenter', mostrarTooltip);
                elementoDiv.addEventListener('mouseleave', ocultarTooltip);
            }

            tabelaPeriodica.appendChild(elementoDiv);
        }
    }
}

// Função para criar elementos arrastáveis
function criarElementosArrastaveis() {
    elementosPaleta.innerHTML = '';
    const elementos = obterElementosPorModo(jogoAtual.modo);

    // Embaralhar elementos
    const elementosEmbaralhados = [...elementos].sort(() => Math.random() - 0.5);

    elementosEmbaralhados.forEach(elemento => {
        const elementoDiv = document.createElement('div');
        elementoDiv.className = 'elemento-arrastavel';
        elementoDiv.dataset.numero = elemento.numero;
        elementoDiv.dataset.simbolo = elemento.simbolo;
        elementoDiv.dataset.nome = elemento.nome;
        elementoDiv.dataset.grupo = elemento.grupo;
        elementoDiv.dataset.periodo = elemento.periodo;
        elementoDiv.draggable = true;

        elementoDiv.innerHTML = `
            <div class="elemento-arrastavel-numero">${elemento.numero}</div>
            <div class="elemento-arrastavel-simbolo">${elemento.simbolo}</div>
            <div class="elemento-arrastavel-nome">${elemento.nome}</div>
        `;

        // Eventos de drag
        elementoDiv.addEventListener('dragstart', iniciarDrag);
        elementoDiv.addEventListener('dragend', finalizarDrag);

        elementosPaleta.appendChild(elementoDiv);
        jogoAtual.elementosSelecionados.push(elemento);
    });
}

// Eventos de drag and drop
function iniciarDrag(e) {
    e.dataTransfer.setData('text/plain', JSON.stringify({
        numero: e.target.dataset.numero,
        simbolo: e.target.dataset.simbolo,
        nome: e.target.dataset.nome,
        grupo: e.target.dataset.grupo,
        periodo: e.target.dataset.periodo
    }));
    e.target.style.opacity = '0.5';
    tocarClick();
}

function finalizarDrag(e) {
    e.target.style.opacity = '1';
}

function permitirDrop(e) {
    e.preventDefault();
    e.target.classList.add('drop-target');
}

function removerHover(e) {
    e.target.classList.remove('drop-target');
}

function soltarElemento(e) {
    e.preventDefault();
    e.target.classList.remove('drop-target');

    const elementoData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const elementoAlvo = e.target;

    // Verificar se é uma posição válida e está vazia
    if (elementoAlvo.classList.contains('elemento') &&
        elementoAlvo.classList.contains('vazio') === false) {
        return; // Posição já ocupada
    }

    // Verificar se o elemento está na posição correta
    const periodoCorreto = parseInt(elementoData.periodo);
    const grupoCorreto = parseInt(elementoData.grupo);
    const periodoAlvo = parseInt(elementoAlvo.dataset.periodo);
    const grupoAlvo = parseInt(elementoAlvo.dataset.grupo);

    if (periodoCorreto === periodoAlvo && grupoCorreto === grupoAlvo) {
        // Posição correta
        posicionarElementoCorreto(elementoAlvo, elementoData);
        tocarCombinacao();
    } else {
        // Posição incorreta
        posicionarElementoIncorreto(elementoAlvo, elementoData);
        tocarSomEmpate();
    }

    // Atualizar progresso
    atualizarProgresso();
}

// Funções auxiliares para posicionamento
function posicionarElementoCorreto(alvo, elemento) {
    alvo.classList.remove('vazio');
    alvo.classList.add('correto');
    alvo.dataset.numero = elemento.numero;
    alvo.dataset.simbolo = elemento.simbolo;
    alvo.dataset.nome = elemento.nome;
    alvo.dataset.categoria = elemento.categoria;

    // Atualizar conteúdo visual
    atualizarConteudoElemento(alvo, elemento);

    jogoAtual.elementosPosicionados.add(elemento.numero);
    jogoAtual.elementosCorretos++;

    // Remover elemento da paleta
    const elementoArrastavel = document.querySelector(`[data-numero="${elemento.numero}"].elemento-arrastavel`);
    if (elementoArrastavel) {
        elementoArrastavel.remove();
    }
}

function posicionarElementoIncorreto(alvo, elemento) {
    alvo.classList.add('incorreto');
    setTimeout(() => {
        alvo.classList.remove('incorreto');
    }, 1000);

    statusTexto.textContent = `Elemento ${elemento.nome} não pertence a esta posição!`;
    setTimeout(() => {
        statusTexto.textContent = "Arraste os elementos para seus lugares corretos na tabela periódica!";
    }, 2000);
}

function atualizarConteudoElemento(elemento, data) {
    elemento.innerHTML = '';

    if (toggleNumeros.checked) {
        elemento.innerHTML += `<div class="elemento-numero">${data.numero}</div>`;
    }

    if (toggleSimbolos.checked) {
        elemento.innerHTML += `<div class="elemento-simbolo">${data.simbolo}</div>`;
    }

    elemento.innerHTML += `<div class="elemento-nome">${data.nome}</div>`;
}

// Função para atualizar progresso
function atualizarProgresso() {
    const totalElementos = jogoAtual.elementosSelecionados.length;
    const progresso = (jogoAtual.elementosCorretos / totalElementos) * 100;

    progressoFill.style.width = `${progresso}%`;

    if (jogoAtual.elementosCorretos === totalElementos) {
        completarJogo();
    }
}

// Função para completar o jogo
function completarJogo() {
    const pontosGanhos = calcularPontos();
    jogoAtual.pontos += pontosGanhos;
    pontosEquipe.textContent = jogoAtual.pontos;

    statusTexto.textContent = `Parabéns! Tabela completa! +${pontosGanhos} pontos!`;
    tocarVitoriaFinal();

    setTimeout(() => {
        statusTexto.textContent = "Jogo concluído! Clique em 'Novo Jogo' para continuar.";
    }, 3000);
}

// Função para calcular pontos
function calcularPontos() {
    const elementosRestantes = jogoAtual.elementosSelecionados.length - jogoAtual.elementosCorretos;
    const bonusDicas = Math.max(0, jogoAtual.maximoDicas - jogoAtual.dicasUsadas);
    return elementosRestantes * 10 + bonusDicas * 5;
}

// Sistema de dicas
function mostrarDica() {
    if (jogoAtual.dicasUsadas >= jogoAtual.maximoDicas) {
        statusTexto.textContent = "Todas as dicas foram usadas!";
        return;
    }

    const elementosErrados = jogoAtual.elementosSelecionados.filter(el =>
        !jogoAtual.elementosPosicionados.has(el.numero)
    );

    if (elementosErrados.length === 0) {
        statusTexto.textContent = "Todos os elementos estão posicionados!";
        return;
    }

    const elementoAleatorio = elementosErrados[Math.floor(Math.random() * elementosErrados.length)];
    const periodoCorreto = elementoAleatorio.periodo;
    const grupoCorreto = elementoAleatorio.grupo;

    jogoAtual.dicasUsadas++;

    let mensagem = `Dica ${jogoAtual.dicasUsadas}/${jogoAtual.maximoDicas}: `;
    mensagem += `O elemento ${elementoAleatorio.nome} (${elementoAleatorio.simbolo}) `;
    mensagem += `pertence ao período ${periodoCorreto}, grupo ${grupoCorreto}.`;

    statusTexto.textContent = mensagem;
    tocarClick();

    setTimeout(() => {
        statusTexto.textContent = "Arraste os elementos para seus lugares corretos na tabela periódica!";
    }, 5000);
}

// Tooltip
function mostrarTooltip(e) {
    const elemento = e.target;
    if (elemento.classList.contains('elemento') && elemento.dataset.nome) {
        const tooltip = document.createElement('div');
        tooltip.className = 'dica-tooltip';
        tooltip.innerHTML = `
            <strong>${elemento.dataset.nome}</strong><br>
            Número atômico: ${elemento.dataset.numero}<br>
            Símbolo: ${elemento.dataset.simbolo}<br>
            Categoria: ${elemento.dataset.categoria}
        `;

        document.body.appendChild(tooltip);

        const rect = elemento.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - 125}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;

        setTimeout(() => tooltip.classList.add('visivel'), 10);
        elemento._tooltip = tooltip;
    }
}

function ocultarTooltip(e) {
    const tooltip = e.target._tooltip;
    if (tooltip) {
        tooltip.classList.remove('visivel');
        setTimeout(() => tooltip.remove(), 300);
        delete e.target._tooltip;
    }
}

// Função para iniciar novo jogo
function iniciarNovoJogo() {
    jogoAtual = {
        modo: selectModo.value,
        elementosSelecionados: [],
        elementosPosicionados: new Set(),
        elementosCorretos: 0,
        pontos: jogoAtual.pontos, // Manter pontos acumulados
        dicasUsadas: 0,
        maximoDicas: 3
    };

    nivelTexto.textContent = `Nível: ${selectModo.options[selectModo.selectedIndex].text}`;
    statusTexto.textContent = "Arraste os elementos para seus lugares corretos na tabela periódica!";
    progressoFill.style.width = '0%';

    criarTabela();
    criarElementosArrastaveis();
    tocarClick();
}

// Event listeners
botaoNovoJogo.addEventListener('click', iniciarNovoJogo);
botaoDica.addEventListener('click', mostrarDica);
selectModo.addEventListener('change', iniciarNovoJogo);
toggleNumeros.addEventListener('change', () => {
    document.querySelectorAll('.elemento').forEach(el => {
        const numeroDiv = el.querySelector('.elemento-numero');
        if (toggleNumeros.checked) {
            if (!numeroDiv) {
                const numero = document.createElement('div');
                numero.className = 'elemento-numero';
                numero.textContent = el.dataset.numero;
                el.insertBefore(numero, el.firstChild);
            }
        } else {
            if (numeroDiv) numeroDiv.remove();
        }
    });
});

toggleSimbolos.addEventListener('change', () => {
    document.querySelectorAll('.elemento').forEach(el => {
        const simboloDiv = el.querySelector('.elemento-simbolo');
        if (toggleSimbolos.checked) {
            if (!simboloDiv) {
                const simbolo = document.createElement('div');
                simbolo.className = 'elemento-simbolo';
                simbolo.textContent = el.dataset.simbolo;
                el.appendChild(simbolo);
            }
        } else {
            if (simboloDiv) simboloDiv.remove();
        }
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    iniciarNovoJogo();
});
