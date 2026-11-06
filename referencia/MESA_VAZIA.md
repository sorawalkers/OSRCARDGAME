# Mesa Vazia

> Roguelike de mesa solo em dark fantasy, no espírito do RPG old school.
> Documento de projeto. Estado em 06/11/2026 (protótipo versão 8).

- **Protótipo jogável:** https://claude.ai/artifact/4y83WqjPHd1ppHCoqhAoFJ (privado; compartilhe pelo menu Share)
- **Formato:** um único arquivo HTML (`mesa-vazia.html`), sem servidor e sem assets externos
- **Status:** protótipo funcional, em fase de design e balanceamento

---

## 1. Conceito

Um mestre virtual que improvisa uma campanha só para você. Você cria um herói numa ficha de papel, como numa mesa de RPG, e começa sem nada. O mundo não existe antes de você chegar: regiões, vilas, NPCs, rumores e pedidos são gerados enquanto você avança. A run termina quando o herói morre, e o mundo lembra dele.

**Referências de sensação:** sessão de RPG de mesa old school (B/X, AD&D) + roguelike de cartas + diário de campanha.

### Pilares

1. **O mundo nasce sob seus pés:** tudo é gerado na hora, por tabelas procedurais.
2. **NPCs com memória:** pedem coisas, lembram do que você fez e voltam como aliados ou inimigos.
3. **Os dados na mesa:** toda rolagem é visível (d20 + modificador contra a dificuldade).
4. **Narração em primeiro lugar:** cada lugar, cada ação e cada golpe são narrados, não só calculados.
5. **Legado:** o herói morto vira túmulo, lenda ou fantasma no mundo do próximo.

### Decisões tomadas

| Tema | Decisão |
|---|---|
| Ambientação | Dark fantasy |
| Combate | Cartas que representam ações, cada uma com rolagem de d20 |
| IA generativa | Não, por custo. Tudo procedural, com textos escritos à mão |
| Regras | Old school clássico: 6 atributos em 3d6, raças e classes clássicas, CA, testes de resistência, XP por ouro |
| Visual | "Mesa de RPG com fichas": mesa escura à luz de vela, ficha de papel, cartas, dados |
| Plataforma | Navegador primeiro; Steam é possibilidade futura |
| Monetização | Prevista (anúncios em portais web ou venda na Steam) |

---

## 2. Ciclo de jogo

1. **Criação** da ficha (6 etapas).
2. **Mapa da região:** escolha do próximo lugar. Cada passo custa 1 provisão.
3. **Cena:** narração de chegada e escolhas com rolagens, que podem levar a luta, tesouro ou consequências.
4. **Combate** com cartas, quando acontece; depois, recompensa e a cena continua.
5. **Vilas:** descanso, compras, NPCs, pedidos e cenas próprias.
6. **Subida de nível** ao voltar ao mapa com XP suficiente.
7. **Chefe** no fim da região (9 passos), e depois a próxima região, mais difícil.
8. **Morte:** epitáfio e legado para o próximo herói.

---

## 3. Criação de personagem

A tela mostra as etapas à esquerda e a **ficha de papel** se preenchendo ao vivo à direita.

### 3.1 Atributos (3d6)

Seis atributos, rolados com 3d6. Há dois modos: **em ordem** (clássico) ou **distribuir** (trocar valores entre atributos). Dá para rolar de novo à vontade.

| Atributo | Uso |
|---|---|
| FOR (Força) | Acerto e dano corpo a corpo |
| DES (Destreza) | CA, furtividade, reflexos, fuga |
| CON (Constituição) | Vida (3 por ponto de modificador), dado de vida ao subir de nível, resistência a veneno |
| INT (Inteligência) | Magias do mago |
| SAB (Sabedoria) | Orações, percepção, resistência à magia |
| CAR (Carisma) | Conversa, persuasão, 5% de desconto por ponto nas vilas |

**Tabela de modificadores:** 3 = −3 · 4–5 = −2 · 6–8 = −1 · 9–12 = 0 · 13–15 = +1 · 16–17 = +2 · 18 = +3.

### 3.2 Raças

| Raça | Ajustes | Traço |
|---|---|---|
| Humano | +2 no atributo que escolher | Ambição: +10% de XP |
| Anão | CON +1, CAR −1 | +4 nas resistências contra veneno e magia. Não pode ser Mago |
| Elfo | DES +1, CON −1 | Vê 1 passo a mais no mapa; imune à paralisia (nunca fica enfraquecido) |
| Halfling | FOR −1, DES +1 | +2 de CA contra inimigos fortes e chefes; +2 nas resistências contra veneno e magia; nunca é pego de surpresa. Não pode ser Mago |
| Meio-Elfo | nenhum | +2 em Carisma fora de combate |
| Meio-Orc | FOR +1, CON +1, CAR −2 | +1 de dano por golpe; preços 15% maiores |

