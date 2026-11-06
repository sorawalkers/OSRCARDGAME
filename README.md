# Mesa Vazia

Roguelike de mesa solo em dark fantasy, no espírito do RPG old school. Você cria um herói numa ficha de papel, rola os dados e atravessa um mundo que nasce enquanto você caminha. As ações são cartas, os monstros vêm de um bestiário de gravuras antigas e o diário escreve a campanha sozinho.

O documento de design completo está em [`referencia/MESA_VAZIA.md`](referencia/MESA_VAZIA.md).

## Estado atual

- **Base de interface:** este repositório, gerado inicialmente com o Lovable. Tem React 19, TanStack Start e Router, Tailwind 4 e componentes shadcn. As telas (início, criação, mapa, cena, combate, vila, epitáfio, bestiário) já compartilham uma partida de verdade, salva no navegador. O mapa, a cena e as cartas ainda são de exemplo.
- **Motor de referência:** [`referencia/prototipo-mesa-vazia.html`](referencia/prototipo-mesa-vazia.html), o protótipo jogável em arquivo único, com todas as regras e conteúdos já testados. Abra direto no navegador. O trabalho agora é trazer esse motor para a base em React.

## Rodar localmente

Precisa de Node.js 20 ou mais recente e do [Bun](https://bun.sh) para instalar as dependências. O `npm install` falha neste projeto por causa do `overrides` do `package.json`.

```sh
bun install
bun run dev      # servidor de desenvolvimento
bun run build    # build de produção
bun run test     # testes (vitest)
```

## Estrutura

```
src/
  routes/            telas (uma rota por tela)
  components/game/   componentes do jogo (ficha, cartas, d20, mapa, selo de intenção...)
  components/ui/     componentes base (shadcn)
  game/data.ts       dados do jogo (raças, classes, equipamento, monstros, cartas)
  game/hero.ts       o herói: montagem a partir da criação e valores da ficha
  game/store.ts      estado da partida, salvo no navegador
  assets/monsters/   ilustrações do bestiário
referencia/          documento de design e protótipo jogável
```

## Créditos

- A base de interface e as ilustrações dos monstros foram geradas com o [Lovable](https://lovable.dev). As ilustrações foram feitas por IA, o que precisa ser declarado em lojas como a Steam.
- Fontes: IM Fell English (Igino Marini) e Alegreya, pelo Google Fonts; IBM Plex Mono.
