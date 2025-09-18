# Jogos Químicos Educacionais - Jovens Talentos

## Sobre o Projeto

Este é um conjunto de jogos educacionais interativos desenvolvido para tornar o aprendizado de química mais divertido e acessível. O projeto foi criado no âmbito do **Programa Jovens Talentos** de Iniciação Científica, com o apoio da **FAPERJ** e **ISERJ** da rede **FAETEC**.

### Objetivo
Transformar conceitos complexos da química em experiências lúdicas e educativas, permitindo que estudantes aprendam através da interação e do jogo.

## Jogos Disponíveis

### 1. Jogo da Memória Iônica
**Como funciona:** Combine íons para formar compostos químicos!

- **Objetivo:** Encontrar 5 cartas que formem um composto químico válido
- **Mecânica:**  
  - Os jogadores viram até 5 cartas para revelar íons (cátions e ânions). 
  - O objetivo é encontrar uma combinação de cartas cuja soma das cargas seja zero, formando um composto quimicamente estável.
  - Exemplo: Na + Cl → NaCl (Cloreto de Sódio)
  - Cada combinação válida dá 1 ponto ao jogador
  - O jogador pode formar combinações de até 3 elementos ou um combo de dois compostos
  - Exemplo: Virar NaCl e KBr ao mesmo tempo.
  - Se o jogador conseguir uma combinação tripla ou um combo ganha 2 pontos.

**Aprendizado:** Foco em ligações iônicas, na interação entre cargas elétricas de cátions e ânions, e na formação e nomenclatura de compostos binários como sais e óxidos.

### 2. Super Trunfo Químico
**Como funciona:** Compare propriedades dos elementos químicos para vencer!

- **Objetivo:** Vencer rodadas escolhendo atributos onde seu elemento tem valores superiores
- **Mecânica:**
  - Cada jogador recebe cartas com diferentes elementos químicos. 
  - A cada rodada, um jogador escolhe um atributo (ex: eletronegatividade, raio atômico). 
  - O elemento com o valor superior ou inferior no atributo escolhido vence a rodada e o jogador ganha um ponto.
  - Exemplo: Bromo > Alumínio | Eletronegatividade do Bromo (2,96) é maior que a do Alumínio (1,61).

- **Atributos:** Eletronegatividade, Raio Atômico, Massa Atômica, Pontos de Fusão e Ebulição, Densidade

**Aprendizado:** Explora propriedades periódicas (eletronegatividade, raio atômico), características físicas (ponto de fusão, densidade) e incentiva o conhecimento geral da Tabela Periódica.

### 3. Balanceamento de Equações Químicas
**Como funciona:** Arraste os coeficientes corretos para balancear as equações químicas.

- **Mecânica:** 
  - O jogador arrasta e solta números (coeficientes) nos espaços antes de cada molécula em uma equação não balanceada. 
  - O objetivo é fazer com que a quantidade de átomos de cada elemento seja idêntica nos dois lados da equação (reagentes e produtos).
  - Exemplo: H₂ + O₂ → H₂O é balanceada para 2H₂ + O₂ → 2H₂O.

**Aprendizado:** Ensina conceitos fundamentais de estequiometria e a importância da conservação de massa (Lei de Lavoisier) em reações químicas.

## Como Jogar

### Instruções
1. **Acesse o jogo:** Abra o arquivo `inicio.html` no seu navegador
2. **Digite os nomes:** Insira os nomes dos jogadores (opcional)
3. **Escolha o jogo:** Clique no jogo que deseja jogar
4. **Divirta-se:** Siga as instruções específicas de cada jogo

## Tecnologias Utilizadas

- **HTML5:** Estrutura das páginas
- **CSS3:** Estilização e animações
- **JavaScript:** Lógica dos jogos e interatividade
- **Fontes:** Google Fonts (Poppins)
- **Design:** Interface moderna com gradientes e efeitos visuais

## Estrutura do Projeto

jogosQuimicos/
└── imagens/ # Imagens dos elementos químicos
├── Na.png, Cl.png, Mg.png, O.png, etc. e logos institucionais
└── sons/ # Efeitos sonoros no jogo
├── click-suave.mp3, som-combinacao.mp3, som-empate.mp3, som-vitoria.mp3 e virar-carta.mp3
├── inicio.html # Página principal com menu de jogos
├── telainicio.css # Estilos, animações da tela de início e partículas
├── particulas.js # Lógica por trás das animações de partículas químicas
├── memoriaIonica.html # Tela do jogo da Memória Iônica
├── memoriaIonica.css # Estilos e animações do jogo da Memória Iônica
├── memoriaIonica.js # Lógica do Jogo da Memória
├── superTrunfo.html # Super Trunfo Químico
├── superTrunfo.css # Estilos e animações do jogo Super Trunfo
├── superTrunfo.js # Lógica do Super Trunfo
README.md

## Características Visuais

- **Design responsivo:** Funciona em desktop e dispositivos móveis
- **Tema químico:** Cores e elementos visuais inspirados na química
- **Animações:** Partículas químicas flutuantes no fundo
- **Interface intuitiva:** Botões e elementos fáceis de usar

## Conceitos Químicos Abordados

### Jogo da Memória Iônica
- **Ligações iônicas:** Como íons se combinam
- **Cargas elétricas:** Cátions (+) e ânions (-)
- **Compostos binários:** Formação de sais e óxidos
- **Nomenclatura:** Nomes dos compostos formados

### Super Trunfo Químico
- **Propriedades periódicas:** Eletronegatividade, raio atômico
- **Características físicas:** Pontos de fusão, ebulição, densidade
- **Tabela periódica:** Conhecimento dos elementos
- **Comparação de dados:** Análise de valores numéricos

## Público-Alvo

- **Estudantes do ensino médio:** Aprendendo química básica
- **Professores:** Ferramenta educacional para aulas
- **Interessados em química:** Qualquer pessoa curiosa sobre o tema
- **Famílias:** Atividade educativa para fazer em casa

## Benefícios Educacionais

- **Aprendizado ativo:** Aprender fazendo
- **Memorização:** Conceitos fixados através do jogo
- **Motivação:** Gamificação aumenta o interesse
- **Compreensão:** Visualização de conceitos abstratos
- **Colaboração:** Jogos para dois jogadores

## Como Usar em Sala de Aula

1. **Introdução:** Apresente os conceitos básicos
2. **Demonstração:** Mostre como jogar
3. **Prática:** Deixe os alunos jogarem
4. **Discussão:** Debata os conceitos aprendidos
5. **Avaliação:** Use como ferramenta de revisão

## Personalização

Os jogos podem ser facilmente expandidos:
- Adicionar mais elementos químicos
- Incluir novos tipos de compostos
- Criar novos atributos para o Super Trunfo
- Modificar a dificuldade dos jogos

## Suporte

Para dúvidas ou sugestões sobre o projeto, entre em contato através das instituições parceiras:
- **FAPERJ:** Fundação de Amparo à Pesquisa do Estado do Rio de Janeiro
- **ISERJ:** Instituto Superior de Educação do Rio de Janeiro
- **FAETEC:** Fundação de Apoio à Escola Técnica


## Licença

Este projeto foi desenvolvido para fins educacionais no âmbito do Programa Jovens Talentos.