### 3.3 Classes

| Classe | Atributo principal | Vida base | Dado por nível | Equipamento inicial | Habilidade |
|---|---|---|---|---|---|
| Guerreiro | FOR | 34 + CON | d10 | Espada longa (d8), cota de malha e escudo | +1 de ataque por nível; usa tudo |
| Clérigo | SAB | 30 + CON | d8 | Maça (d6), cota de malha e escudo | Expulsar Mortos-Vivos; orações que se esgotam; só armas sem corte |
| Ladrão | DES | 26 + CON | d6 | Espada curta (d6), gibão de couro | Ataque furtivo (×2, ×3 a partir do nível 5); começa lutas oculto; +2 em DES fora de combate; só couro |
| Mago | INT | 20 + CON | d4 | Adaga (d4), sem armadura | Grimório: magias fortes que se esgotam até descansar; só adaga ou cajado |

- **Bônus de ataque por nível:** Guerreiro = nível; Clérigo e Ladrão = nível ÷ 2; Mago = nível ÷ 3.
- **Bônus de XP pelo atributo principal:** 16+ dá +10%, 13–15 dá +5%, 6–8 dá −10%, 3–5 dá −20%.

### 3.4 Antecedentes (12)

Filho de coveiro, ex-inquisidor, sobrevivente da peste, desertor do exército, ladra de relicários, herdeira falida, marcado pela lua, curandeira de aldeia, caçador de recompensas, monge expulso, aprendiz de alquimista, menestrel sem plateia. Cada um dá +2 num atributo, ouro, provisões, vida ou uma carta.

### 3.5 Traços (virtudes e defeitos)

Começa com 1 ponto. Cada defeito aceito dá +1 ponto (máximo de 2 defeitos).

- **Virtudes:** Mãos firmes (1), Língua afiada (1), Robusto (1), Pé na estrada (1), Sono leve (1), Pechincheiro (1), Veterano (2), Nascido com sorte (2).
- **Defeitos:** Manco, Pesadelos, Glutão, Procurado, Frágil, Sangue ruim.

### 3.6 Nome e motivação

O nome é digitado ou sorteado. A motivação vem de uma lista de 8 (por exemplo, "levar as cinzas da mãe até o mar") e aparece no diário e no epitáfio.

---

## 4. Regras de jogo

### 4.1 Combate com cartas

- O baralho tem 8 cartas iniciais por classe. Você compra 3 por turno e joga 1.
- **Carta com rolagem:** d20 + modificador do atributo (+ bônus de ataque, se for ataque) contra a Defesa do inimigo ou uma dificuldade fixa. Tem efeito de sucesso e de falha. O **20** é crítico e dobra o efeito; o **1** é desastre.
- **Carta sem rolagem:** efeito garantido.
- **Efeitos:** dano (dado da arma + FOR, ou fixo), golpes múltiplos, bloqueio, cura, veneno, fraqueza (−30% de dano), foco (bônus na próxima rolagem), CA temporária, ficar oculto, sono, expulsar mortos-vivos.
- **Intenção do inimigo** visível antes de ele agir: atacar, proteger-se, enfraquecer, envenenar, amaldiçoar, fortalecer-se, curar-se.
- **Ataque do inimigo:** d20 + acerto do inimigo contra a **CA** do herói, e pode errar.
- **Fugir:** DES contra 10 (não vale contra chefes nem inimigos fortes).
- **Magias e orações:** saem do baralho ao serem usadas e voltam com descanso (estalagem, santuário, fogueira ou vitória sobre um chefe).

### 4.2 Testes de resistência

Alvo no d20 por classe (tabela antiga), que melhora 1 a cada 2 níveis. Soma o atributo correspondente.

| Classe | Veneno (CON) | Paralisia (DES) | Magia (SAB) |
|---|---|---|---|
| Guerreiro | 12 | 14 | 16 |
| Clérigo | 11 | 14 | 15 |
| Ladrão | 13 | 13 | 15 |
| Mago | 13 | 13 | 14 |

Usados contra o veneno, a fraqueza (paralisia) e a maldição (corrupção) dos inimigos.

### 4.3 Equipamento

| Armas | Dano | Observação |
|---|---|---|
| Adaga | d4 | |
| Cajado | d4 | sem corte |
| Maça | d6 | sem corte |
| Espada curta | d6 | |
| Espada longa | d8 | |
| Machado de batalha | d8 | |
| Martelo de guerra | d8 | sem corte |
| Montante | d10 | duas mãos, sem escudo |

