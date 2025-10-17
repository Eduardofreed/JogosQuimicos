// Sistema de Ranking Aprimorado - Jogos Químicos

const RANKING_KEY = 'jogosQuimicosRanking';
const ESTATISTICAS_KEY = 'jogosQuimicosEstatisticas';
const CONQUISTAS_KEY = 'jogosQuimicosConquistas';

// Função para salvar o histórico de uma partida com dados aprimorados
function salvarPartida(jogador1, jogador2, pontos1, pontos2, jogo, dificuldade = 'normal', tempoGasto = 0) {
    const historico = JSON.parse(localStorage.getItem(RANKING_KEY)) || [];
    const dataHora = new Date().toISOString();

    historico.push({
        id: Date.now(),
        jogo: jogo,
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR'),
        dataHora: dataHora,
        jogador1: jogador1,
        jogador2: jogador2,
        pontos1: pontos1,
        pontos2: pontos2,
        dificuldade: dificuldade,
        tempoGasto: tempoGasto,
        vencedor: pontos1 > pontos2 ? jogador1 : pontos2 > pontos1 ? jogador2 : 'empate'
    });

    // Manter apenas as últimas 1000 partidas
    if (historico.length > 1000) {
        historico.splice(0, historico.length - 1000);
    }

    localStorage.setItem(RANKING_KEY, JSON.stringify(historico));

    // Atualizar estatísticas
    atualizarEstatisticas(jogador1, jogador2, pontos1, pontos2, jogo, dificuldade);

    // Verificar conquistas
    verificarConquistas(jogador1, jogador2, pontos1, pontos2, jogo);
}

// Função para calcular o ranking geral
function calcularRanking() {
    const historico = JSON.parse(localStorage.getItem(RANKING_KEY)) || [];
    const ranking = {};

    historico.forEach(partida => {
        const j1 = partida.jogador1;
        const j2 = partida.jogador2;

        if (!ranking[j1]) ranking[j1] = { vitorias: 0, empates: 0, derrotas: 0, pontos: 0 };
        if (!ranking[j2]) ranking[j2] = { vitorias: 0, empates: 0, derrotas: 0, pontos: 0 };

        if (partida.pontos1 > partida.pontos2) {
            ranking[j1].vitorias++;
            ranking[j2].derrotas++;
        } else if (partida.pontos2 > partida.pontos1) {
            ranking[j2].vitorias++;
            ranking[j1].derrotas++;
        } else {
            ranking[j1].empates++;
            ranking[j2].empates++;
        }
    });

    return Object.entries(ranking)
        .map(([nome, dados]) => ({
            nome,
            ...dados,
            total: dados.vitorias + dados.empates + dados.derrotas
        }))
        .sort((a, b) => (b.vitorias * 3 + b.empates) - (a.vitorias * 3 + a.empates));
}

