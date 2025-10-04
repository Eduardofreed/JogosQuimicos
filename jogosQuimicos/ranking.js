// ranking.js

const RANKING_KEY = 'jogosQuimicosRanking';

// Função para salvar o histórico de uma partida
function salvarPartida(jogador1, jogador2, pontos1, pontos2, jogo) {
    const historico = JSON.parse(localStorage.getItem(RANKING_KEY)) || [];
    const data = new Date().toLocaleDateString('pt-BR');
    historico.push({
        jogo: jogo,
        data: data,
        jogador1: jogador1,
        jogador2: jogador2,
        pontos1: pontos1,
        pontos2: pontos2
    });
    localStorage.setItem(RANKING_KEY, JSON.stringify(historico));
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

// Função para limpar o ranking
function limparRanking() {
    localStorage.removeItem(RANKING_KEY);
}