| Armaduras | CA base |
|---|---|
| Sem armadura | 10 |
| Gibão de couro | 12 |
| Cota de malha | 14 |
| Armadura de placas | 16 |
| Escudo | +1 |

**CA = armadura + escudo + DES.** Armas e armaduras são vendidas na ferraria, respeitando as restrições da classe.

### 4.4 Experiência e níveis

- **XP** vem do ouro encontrado (1 ouro = 1 XP, como nas regras antigas) e das lutas (normal 8, forte 20, chefe 50, multiplicados pela região).
- **Ao subir de nível:** rola o dado de vida + CON, recalcula o bônus de ataque e escolhe 1 de 3 técnicas novas da classe.
- **Nível máximo do protótipo:** 6.
- **Tabelas de XP:** Guerreiro 60 / 150 / 300 / 520 / 800 · Clérigo 55 / 135 / 270 / 470 / 730 · Ladrão 45 / 120 / 240 / 420 / 660 · Mago 70 / 170 / 340 / 580 / 900.

### 4.5 Recursos

- **Vida:** chegou a 0, morreu.
- **Corrupção (0–10):** vem de pactos, profanações e maldições. Com 10, a escuridão leva o herói.
- **Provisões:** cada passo no mapa gasta 1. Sem provisões, a fome tira 4 de vida.
- **Ouro:** compras e XP.

---

## 5. O mundo

### 5.1 Mapa da região

- São 10 colunas: acampamento, 8 passos e o **Coração da região** (chefe).
- Os caminhos se ramificam. Além de 2 passos, o mapa fica na **névoa**; rumores e informantes revelam mais.
- **Tipos de lugar:** estrada (cena), ruína (luta ou saque), vila, santuário, covil (inimigo forte), pedido (missão de NPC) e chefe.
- **Regiões:** Charneca dos Enforcados, Pântano de Velmire, Campos de Cinza, Floresta Sem Pássaros, Vale do Sino Partido, Minas de Ossomar.
- **Chefes:** A Mãe das Moscas, O Bispo Sem Rosto, O Rei Debaixo da Lama.

### 5.2 Cenas (eventos em vários passos)

- Cada cena é um grafo de nós: narração, efeitos e escolhas (com ou sem rolagem). Uma luta pode acontecer no meio, e a cena continua depois.
- O registro da cena funciona como a ata de uma sessão: narração, escolha feita, rolagem e efeito.
- **15 cenas de estrada:** o enforcado que ainda respira, a criança na névoa, a procissão dos flagelantes, o poço que sussurra, a fogueira dos desertores, o inquisidor na estrada, a carroça tombada, o lobo na armadilha, o espelho na ruína, a ferreira cega, a chuva de cinzas, a mesa posta para seis, o violinista da encruzilhada, um rosto conhecido (NPC que lembra de você) e o túmulo do herói anterior.
- **Cenas de lugar:** ruína, covil, santuário, pedido e chefe, cada uma com opções antes da luta (esgueirar-se, observar, atrair para campo aberto, recuar).
- Cada cena tem um campo reservado para imagem (ainda não usado).

### 5.3 Vilas e cidades

- **Lugares:** praça, estalagem, mercado, igreja, ferraria e becos. As cidades têm todos.
- **Horário:** manhã, tarde e noite. Cenas e conversas passam o tempo; à noite o mercado e a ferraria fecham e os becos ficam perigosos. Dormir vira o dia.
- **Situação da vila** (cada uma com cena própria): peste, inquisidores, festa de enforcamento, vila abandonada, cercada por lobos, próspera demais.
- **Cenas de vila:** briga no salão, o velho cego, os dados do estranho, o confessionário, o homem das sombras e o mercado negro, os becos à noite.
- **NPCs:** cada um tem ofício, lugar na vila, relação com você (hostil a aliado) e um pedido. Pedidos aceitos aparecem no mapa. Também é possível ameaçar um NPC para tirar dinheiro dele.

### 5.4 Narração

- **Chegada:** hora do dia + clima próprio de cada região + o que se vê no lugar.
- **Combate:** cada carta e cada ação de cada inimigo têm frases próprias, mais o número ("Ele gira o flagelo de pregos e o crava no seu ombro · 8 de dano").
- **Morte do inimigo:** uma frase própria por inimigo.

### 5.5 Diário e legado

- O diário se escreve sozinho: cenas (com o caminho tomado), lutas, vilas, pedidos, compras e níveis. Cada anotação nova aparece num aviso, e um contador mostra as não lidas.
- **Na morte:** epitáfio com raça, classe, antecedente, motivação e causa da morte.
- **Legado:** os heróis mortos ficam salvos no navegador. O túmulo de um deles pode aparecer na estrada: orar herda uma carta, saquear pode despertar o espectro.

---

## 6. Visual e interface