// Sistema de Estatísticas Detalhadas
function atualizarEstatisticas(jogador1, jogador2, pontos1, pontos2, jogo, dificuldade) {
    const estatisticas = JSON.parse(localStorage.getItem(ESTATISTICAS_KEY)) || {};

    // Estatísticas para jogador1
    if (!estatisticas[jogador1]) {
        estatisticas[jogador1] = {
            jogosJogados: 0,
            vitorias: 0,
            empates: 0,
            derrotas: 0,
            pontosTotais: 0,
            jogosPorTipo: {},
            pontuacaoMedia: 0,
            tempoTotal: 0,
            maiorPontuacao: 0,
            sequenciaAtual: 0,
            melhorSequencia: 0
        };
    }

    // Estatísticas para jogador2
    if (!estatisticas[jogador2]) {
        estatisticas[jogador2] = {
            jogosJogados: 0,
            vitorias: 0,
            empates: 0,
            derrotas: 0,
            pontosTotais: 0,
            jogosPorTipo: {},
            pontuacaoMedia: 0,
            tempoTotal: 0,
            maiorPontuacao: 0,
            sequenciaAtual: 0,
            melhorSequencia: 0
        };
    }

    // Atualizar estatísticas jogador1
    estatisticas[jogador1].jogosJogados++;
    estatisticas[jogador1].pontosTotais += pontos1;
    estatisticas[jogador1].pontuacaoMedia = estatisticas[jogador1].pontosTotais / estatisticas[jogador1].jogosJogados;
    estatisticas[jogador1].maiorPontuacao = Math.max(estatisticas[jogador1].maiorPontuacao, pontos1);

    if (!estatisticas[jogador1].jogosPorTipo[jogo]) {
        estatisticas[jogador1].jogosPorTipo[jogo] = { jogos: 0, vitorias: 0, pontos: 0 };
    }
    estatisticas[jogador1].jogosPorTipo[jogo].jogos++;
    estatisticas[jogador1].jogosPorTipo[jogo].pontos += pontos1;

    if (pontos1 > pontos2) {
        estatisticas[jogador1].vitorias++;
        estatisticas[jogador1].sequenciaAtual++;
        estatisticas[jogador1].melhorSequencia = Math.max(estatisticas[jogador1].melhorSequencia, estatisticas[jogador1].sequenciaAtual);
        estatisticas[jogador2].sequenciaAtual = 0;
    } else if (pontos2 > pontos1) {
        estatisticas[jogador1].derrotas++;
        estatisticas[jogador1].sequenciaAtual = 0;
    } else {
        estatisticas[jogador1].empates++;
    }

    // Atualizar estatísticas jogador2 (simétrico)
    estatisticas[jogador2].jogosJogados++;
    estatisticas[jogador2].pontosTotais += pontos2;
    estatisticas[jogador2].pontuacaoMedia = estatisticas[jogador2].pontosTotais / estatisticas[jogador2].jogosJogados;
    estatisticas[jogador2].maiorPontuacao = Math.max(estatisticas[jogador2].maiorPontuacao, pontos2);

    if (!estatisticas[jogador2].jogosPorTipo[jogo]) {
        estatisticas[jogador2].jogosPorTipo[jogo] = { jogos: 0, vitorias: 0, pontos: 0 };
    }
    estatisticas[jogador2].jogosPorTipo[jogo].jogos++;
    estatisticas[jogador2].jogosPorTipo[jogo].pontos += pontos2;

    if (pontos2 > pontos1) {
        estatisticas[jogador2].vitorias++;
        estatisticas[jogador2].sequenciaAtual++;
        estatisticas[jogador2].melhorSequencia = Math.max(estatisticas[jogador2].melhorSequencia, estatisticas[jogador2].sequenciaAtual);
        estatisticas[jogador1].sequenciaAtual = 0;
    } else if (pontos1 > pontos2) {
        estatisticas[jogador2].derrotas++;
        estatisticas[jogador2].sequenciaAtual = 0;
    } else {
        estatisticas[jogador2].empates++;
    }

    localStorage.setItem(ESTATISTICAS_KEY, JSON.stringify(estatisticas));
}

// Sistema de Conquistas
const conquistasDefinidas = {
    primeiraVitoria: {
        nome: "Primeira Vitória",
        descricao: "Ganhe sua primeira partida",
        icone: "🏆",
        condicao: (stats) => stats.vitorias >= 1
    },
    mestreQuimico: {
        nome: "Mestre Químico",
        descricao: "Ganhe 10 partidas",
        icone: "🧪",
        condicao: (stats) => stats.vitorias >= 10
    },
    campeao: {
        nome: "Campeão",
        descricao: "Ganhe 50 partidas",
        icone: "👑",
        condicao: (stats) => stats.vitorias >= 50
    },
    especialista: {
        nome: "Especialista",
        descricao: "Alcance 1000 pontos totais",
        icone: "⭐",
        condicao: (stats) => stats.pontosTotais >= 1000
    },
    maratonista: {
        nome: "Maratonista",
        descricao: "Jogue 100 partidas",
        icone: "🏃",
        condicao: (stats) => stats.jogosJogados >= 100
    },
    perfeccionista: {
        nome: "Perfeccionista",
        descricao: "Alcance pontuação média de 20 pontos",
        icone: "💎",
        condicao: (stats) => stats.pontuacaoMedia >= 20
    },
    velocidade: {
        nome: "Velocidade",
        descricao: "Ganhe uma partida em menos de 2 minutos",
        icone: "⚡",
        condicao: (stats, historico) => {
            // Esta conquista é verificada no histórico individual
            return false; // Será verificada na função verificarConquistas
        }
    }
};

function verificarConquistas(jogador1, jogador2, pontos1, pontos2, jogo) {
    const conquistas = JSON.parse(localStorage.getItem(CONQUISTAS_KEY)) || {};
    const historico = JSON.parse(localStorage.getItem(RANKING_KEY)) || [];
    const estatisticas = JSON.parse(localStorage.getItem(ESTATISTICAS_KEY)) || {};

    // Verificar conquistas para jogador1
    verificarConquistasJogador(jogador1, conquistas, estatisticas, historico);

    // Verificar conquistas para jogador2
    verificarConquistasJogador(jogador2, conquistas, estatisticas, historico);

    localStorage.setItem(CONQUISTAS_KEY, JSON.stringify(conquistas));
}

