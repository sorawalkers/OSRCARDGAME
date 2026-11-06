import { cn } from "@/lib/utils";

export type NodeType = "acampamento" | "estrada" | "ruina" | "vila" | "santuario" | "covil" | "pedido" | "chefe";

export type MapNode = { id: string; col: number; y: number; type: NodeType; name: string; links: string[] };

export const NODE_META: Record<NodeType, { label: string; desc: string; glyph: string }> = {
  acampamento: { label: "Acampamento", desc: "Onde tudo começou. A fogueira já apagou.", glyph: "M-11 10 L0 -10 L11 10 Z M0 -10 L0 10" },
  estrada: { label: "Estrada", desc: "Uma cena acontece no caminho.", glyph: "M-8 0 A8 8 0 1 0 8 0 A8 8 0 1 0 -8 0 M-2 0 A2 2 0 1 0 2 0 A2 2 0 1 0 -2 0" },
  ruina: { label: "Ruína", desc: "Luta ou saque. Às vezes os dois.", glyph: "M-10 10 L-10 -3 A10 10 0 0 1 3 -9.5 M10 10 L10 -1 M-14 10 L14 10" },
  vila: { label: "Vila", desc: "Descanso, compras, gente com pedidos.", glyph: "M-10 10 L-10 -2 L0 -11 L10 -2 L10 10 Z M-3 10 L-3 3 L3 3 L3 10" },
  santuario: { label: "Santuário", desc: "Orações voltam. A corrupção cede um pouco.", glyph: "M0 -12 L0 12 M-7 -4 L7 -4 M-9 12 L9 12" },
  covil: { label: "Covil", desc: "Inimigo forte. Melhor recompensa.", glyph: "M-9 3 A9 9 0 1 1 9 3 L6 6 L6 11 L-6 11 L-6 6 Z M-4 -1 L-2 -1 M2 -1 L4 -1" },
  pedido: { label: "Pedido", desc: "A missão de Hesper, a ferreira cega.", glyph: "M-8 -10 L8 -10 L8 10 L-8 10 Z M-4 -4 L4 -4 M-4 1 L4 1 M-4 5 L2 5" },
  chefe: { label: "Coração da Região", desc: "A Mãe das Moscas espera aqui.", glyph: "M-13 8 L-13 -6 L-6 1 L0 -11 L6 1 L13 -6 L13 8 Z" },
};

export const REGION_NODES: MapNode[] = [
  { id: "a0", col: 0, y: 260, type: "acampamento", name: "Acampamento da Borda", links: ["b0", "b1"] },
  { id: "b0", col: 1, y: 170, type: "estrada", name: "A Forca Torta", links: ["c0", "c1"] },
  { id: "b1", col: 1, y: 350, type: "ruina", name: "Capela Afundada", links: ["c1", "c2"] },
  { id: "c0", col: 2, y: 110, type: "vila", name: "Pedra-Funda", links: ["d0"] },
  { id: "c1", col: 2, y: 260, type: "estrada", name: "Encruzilhada do Violinista", links: ["d0", "d1"] },
  { id: "c2", col: 2, y: 410, type: "santuario", name: "Santa dos Afogados", links: ["d1", "d2"] },
  { id: "d0", col: 3, y: 170, type: "pedido", name: "Ruína do Martelo", links: ["e0", "e1"] },
  { id: "d1", col: 3, y: 300, type: "covil", name: "Toca da Névoa", links: ["e1"] },
  { id: "d2", col: 3, y: 430, type: "estrada", name: "Brejo dos Sinos", links: ["e1", "e2"] },
  { id: "e0", col: 4, y: 120, type: "ruina", name: "Torre Sem Escada", links: ["f0"] },
  { id: "e1", col: 4, y: 270, type: "estrada", name: "Mesa Posta para Seis", links: ["f0", "f1"] },
  { id: "e2", col: 4, y: 410, type: "vila", name: "Vau-Negro", links: ["f1"] },
  { id: "f0", col: 5, y: 180, type: "covil", name: "?", links: ["g0", "g1"] },
  { id: "f1", col: 5, y: 350, type: "estrada", name: "?", links: ["g1"] },
  { id: "g0", col: 6, y: 130, type: "santuario", name: "?", links: ["h0"] },
  { id: "g1", col: 6, y: 300, type: "ruina", name: "?", links: ["h0", "h1"] },
  { id: "h0", col: 7, y: 200, type: "vila", name: "?", links: ["i0"] },
  { id: "h1", col: 7, y: 380, type: "covil", name: "?", links: ["i0"] },
  { id: "i0", col: 8, y: 270, type: "estrada", name: "?", links: ["z"] },
  { id: "z", col: 9, y: 260, type: "chefe", name: "O Ninho", links: [] },
];

const X = (col: number) => 70 + col * 106;

