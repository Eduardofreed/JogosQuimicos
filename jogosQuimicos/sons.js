class GerenciadorSons {
    constructor() {
        this.sons = {};
        this.musicaFundo = null;
        this.somHabilitado = true;
        this.volumeMusica = 0.3; // Volume baixo por padrão
        this.volumeEfeitos = 0.6;

        this.inicializarSons();
        this.criarControles();
    }

    inicializarSons() {
        // Música de fundo
        try {
            this.musicaFundo = new Audio('sons/musica-calma.mp3');
            this.musicaFundo.loop = true;
            this.musicaFundo.volume = this.volumeMusica;
        } catch (e) {
            this.musicaFundo = null;
        }

        // Efeitos sonoros
        this.sons = {
            click: new Audio('sons/click-suave.mp3'),
            combinacao: new Audio('sons/som-vitoria.mp3'), // Para combinações na memória
            vitoriaFinal: new Audio('sons/som-vitoria.mp3'), // Para vitória final (mesmo arquivo por enquanto)
            virarCarta: new Audio('sons/virar-carta.mp3')
        };

        // Configurar volume dos efeitos
        Object.values(this.sons).forEach(som => {
            som.volume = this.volumeEfeitos;
        });

        // Precarregar sons
        this.precarregarSons();
    }

    precarregarSons() {
        // Precarrega todos os sons para evitar delay na primeira reprodução
        Object.values(this.sons).forEach(som => {
            som.preload = 'auto';
            som.load();
        });
        if (this.musicaFundo) {
            this.musicaFundo.preload = 'auto';
            this.musicaFundo.load();
        }
    }

    criarControles() {
        // Criar botão de controle de som no canto superior direito
        const controleSom = document.createElement('div');
        controleSom.id = 'controle-som';
        controleSom.innerHTML = `
            <button id="botao-som" title="Ligar/Desligar Som">
                <span id="icone-som">🔊</span>
            </button>
            <div id="controle-volume" style="display: none;">
                <label>🎵 Música:</label>
                <input type="range" id="volume-musica" min="0" max="100" value="${this.volumeMusica * 100}">
                <label>🔊 Efeitos:</label>
                <input type="range" id="volume-efeitos" min="0" max="100" value="${this.volumeEfeitos * 100}">
            </div>
        `;

        // Estilos para o controle de som
        controleSom.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: rgba(10, 25, 41, 0.9);
            border-radius: 12px;
            padding: 10px;
            backdrop-filter: blur(10px);
            border: 1px solid var(--border-color, rgba(33, 212, 253, 0.2));
        `;

        document.body.appendChild(controleSom);

        // Event listeners para controles
        document.getElementById('botao-som').addEventListener('click', () => {
            this.alternarSom();
        });

        document.getElementById('volume-musica').addEventListener('input', (e) => {
            this.ajustarVolumeMusica(e.target.value / 100);
        });

        document.getElementById('volume-efeitos').addEventListener('input', (e) => {
            this.ajustarVolumeEfeitos(e.target.value / 100);
        });
    }

    alternarSom() {
        this.somHabilitado = !this.somHabilitado;
        const icone = document.getElementById('icone-som');
        const controleVolume = document.getElementById('controle-volume');

        if (this.somHabilitado) {
            icone.textContent = '🔊';
            this.iniciarMusicaFundo();
        } else {
            icone.textContent = '🔇';
            this.pararMusicaFundo();
        }

        // Mostrar/ocultar controles de volume
        controleVolume.style.display = this.somHabilitado ? 'block' : 'none';
    }

    iniciarMusicaFundo() {
        if (this.somHabilitado && this.musicaFundo) {
            this.musicaFundo.currentTime = 0; // Reinicia a música
            this.musicaFundo.play().catch(e => {
                console.log('Erro ao reproduzir música de fundo:', e);
            });
        }
    }

    pararMusicaFundo() {
        if (this.musicaFundo) {
            this.musicaFundo.pause();
        }
    }

    ajustarVolumeMusica(volume) {
        this.volumeMusica = volume;
        if (this.musicaFundo) {
            this.musicaFundo.volume = volume;
        }
    }

    ajustarVolumeEfeitos(volume) {
        this.volumeEfeitos = volume;
        Object.values(this.sons).forEach(som => {
            som.volume = volume;
        });
    }

    // Métodos para reproduzir efeitos sonoros
    reproduzirClick() {
        if (this.somHabilitado && this.sons.click) {
            this.sons.click.currentTime = 0;
            this.sons.click.play().catch(e => console.log('Erro ao reproduzir som de click:', e));
        }
    }

    reproduzirCombinacao() {
        if (this.somHabilitado && this.sons.combinacao) {
            this.sons.combinacao.currentTime = 0;
            this.sons.combinacao.play().catch(e => console.log('Erro ao reproduzir som de combinação:', e));
        }
    }

    reproduzirVitoriaFinal() {
        if (this.somHabilitado && this.sons.vitoriaFinal) {
            this.sons.vitoriaFinal.currentTime = 0;
            this.sons.vitoriaFinal.play().catch(e => console.log('Erro ao reproduzir som de vitória final:', e));
        }
    }

    reproduzirVirarCarta() {
        if (this.somHabilitado && this.sons.virarCarta) {
            this.sons.virarCarta.currentTime = 0;
            this.sons.virarCarta.play().catch(e => console.log('Erro ao reproduzir som de virar carta:', e));
        }
    }

    // Método para pausar música quando mudar de página
    pausarMusica() {
        this.pararMusicaFundo();
    }

    // Método para retomar música
    retomarMusica() {
        if (this.somHabilitado) {
            this.iniciarMusicaFundo();
        }
    }
}

// Instância global do gerenciador de sons
let gerenciadorSons;

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    gerenciadorSons = new GerenciadorSons();

    // Iniciar música de fundo automaticamente
    setTimeout(() => {
        gerenciadorSons.iniciarMusicaFundo();
    }, 1000); // Delay para garantir que a página carregou completamente
});

// Pausar música quando sair da página
window.addEventListener('beforeunload', () => {
    if (gerenciadorSons) {
        gerenciadorSons.pausarMusica();
    }
});

// Funções globais para facilitar o uso
function tocarClick() {
    if (gerenciadorSons) gerenciadorSons.reproduzirClick();
}

function tocarCombinacao() {
    if (gerenciadorSons) gerenciadorSons.reproduzirCombinacao();
}

function tocarVitoriaFinal() {
    if (gerenciadorSons) gerenciadorSons.reproduzirVitoriaFinal();
}

function tocarVirarCarta() {
    if (gerenciadorSons) gerenciadorSons.reproduzirVirarCarta();
}