function verificarConquistasJogador(jogador, conquistas, estatisticas, historico) {
    if (!estatisticas[jogador]) return;

    const stats = estatisticas[jogador];
    const historicoJogador = historico.filter(p => p.jogador1 === jogador || p.jogador2 === jogador);

    if (!conquistas[jogador]) conquistas[jogador] = [];

    for (const [key, conquista] of Object.entries(conquistasDefinidas)) {
        if (conquistas[jogador].some(c => c.id === key)) continue; // Já conquistada

        let conquistada = false;

        if (key === 'velocidade') {
            // Verificar se ganhou alguma partida em menos de 2 minutos
            conquistada = historicoJogador.some(p =>
                (p.jogador1 === jogador && p.vencedor === jogador && p.tempoGasto < 120) ||
                (p.jogador2 === jogador && p.vencedor === jogador && p.tempoGasto < 120)
            );
        } else {
            conquistada = conquista.condicao(stats, historicoJogador);
        }

        if (conquistada) {
            conquistas[jogador].push({
                id: key,
                nome: conquista.nome,
                descricao: conquista.descricao,
                icone: conquista.icone,
                data: new Date().toISOString()
            });

            // Mostrar notificação (se possível)
            mostrarNotificacaoConquista(conquista.nome, conquista.icone);
        }
    }
}

function mostrarNotificacaoConquista(nome, icone) {
    // Criar e mostrar notificação visual de conquista
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao-conquista';
    notificacao.innerHTML = `
        <div class="notificacao-conteudo">
            <span class="conquista-icone">${icone}</span>
            <div class="conquista-texto">
                <h4>Conquista Desbloqueada!</h4>
                <p>${nome}</p>
            </div>
        </div>
    `;

    document.body.appendChild(notificacao);

    // Remover após 4 segundos
    setTimeout(() => {
        if (notificacao.parentNode) {
            notificacao.parentNode.removeChild(notificacao);
        }
    }, 4000);
}

// Função para calcular o ranking geral aprimorado
function calcularRanking() {
    const historico = JSON.parse(localStorage.getItem(RANKING_KEY)) || [];
    const ranking = {};

    historico.forEach(partida => {
        const j1 = partida.jogador1;
        const j2 = partida.jogador2;

        if (!ranking[j1]) ranking[j1] = { vitorias: 0, empates: 0, derrotas: 0, pontos: 0 };
        if (!ranking[j2]) ranking[j2] = { vitorias: 0, empates: 0, derrotas: 0, pontos: 0 };

        if (partida.pontos1 > partida.pontos2) {
            ranking[j1].vitorias++;
            ranking[j2].derrotas++;
        } else if (partida.pontos2 > partida.pontos1) {
            ranking[j2].vitorias++;
            ranking[j1].derrotas++;
        } else {
            ranking[j1].empates++;
            ranking[j2].empates++;
        }
    });

    return Object.entries(ranking)
        .map(([nome, dados]) => ({
            nome,
            ...dados,
            total: dados.vitorias + dados.empates + dados.derrotas
        }))
        .sort((a, b) => (b.vitorias * 3 + b.empates) - (a.vitorias * 3 + a.empates));
}

// Função para obter estatísticas detalhadas de um jogador
function obterEstatisticasJogador(jogador) {
    const estatisticas = JSON.parse(localStorage.getItem(ESTATISTICAS_KEY)) || {};
    return estatisticas[jogador] || null;
}

// Função para obter conquistas de um jogador
function obterConquistasJogador(jogador) {
    const conquistas = JSON.parse(localStorage.getItem(CONQUISTAS_KEY)) || {};
    return conquistas[jogador] || [];
}

// Função para obter histórico detalhado de um jogador
function obterHistoricoJogador(jogador) {
    const historico = JSON.parse(localStorage.getItem(RANKING_KEY)) || [];
    return historico.filter(p => p.jogador1 === jogador || p.jogador2 === jogador);
}

// Função para limpar o ranking e estatísticas
function limparRanking() {
    localStorage.removeItem(RANKING_KEY);
    localStorage.removeItem(ESTATISTICAS_KEY);
    localStorage.removeItem(CONQUISTAS_KEY);
}

// Função para exportar dados (backup)
function exportarDados() {
    const dados = {
        ranking: JSON.parse(localStorage.getItem(RANKING_KEY)) || [],
        estatisticas: JSON.parse(localStorage.getItem(ESTATISTICAS_KEY)) || {},
        conquistas: JSON.parse(localStorage.getItem(CONQUISTAS_KEY)) || {}
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-jogos-quimicos-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Função para importar dados (restore)
function importarDados(arquivo) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const dados = JSON.parse(e.target.result);
            if (dados.ranking) localStorage.setItem(RANKING_KEY, JSON.stringify(dados.ranking));
            if (dados.estatisticas) localStorage.setItem(ESTATISTICAS_KEY, JSON.stringify(dados.estatisticas));
            if (dados.conquistas) localStorage.setItem(CONQUISTAS_KEY, JSON.stringify(dados.conquistas));
            alert('Dados importados com sucesso!');
            location.reload();
        } catch (error) {
            alert('Erro ao importar dados: arquivo inválido');
        }
    };
    reader.readAsText(arquivo);
}

// Expor função de salvar partida globalmente para outros jogos
window.salvarPartidaRanking = salvarPartida;