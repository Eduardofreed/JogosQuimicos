const particulasQuimicas = [
    { tipo: 'Na', img: 'imagens/Na_atomo.png' },
    { tipo: 'Cl', img: 'imagens/Cl_atomo.png' },
    { tipo: 'O', img: 'imagens/O_atomo.png' },
    { tipo: 'C', img: 'imagens/C_atomo.svg.png' },
    { tipo: 'K', img: 'imagens/K_atomo.png' },
    { tipo: 'Br', img: 'imagens/Br_atomo.png' },
    { tipo: 'H', img: 'imagens/H_atomo.png' }
];

const moleculas = [
    {
        nome: 'NaCl',
        componentes: ['Na', 'Cl'],
        img: 'imagens/NaCl.png'
    },
    {
        nome: 'CO2',
        componentes: ['C', 'O', 'O'],
        img: 'imagens/CO2_molecula.svg'
    }
    , {
        nome: 'KBr',
        componentes: ['K', 'Br'],
        img: 'imagens/KBr.png'
    }
    , {
        nome: 'H2O',
        componentes: ['O', 'H', 'H'],
        img: 'imagens/H2O_molecula.png'
    }
    , {
        nome: 'O2',
        componentes: ['O', 'O'],
        img: 'imagens/O2_molecula.png'
    }
    , {
        nome: 'CO',
        componentes: ['C', 'O'],
        img: 'imagens/CO_molecula.png'
    }
    , {
        nome: 'CH4',
        componentes: ['C', 'H', 'H', 'H', 'H'],
        img: 'imagens/CH4_molecula.png'
    }
    , {
        nome: 'KCl',
        componentes: ['K', 'Cl'],
        img: 'imagens/KCl.png'
    }
];

function criarParticula(tipo, x, y) {
    const el = document.createElement('img');
    el.src = particulasQuimicas.find(p => p.tipo === tipo).img;
    el.className = 'particula-quimica';
    el.dataset.tipo = tipo;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.position = 'absolute';
    el.style.width = '48px';
    el.style.height = '48px';
    el.style.pointerEvents = 'none';
    document.getElementById('fundo-quimico').appendChild(el);
    animarParticula(el);
}

function animarParticula(el) {
    // Movimento aleatório simples
    const mover = () => {
        const x = Math.random() * (window.innerWidth - 60);
        const y = Math.random() * (window.innerHeight - 60);
        el.style.transition = 'left 4s linear, top 4s linear';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        setTimeout(mover, 4000 + Math.random() * 2000);
    };
    mover();
}

function distancia(el1, el2) {
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();
    const cx1 = r1.left + r1.width / 2, cy1 = r1.top + r1.height / 2;
    const cx2 = r2.left + r2.width / 2, cy2 = r2.top + r2.height / 2;
    return Math.sqrt((cx1 - cx2) ** 2 + (cy1 - cy2) ** 2);
}

function checarFormacaoMoleculas() {
    const todas = Array.from(document.querySelectorAll('.particula-quimica:not(.combinada)'));
    for (const mol of moleculas) {
        let indices = [];
        let usados = [];
        for (const comp of mol.componentes) {
            let achou = false;
            for (let i = 0; i < todas.length; i++) {
                if (todas[i].dataset.tipo === comp && !usados.includes(i)) {
                    indices.push(i);
                    usados.push(i);
                    achou = true;
                    break;
                }
            }
            if (!achou) break;
        }
        if (indices.length === mol.componentes.length) {
            let proximas = true;
            for (let i = 0; i < indices.length - 1; i++) {
                if (distancia(todas[indices[i]], todas[indices[i + 1]]) > 80) {
                    proximas = false;
                    break;
                }
            }
            if (proximas) {
                indices.forEach(idx => todas[idx].classList.add('brilho'));
                setTimeout(() => {
                    const x = indices.map(idx => parseFloat(todas[idx].style.left)).reduce((a, b) => a + b, 0) / indices.length;
                    const y = indices.map(idx => parseFloat(todas[idx].style.top)).reduce((a, b) => a + b, 0) / indices.length;
                    indices.forEach(idx => todas[idx].remove());
                    criarMolecula(mol, x, y);
                }, 600);
                break;
            }
        }
    }
}

function criarMolecula(mol, x, y) {
    const el = document.createElement('img');
    el.src = mol.img;
    el.className = 'particula-quimica molecula';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.position = 'absolute';
    el.style.width = '64px';
    el.style.height = '64px';
    el.style.pointerEvents = 'none';
    document.getElementById('fundo-quimico').appendChild(el);
    if (mol.nome === 'CO2') {
        efeitoCombustao(x, y);
    }
    animarParticula(el);
}

function efeitoCombustao(x, y) {
    const fogo = document.createElement('div');
    fogo.style.position = 'absolute';
    fogo.style.left = (x + 16) + 'px';
    fogo.style.top = (y + 16) + 'px';
    fogo.style.width = '32px';
    fogo.style.height = '32px';
    fogo.style.pointerEvents = 'none';
    fogo.style.background = 'radial-gradient(circle at 50% 60%, #ff0, #f90 60%, #f00 100%)';
    fogo.style.opacity = '0.8';
    fogo.style.borderRadius = '50%';
    fogo.style.zIndex = 10;
    fogo.style.animation = 'combustao 1s ease-out forwards';
    document.getElementById('fundo-quimico').appendChild(fogo);
    setTimeout(() => fogo.remove(), 1000);
}

window.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < 10; i++) {
        const tipo = particulasQuimicas[Math.floor(Math.random() * particulasQuimicas.length)].tipo;
        criarParticula(tipo, Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    }
    setInterval(checarFormacaoMoleculas, 1000);
}); 