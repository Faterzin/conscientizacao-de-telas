# DailyQuiz

Jogo web educativo sobre **tempo de tela** e o peso das pequenas escolhas diárias. Estética pixel art inspirada em Stardew Valley.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS 4** (paleta retrô em `@theme`, sem `tailwind.config.ts`)
- **react-konva** para o cenário pixelado (composto por retângulos, sem PNGs)
- **Zustand** + `persist` (localStorage) para o estado do jogo
- **framer-motion** para animações de UI
- **Howler.js** para áudio (placeholders — adicione arquivos em `public/sounds/`)

## Como rodar

```bash
pnpm install     # ou npm install / yarn
pnpm dev         # http://localhost:3000
```

Build de produção:

```bash
pnpm build
pnpm start
```

Type-check:

```bash
pnpm typecheck
```

## Arquitetura

```
app/
  page.tsx                 # Menu inicial (escolha de personagem + começar/continuar)
  game/page.tsx            # Tela do jogo (canvas + stats + modal de escolha)
  ending/[type]/page.tsx   # Tela de final (7 variações)
  layout.tsx               # Layout raiz com fonte Press Start 2P
  globals.css              # Paleta retrô + utilitários `.pixel-*`
components/
  GameCanvas.tsx           # Cenário 2D em react-konva (4 salas)
  ChoiceModal.tsx          # Modal binário com animação de entrada
  StatsBar.tsx             # 4 barras animadas (Saúde, Foco, Social, Finanças)
  DayCounter.tsx           # Contador de dia + período
  PixelButton.tsx          # Botão estilizado
lib/
  types.ts                 # Tipos TS compartilhados
  store.ts                 # Zustand store (stats, history, persist)
  choices.ts               # Árvore de decisões (7 dias × 3 escolhas)
  endings.ts               # Lógica + textos dos 7 finais
  audio.ts                 # Wrapper Howler (lazy, falha silenciosa)
public/
  sprites/                 # Placeholder — cenário é desenhado via Konva
  sounds/                  # Coloque aqui: bgm.mp3, click.mp3, good.mp3, bad.mp3, day.mp3, ending.mp3
```

## Mecânica

- O personagem vive **7 dias** (constante `TOTAL_DAYS` derivada de `lib/choices.ts`).
- A cada dia, **3 escolhas binárias** alteram 4 stats (0–100): Saúde, Foco, Social, Finanças.
- Saúde a 0 → game over precoce ("trágico").
- Ao terminar o último dia, `calculateEnding` (em `lib/endings.ts`) determina o desfecho.

## Como adicionar uma nova escolha

Em `lib/choices.ts`, adicione um objeto `Choice`:

```ts
{
  id: "d3-extra",
  day: 3,
  order: 4,          // próxima posição livre do dia
  room: "kitchen",
  timeOfDay: "tarde",
  prompt: "Texto da pergunta…",
  options: [
    {
      id: "opt-a",
      label: "Opção A",
      hint: "Subtítulo opcional",
      effects: { health: +4, focus: -2 },
      tags: ["family"],
    },
    {
      id: "opt-b",
      label: "Opção B",
      effects: { health: -3 },
      tags: ["phone", "scroll"],
    },
  ],
}
```

Salve, recarregue. O store usa o array como fonte da verdade — sem migrations.

> Dica: ao adicionar um **novo dia**, lembre que `TOTAL_DAYS = max(day)`. Logo, basta novas entradas com `day: 8`, `day: 9`, etc.

## Como adicionar / ajustar um final

1. Adicione um novo tipo em `EndingType` (`lib/types.ts`).
2. Defina o descritor em `ENDINGS` (`lib/endings.ts`) com `title`, `narrative`, `palette` e `scene`.
3. Adicione a regra em `calculateEnding` — a ordem importa, do mais específico para o mais genérico.

## Áudio

`lib/audio.ts` carrega arquivos sob demanda. Se o arquivo não existir, falha silenciosamente — o jogo continua funcionando. Para ativar o som:

```
public/sounds/
  bgm.mp3       # música ambiente em loop
  click.mp3     # opcional, atualmente não usado
  good.mp3      # tocado quando uma escolha tem soma de stats >= 0
  bad.mp3       # tocado quando uma escolha tem soma de stats < 0
  day.mp3       # transição entre dias
  ending.mp3    # ao chegar no final
```

Para iniciar a BGM, chame `playBgm()` (em `lib/audio.ts`) após o primeiro clique do usuário (políticas de autoplay dos navegadores).

## Acessibilidade

- Navegação por teclado: todos os botões são `<button>` ou `<Link>` nativos.
- Foco visível: outline dourado via `*:focus-visible` em `globals.css`.
- Barras de stat têm `role="progressbar"` + `aria-valuenow`.
- Modal de escolha tem `role="dialog"` e `aria-labelledby`.
- Textos da cena final têm `sr-only` para leitores de tela.

## Persistência

O Zustand persiste em `localStorage` na chave `dailyquiz-save-v1`. Trocar a versão (ex.: `v2`) invalida saves antigos sem migration.

## Mobile

- Canvas escalona automaticamente pela largura do container (resize listener).
- Layout responsivo (`md:` em Tailwind).
- O modal de escolha empilha as opções em telas pequenas.

## Estendendo o cenário (GameCanvas)

O cenário é construído em `components/GameCanvas.tsx` por composição de `<Rect>`. Cada célula lógica = 8 px. Para adicionar uma nova sala:

1. Crie uma função `MinhaSala()` retornando o JSX dos retângulos.
2. Adicione `"minha-sala"` em `Room` (`lib/types.ts`).
3. Inclua no `switch` final de `GameCanvas`.

## Limitações conhecidas

- Sprites são compostos por blocos coloridos (sem PNGs). Para upgrade visual, troque as funções de cenário/personagem por `<Image>` do react-konva carregando assets reais.
- Áudio é opcional: se você não colocar arquivos em `public/sounds/`, o jogo roda em silêncio.
- O save é por dispositivo (localStorage). Não há backend.
