# CLAUDE.md: memória do projeto Mesa Vazia

O usuário fala português do Brasil; responda em português. Commits em inglês; comentários de código em português.

## O que é

Roguelike de mesa solo, dark fantasy, regras old school (B/X e AD&D), combate com cartas e d20. O design completo, com regras, números, conteúdo e decisões, está em `referencia/MESA_VAZIA.md`. Leia antes de mexer em regras ou conteúdo.

## Duas fontes

1. **Este app** (React 19 + TanStack Start/Router + Tailwind 4 + shadcn), vindo do Lovable. É a base oficial de interface. As telas ficam em `src/routes/`, os componentes do jogo em `src/components/game/` e o design system em `src/styles.css` (tokens `--bone`, `--blood`, `--ember`, `--violet`, `--rot`, `--paper`, `--ink`; fontes IM Fell English SC/IM Fell English/Alegreya/IBM Plex Mono).
2. **`referencia/prototipo-mesa-vazia.html`**: o motor jogável e testado (versão 8), em um arquivo. É a fonte das regras e do conteúdo: cartas por classe, monstros com narração, geração de mapa, 15 cenas em grafo, vilas com horários, NPCs e pedidos, XP e níveis, testes de resistência, equipamento e legado.

Este repositório não está mais ligado ao Lovable; pode editar tudo à mão. `src/lib/lovable-error-reporting.ts` e `@lovable.dev/vite-tanstack-config` continuam porque o build usa.

## Plano de trabalho (combinado com o usuário)

1. Estado de jogo compartilhado entre as telas, salvo no navegador. O herói criado substitui o `SAMPLE_HERO`.
2. Combate de verdade: baralho por classe, dano pelo dado da arma, CA, testes de resistência, ilustrações no combate.
3. Mapa gerado e cenas encadeadas (portar as 15 cenas).
4. Vilas, NPCs, níveis e legado.

Trabalhar em branch e mostrar ao usuário antes de mexer na `main`.

## Convenções

- Narração em segunda pessoa, tom de dark fantasy, sem inventar regras fora do documento sem combinar.
- Tudo visível na mesa: toda rolagem mostra d20 + modificador contra o alvo.
- Novas regras ou números: atualizar `referencia/MESA_VAZIA.md` junto.
