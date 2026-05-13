"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Rect, Group, Line } from "react-konva";
import type Konva from "konva";
import type { CharacterGender, Room } from "@/lib/types";

/**
 * GameCanvas — cenário pixelado desenhado por composição de retângulos.
 *
 * IMPORTANTE: react-konva NÃO aceita React Fragments (<>...</>) como filhos
 * de um nó Konva — o reconciler tenta chamar `getParent` num Fragment e
 * estoura. Por isso, toda função que devolve múltiplos nós retorna um
 * <Group>, nunca um Fragment.
 */

interface Props {
  room: Room;
  gender: CharacterGender;
  pose?: "idle" | "phone" | "sleep" | "study" | "walk";
}

const PIXEL = 8;
const COLS = 40;
const ROWS = 22;

const C = {
  skyDay: "#88c0d0",
  skyDusk: "#d96b6b",
  wall: "#a87246",
  wallDark: "#6e4626",
  wood: "#a87246",
  floor: "#8c6b3f",
  floorDark: "#5a4424",
  grass: "#5b8a3a",
  grassDark: "#3d5e25",
  cream: "#f1e0bb",
  ink: "#2a1b0e",
  rose: "#d96b6b",
  gold: "#e7b94d",
  leaf: "#7fb069",
  night: "#1d2840",
  water: "#6b8fd9",
};

/** Helper: pinta um bloco lógico (8px) na grade. */
function px({
  cx,
  cy,
  w = 1,
  h = 1,
  color,
  key,
}: {
  cx: number;
  cy: number;
  w?: number;
  h?: number;
  color: string;
  key?: string | number;
}) {
  return (
    <Rect
      key={key}
      x={cx * PIXEL}
      y={cy * PIXEL}
      width={w * PIXEL}
      height={h * PIXEL}
      fill={color}
      perfectDrawEnabled={false}
      listening={false}
    />
  );
}

/* ---------- CENÁRIOS (cada um devolve UM <Group>) ---------- */

function Bedroom() {
  const plankLines = [15, 17, 19, 21].map((r) => (
    <Line
      key={`plank-${r}`}
      points={[0, r * PIXEL, COLS * PIXEL, r * PIXEL]}
      stroke={C.floorDark}
      strokeWidth={1}
      listening={false}
    />
  ));

  return (
    <Group>
      {/* Parede + rodapé + piso */}
      <Rect x={0} y={0} width={COLS * PIXEL} height={14 * PIXEL} fill={C.wall} />
      <Rect
        x={0}
        y={13 * PIXEL}
        width={COLS * PIXEL}
        height={1 * PIXEL}
        fill={C.wallDark}
      />
      <Rect
        x={0}
        y={14 * PIXEL}
        width={COLS * PIXEL}
        height={(ROWS - 14) * PIXEL}
        fill={C.floor}
      />
      {plankLines}
      {/* Janela */}
      {px({ cx: 4, cy: 3, w: 8, h: 6, color: C.ink, key: "win-frame" })}
      {px({ cx: 5, cy: 4, w: 6, h: 4, color: C.skyDay, key: "win-sky" })}
      {px({ cx: 7, cy: 4, w: 2, h: 4, color: C.ink, key: "win-cross-v" })}
      {px({ cx: 5, cy: 5, w: 6, h: 1, color: C.ink, key: "win-cross-h" })}
      {/* Cama */}
      {px({ cx: 22, cy: 11, w: 12, h: 2, color: C.wallDark, key: "bed-head" })}
      {px({ cx: 22, cy: 13, w: 12, h: 3, color: C.rose, key: "bed-body" })}
      {px({ cx: 22, cy: 11, w: 4, h: 2, color: C.cream, key: "bed-pillow" })}
      {px({ cx: 33, cy: 13, w: 1, h: 3, color: C.wallDark, key: "bed-foot" })}
      {/* Mesa */}
      {px({ cx: 3, cy: 14, w: 8, h: 1, color: C.wallDark, key: "desk-top" })}
      {px({ cx: 3, cy: 15, w: 1, h: 3, color: C.wallDark, key: "desk-l" })}
      {px({ cx: 10, cy: 15, w: 1, h: 3, color: C.wallDark, key: "desk-r" })}
      {/* Computador */}
      {px({ cx: 5, cy: 11, w: 4, h: 3, color: C.ink, key: "pc" })}
      {px({ cx: 6, cy: 12, w: 2, h: 1, color: C.leaf, key: "pc-screen" })}
      {/* Quadro */}
      {px({ cx: 16, cy: 3, w: 5, h: 4, color: C.ink, key: "frame" })}
      {px({ cx: 17, cy: 4, w: 3, h: 2, color: C.gold, key: "frame-inner" })}
    </Group>
  );
}