export function RegionMap({
  current,
  visited,
  selected,
  sight = 2,
  onSelect,
}: {
  current: string;
  visited: string[];
  selected?: string | undefined;
  sight?: number;
  onSelect?: ((n: MapNode) => void) | undefined;
}) {
  const byId = Object.fromEntries(REGION_NODES.map((n) => [n.id, n]));
  const cur = byId[current]!;
  const reachable = new Set(cur.links);
  const fogFrom = cur.col + sight + 1;
  const visitedEdges = new Set<string>();
  for (let i = 0; i < visited.length - 1; i++) visitedEdges.add(`${visited[i]}-${visited[i + 1]}`);

  return (
    <svg viewBox="0 0 1100 520" className="block h-auto w-full text-ink" role="img" aria-label="Mapa da região">
      <defs>
        <filter id="fog" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="70" />
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
        <linearGradient id="fogGrad" x1="0" x2="1">
          <stop offset="0" stopColor="var(--background)" stopOpacity="0" />
          <stop offset="0.18" stopColor="var(--background)" stopOpacity="0.82" />
          <stop offset="1" stopColor="var(--background)" stopOpacity="0.94" />
        </linearGradient>
      </defs>

      {/* decoração cartográfica */}
      <g filter="url(#rough)" stroke="currentColor" fill="none" strokeOpacity="0.35" strokeWidth="1.1">
        {([[160, 470], [210, 488], [480, 70], [520, 60], [700, 480], [380, 490]] as [number, number][]).map(([x, y], i) => (
          <path key={`h${i}`} d={`M${x - 14} ${y} L${x} ${y - 14} L${x + 14} ${y}`} />
        ))}
        {([[120, 90], [140, 104], [300, 470], [620, 90], [640, 104], [880, 450]] as [number, number][]).map(([x, y], i) => (
          <g key={`t${i}`}>
            <path d={`M${x} ${y} L${x} ${y - 16} M${x - 6} ${y - 6} L${x} ${y - 16} L${x + 6} ${y - 6}`} />
          </g>
        ))}
        <path d="M30 330 C 120 360 160 300 250 330 S 400 370 460 340" strokeDasharray="2 5" />
        {/* forca */}
        <path d="M250 70 L250 30 L272 30 M272 30 L272 40 M250 40 L260 30" strokeOpacity="0.55" />
      </g>

      {/* caminhos */}
      {REGION_NODES.flatMap((n) =>
        n.links.map((l) => {
          const t = byId[l]!;
          const key = `${n.id}-${l}`;
          const walked = visitedEdges.has(key);
          const next = n.id === current && reachable.has(l);
          const mx = (X(n.col) + X(t.col)) / 2;
          return (
            <path
              key={key}
              d={`M${X(n.col)} ${n.y} C ${mx} ${n.y}, ${mx} ${t.y}, ${X(t.col)} ${t.y}`}
              fill="none"
              stroke={walked ? "var(--ink-red)" : "currentColor"}
              strokeOpacity={walked ? 0.9 : next ? 0.75 : 0.35}
              strokeWidth={walked ? 2.4 : next ? 1.8 : 1.2}
              strokeDasharray={walked ? undefined : "5 6"}
              filter="url(#rough)"
            />
          );
        }),
      )}

      {/* lugares */}
      {REGION_NODES.map((n) => {
        const fogged = n.col >= fogFrom && n.type !== "chefe";
        const isCur = n.id === current;
        const isVisited = visited.includes(n.id);
        const canGo = reachable.has(n.id);
        const isSel = selected === n.id;
        const meta = NODE_META[n.type];
        return (
          <g
            key={n.id}
            transform={`translate(${X(n.col)} ${n.y})`}
            className={cn(canGo && "cursor-pointer")}
            onClick={() => canGo && onSelect?.(n)}
          >
            {canGo && (
              <circle r="26" fill="none" stroke="var(--ember)" strokeWidth="1.5" strokeDasharray="3 4" className="origin-center animate-[spin_14s_linear_infinite]" />
            )}
            <circle
              r="19"
              fill={isSel ? "var(--ember)" : "var(--paper)"}
              fillOpacity={isSel ? 0.35 : 1}
              stroke={n.type === "chefe" ? "var(--ink-red)" : "currentColor"}
              strokeWidth={isCur ? 3 : 1.5}
              strokeOpacity={isVisited || canGo || isCur ? 1 : 0.6}
            />
            <path
              d={meta.glyph}
              fill="none"
              stroke={n.type === "chefe" ? "var(--ink-red)" : "currentColor"}
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={isVisited && !isCur ? 0.45 : 1}
            />
            {!fogged && (
              <text
                y="36"
                textAnchor="middle"
                className="fill-ink"
                style={{ fontFamily: "var(--font-narrative)", fontStyle: "italic", fontSize: 13 }}
                opacity={isVisited && !isCur ? 0.55 : 0.9}
              >
                {n.name}
              </text>
            )}
            {isCur && (
              <g transform="translate(0 -34)">
                <path d="M0 10 L-7 -2 A8 8 0 1 1 7 -2 Z" fill="var(--ink-red)" />
                <circle cy="-5" r="2.6" fill="var(--paper)" />
              </g>
            )}
          </g>
        );
      })}

      {/* névoa */}
      <rect x={X(fogFrom) - 70} y="-40" width={1200} height="620" fill="url(#fogGrad)" filter="url(#fog)" />
      <text
        x={X(fogFrom) + 120}
        y="270"
        textAnchor="middle"
        fill="var(--bone-dim)"
        style={{ fontFamily: "var(--font-narrative)", fontStyle: "italic", fontSize: 22 }}
        opacity="0.55"
      >
        aqui a névoa não deixa ver
      </text>

      {/* coração da região sempre visível ao fundo */}
      <g transform={`translate(${X(9)} 260)`}>
        <circle r="30" fill="none" stroke="var(--blood)" strokeOpacity="0.5" strokeWidth="1" className="animate-flicker" />
        <text y="52" textAnchor="middle" fill="var(--blood)" style={{ fontFamily: "var(--font-display)", fontSize: 14 }}>
          Coração da Região
        </text>
      </g>
    </svg>
  );
}