- **Direção:** "mesa de RPG com fichas". A mesa é escura, com luz de vela vinda do alto e granulação leve; a ficha é de papel; as cartas têm moldura; os dados são d20 hexagonais.
- **Tipografia:** IM Fell English SC (títulos), IM Fell English (narração), Alegreya (texto), IBM Plex Mono (números e rótulos).
- **Paleta:** fundo quase preto, osso, sangue (vida e perigo), brasa (destaque), violeta (corrupção e raro), verde podre (veneno e ganhos).
- **Estrutura da tela:**
  - barra fina no topo com nome, vida, corrupção, nível, CA, ouro, provisões e dia;
  - gavetas laterais para a ficha (folha de papel) e o diário;
  - a cena ocupa o centro.
- **Componentes:**
  - narração sem moldura, com capitular;
  - escolhas com losango;
  - mão de cartas em leque (no celular, rolagem lateral);
  - inimigo centralizado com selo de intenção;
  - mapa em SVG com névoa;
  - epitáfio em forma de lápide.
- **Assets:** nenhum. Tudo é desenhado em código (SVG e CSS), o que zera custo e risco de licença.

---

## 7. Tecnologia

- Um arquivo HTML com CSS e JavaScript puros, sem frameworks; só fontes do Google Fonts.
- Estado da run em memória; o legado fica salvo no `localStorage` do navegador.
- Testes com Playwright: um robô joga runs inteiras ao acaso para pegar erros e medir balanceamento.
- **Atenção:** o arquivo-fonte está no ambiente temporário desta sessão. Para não perder, é preciso baixá-lo ou guardá-lo num repositório.

---

## 8. Balanceamento: observações

- Na última bateria de testes (robô jogando ao acaso), as runs duraram de 2 a 9 passos, e algumas chegaram ao chefe da primeira região.
- **A Mãe das Moscas** (veneno) é a principal causa de morte. Candidata a ajuste.
- **"Marcado pela lua"** foi reduzido de +3 para +2 de corrupção inicial.
- Com os atributos em 3d6, as dificuldades foram reduzidas em 2 (Defesa dos inimigos, cartas, cenas, fuga, ameaça) para compensar a perda do +3 fixo de classe.
- Os números ainda precisam de testes com jogadores reais.

---

## 9. Próximos passos

**Curto prazo**
- [ ] Poções e pergaminhos (consumíveis usados em combate e nas cenas)
- [ ] Testes de resistência dos inimigos contra as magias do herói (Sono, Teia)
- [ ] Ajustar a Mãe das Moscas e a curva de dificuldade entre regiões
- [ ] Mais cenas de estrada, inclusive cenas próprias de cada região
- [ ] Fichas de papel menores para NPCs e inimigos

**Médio prazo**
- [ ] Mundo persistente entre heróis (vilas e NPCs que sobrevivem à morte do herói)
- [ ] Salvar a run no navegador
- [ ] Seed do dia (mesmo mundo para todos, com ranking)
- [ ] Mais classes (Paladino, Ranger, Druida, Bardo) e mais inimigos
- [ ] Imagens nas cenas

**Longo prazo**
- [ ] Narração opcional por IA (modo premium)
- [ ] Versão Steam (Electron ou Tauri)
- [ ] Publicação em portais web (itch.io, CrazyGames, Poki)

---

## 10. Histórico do protótipo

| Versão | O que entrou |
|---|---|
| 1 | Conceito inicial: 3 classes próprias, cartas com d20, eventos simples, vilas, NPCs, diário, legado |
| 2 | Mapa da região com névoa, narração de chegada, combate narrado |
| 3 | Eventos viram cenas em vários passos; vilas exploráveis com lugares, horário e cenas próprias; diário completo |
| 4 | Novo visual: barra no topo, gavetas, narração sem moldura, cartas com cara de carta |
| 5 | Criação com raça, classe, experiência, traços e motivação; ficha de papel |
| 6 | Classes clássicas (Guerreiro, Clérigo, Ladrão, Mago), CA, magias que se esgotam, XP e níveis |
| 7 | Raças clássicas (Humano, Anão, Elfo, Halfling, Meio-Elfo, Meio-Orc) com restrições de classe |
| 8 | Seis atributos em 3d6, testes de resistência, armas e armaduras, antecedentes |

---

## Anexo: outras ideias da mesma conversa

- **Enxame Reverso** (protótipo feito): survivors invertido em que você é o enxame; cada presa devorada vira mais insetos. Arte 100% procedural. https://claude.ai/artifact/4r8Jp2cHQ486ehmc2U7bei
- **Outros conceitos discutidos:** Último Farol, Masmorra de Bolso, Necrópole S/A, Fundição Estelar, Guilda que Não Dorme, Cerco Eterno, Run & Rest.