function Kitchen() {
  const tiles = Array.from({ length: 10 }).map((_, i) =>
    px({
      cx: i * 4,
      cy: 11,
      w: 4,
      h: 2,
      color: i % 2 ? "#e7d3ad" : "#d8c094",
      key: `tile-${i}`,
    }),
  );

  return (
    <Group>
      <Rect x={0} y={0} width={COLS * PIXEL} height={14 * PIXEL} fill={C.cream} />
      <Rect
        x={0}
        y={13 * PIXEL}
        width={COLS * PIXEL}
        height={1 * PIXEL}
        fill={C.wallDark}
      />
      <Rect
        x={0}
        y={14 * PIXEL}
        width={COLS * PIXEL}
        height={(ROWS - 14) * PIXEL}
        fill={C.floorDark}
      />
      {tiles}
      {/* Bancada */}
      {px({ cx: 4, cy: 13, w: 20, h: 1, color: C.wallDark, key: "counter-top" })}
      {px({ cx: 4, cy: 14, w: 20, h: 2, color: C.wood, key: "counter-body" })}
      {px({ cx: 10, cy: 11, w: 6, h: 2, color: C.water, key: "window" })}
      {/* Fogão */}
      {px({ cx: 20, cy: 11, w: 3, h: 2, color: C.ink, key: "stove" })}
      {px({ cx: 21, cy: 12, w: 1, h: 1, color: C.rose, key: "stove-flame" })}
      {/* Mesa */}
      {px({ cx: 26, cy: 16, w: 10, h: 1, color: C.wallDark, key: "table-top" })}
      {px({ cx: 27, cy: 17, w: 1, h: 3, color: C.wallDark, key: "table-l" })}
      {px({ cx: 34, cy: 17, w: 1, h: 3, color: C.wallDark, key: "table-r" })}
      {px({ cx: 29, cy: 15, w: 2, h: 1, color: C.gold, key: "plate" })}
    </Group>
  );
}

function Livingroom() {
  return (
    <Group>
      <Rect x={0} y={0} width={COLS * PIXEL} height={14 * PIXEL} fill="#c8aa7a" />
      <Rect
        x={0}
        y={13 * PIXEL}
        width={COLS * PIXEL}
        height={1 * PIXEL}
        fill={C.wallDark}
      />
      <Rect
        x={0}
        y={14 * PIXEL}
        width={COLS * PIXEL}
        height={(ROWS - 14) * PIXEL}
        fill={C.floor}
      />
      {/* TV */}
      {px({ cx: 4, cy: 8, w: 8, h: 5, color: C.ink, key: "tv" })}
      {px({ cx: 5, cy: 9, w: 6, h: 3, color: C.skyDay, key: "tv-screen" })}
      {/* Sofá */}
      {px({ cx: 20, cy: 13, w: 14, h: 4, color: C.rose, key: "sofa" })}
      {px({ cx: 20, cy: 12, w: 14, h: 1, color: C.wallDark, key: "sofa-back" })}
      {px({ cx: 20, cy: 13, w: 1, h: 4, color: C.wallDark, key: "sofa-l" })}
      {px({ cx: 33, cy: 13, w: 1, h: 4, color: C.wallDark, key: "sofa-r" })}
      {/* Tapete */}
      {px({ cx: 6, cy: 17, w: 20, h: 3, color: C.gold, key: "rug" })}
      {px({ cx: 6, cy: 17, w: 20, h: 1, color: C.wallDark, key: "rug-top" })}
      {px({ cx: 6, cy: 19, w: 20, h: 1, color: C.wallDark, key: "rug-bottom" })}
    </Group>
  );
}

function Outside() {
  const trail = Array.from({ length: 14 }).map((_, i) =>
    px({
      cx: 9 + i,
      cy: 15 + (i % 2),
      w: 2,
      h: 1,
      color: C.floor,
      key: `trail-${i}`,
    }),
  );

  return (
    <Group>
      <Rect x={0} y={0} width={COLS * PIXEL} height={12 * PIXEL} fill={C.skyDay} />
      <Rect
        x={0}
        y={12 * PIXEL}
        width={COLS * PIXEL}
        height={(ROWS - 12) * PIXEL}
        fill={C.grass}
      />
      {/* Nuvens */}
      {px({ cx: 4, cy: 3, w: 5, h: 1, color: C.cream, key: "cloud1-top" })}
      {px({ cx: 3, cy: 4, w: 7, h: 1, color: C.cream, key: "cloud1-bot" })}
      {px({ cx: 22, cy: 2, w: 4, h: 1, color: C.cream, key: "cloud2-top" })}
      {px({ cx: 21, cy: 3, w: 6, h: 1, color: C.cream, key: "cloud2-bot" })}
      {/* Sol */}
      {px({ cx: 33, cy: 2, w: 3, h: 3, color: C.gold, key: "sun" })}
      {/* Casa */}
      {px({ cx: 5, cy: 8, w: 10, h: 5, color: C.wood, key: "house-body" })}
      {px({ cx: 4, cy: 6, w: 12, h: 2, color: C.rose, key: "roof" })}
      {px({ cx: 4, cy: 7, w: 12, h: 1, color: C.wallDark, key: "roof-edge" })}
      {px({ cx: 9, cy: 10, w: 2, h: 3, color: C.ink, key: "door" })}
      {px({ cx: 6, cy: 9, w: 2, h: 2, color: C.skyDay, key: "window-l" })}
      {px({ cx: 12, cy: 9, w: 2, h: 2, color: C.skyDay, key: "window-r" })}
      {/* Trilha */}
      {trail}
      {/* Árvore */}
      {px({ cx: 28, cy: 11, w: 2, h: 4, color: C.wallDark, key: "trunk" })}
      {px({ cx: 26, cy: 7, w: 6, h: 5, color: C.grassDark, key: "leaves" })}
      {px({ cx: 27, cy: 6, w: 4, h: 1, color: C.grassDark, key: "leaves-top" })}
    </Group>
  );
}

/* ---------- PERSONAGEM ---------- */

interface CharProps {
  gender: CharacterGender;
  pose: NonNullable<Props["pose"]>;
  x: number;
  y: number;
}

function Character({ gender, pose, x, y }: CharProps) {
  const skin = "#f1c39c";
  const hair = gender === "girl" ? "#4a2b1a" : "#2a1b0e";
  const shirt = gender === "girl" ? C.rose : C.water;
  const pants = "#3a2b1f";

  if (pose === "sleep") {
    return (
      <Group x={x * PIXEL} y={y * PIXEL}>
        {px({ cx: 0, cy: 0, w: 2, h: 2, color: hair, key: "s-hair" })}
        {px({ cx: 2, cy: 0, w: 1, h: 2, color: skin, key: "s-face" })}
        {px({ cx: 2, cy: 1, w: 1, h: 1, color: C.ink, key: "s-eye" })}
        {px({ cx: 3, cy: 0, w: 5, h: 2, color: shirt, key: "s-body" })}
        {px({ cx: 3, cy: -1, w: 1, h: 1, color: C.cream, key: "s-z" })}
      </Group>
    );
  }

  return (
    <Group x={x * PIXEL} y={y * PIXEL}>
      {/* Cabelo */}
      {px({ cx: 1, cy: 0, w: 4, h: 1, color: hair, key: "hair-top" })}
      {px({ cx: 0, cy: 1, w: 6, h: 1, color: hair, key: "hair-side" })}
      {gender === "girl" && px({ cx: 0, cy: 2, w: 1, h: 3, color: hair, key: "hair-l" })}
      {gender === "girl" && px({ cx: 5, cy: 2, w: 1, h: 3, color: hair, key: "hair-r" })}
      {/* Rosto */}
      {px({ cx: 1, cy: 2, w: 4, h: 2, color: skin, key: "face" })}
      {px({ cx: 2, cy: 3, w: 1, h: 1, color: C.ink, key: "eye-l" })}
      {px({ cx: 4, cy: 3, w: 1, h: 1, color: C.ink, key: "eye-r" })}
      {/* Camisa */}
      {px({ cx: 1, cy: 4, w: 4, h: 3, color: shirt, key: "shirt" })}
      {/* Braços */}
      {px({ cx: 0, cy: 4, w: 1, h: 3, color: skin, key: "arm-l" })}
      {px({ cx: 5, cy: 4, w: 1, h: 3, color: skin, key: "arm-r" })}
      {/* Calça */}
      {px({ cx: 1, cy: 7, w: 4, h: 2, color: pants, key: "pants" })}
      {px({ cx: 1, cy: 9, w: 1, h: 1, color: pants, key: "leg-l" })}
      {px({ cx: 4, cy: 9, w: 1, h: 1, color: pants, key: "leg-r" })}
      {/* Adereço por pose */}
      {pose === "phone" &&
        px({ cx: 2, cy: 5, w: 2, h: 1, color: C.skyDay, key: "phone" })}
      {pose === "study" &&
        px({ cx: 1, cy: 6, w: 4, h: 1, color: C.cream, key: "book" })}
      {pose === "study" &&
        px({ cx: 2, cy: 6, w: 2, h: 1, color: C.ink, key: "book-ink" })}
    </Group>
  );
}

/* ---------- COMPONENTE PRINCIPAL ---------- */

export default function GameCanvas({ room, gender, pose = "idle" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<Konva.Stage | null>(null);

  const baseW = COLS * PIXEL;
  const baseH = ROWS * PIXEL;

  // Escalona pela MENOR dimensão disponível (largura ou altura). Mobile
  // portrait costuma ter largura folgada e altura apertada — escalonar só
  // pela largura quebra. ResizeObserver pega mudanças do container que
  // o resize do window não captura (ex.: rotacionar, abrir keyboard).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function resize() {
      if (!el) return;
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (cw === 0 || ch === 0) return;
      const s = Math.min(cw / baseW, ch / baseH);
      setScale(Math.max(0.3, Math.min(4, s)));
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    window.addEventListener("resize", resize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [baseW, baseH]);

  const charPos = useMemo(() => {
    switch (room) {
      case "bedroom":
        return pose === "sleep" ? { x: 23, y: 12 } : { x: 14, y: 14 };
      case "kitchen":
        return { x: 17, y: 14 };
      case "livingroom":
        return { x: 14, y: 15 };
      case "outside":
        return { x: 20, y: 15 };
    }
  }, [room, pose]);

  return (
    <div
      ref={containerRef}
      className="w-full pixel-border bg-pixel-night flex items-center justify-center mx-auto overflow-hidden"
      // Altura clampada: nunca menos que 180px (legível), nunca mais que
      // 56vh (sobra espaço pro modal e header). `aspect-ratio` removido
      // de propósito — quem dita o tamanho é o `height`, e o Stage se
      // ajusta pelo scale calculado no effect.
      style={{
        height: "clamp(180px, 56vh, 520px)",
        maxWidth: `min(100%, calc(56vh * ${baseW} / ${baseH}))`,
      }}
    >
      <Stage
        ref={stageRef}
        width={baseW * scale}
        height={baseH * scale}
        scaleX={scale}
        scaleY={scale}
      >
        <Layer imageSmoothingEnabled={false}>
          {room === "bedroom" && <Bedroom />}
          {room === "kitchen" && <Kitchen />}
          {room === "livingroom" && <Livingroom />}
          {room === "outside" && <Outside />}
          <Character gender={gender} pose={pose} x={charPos.x} y={charPos.y} />
        </Layer>
      </Stage>
    </div>
  );
}
