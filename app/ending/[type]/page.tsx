"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import PixelButton from "@/components/PixelButton";
import { ENDINGS, summarizeDecisions } from "@/lib/endings";
import { useGameStore } from "@/lib/store";
import type { EndingType } from "@/lib/types";

export default function EndingPage() {
  const params = useParams<{ type: string }>();
  const router = useRouter();
  const hydrated = useGameStore((s) => s.hydrated);
  const stats = useGameStore((s) => s.stats);
  const history = useGameStore((s) => s.history);
  const resetGame = useGameStore((s) => s.resetGame);
  const gender = useGameStore((s) => s.gender);

  const type = params.type as EndingType;
  const ending = ENDINGS[type];

  // Se alguém abrir uma URL inválida, manda pro menu.
  useEffect(() => {
    if (!ending) router.replace("/");
  }, [ending, router]);

  if (!ending || !hydrated) return null;

  const top3 = summarizeDecisions(history);

  async function share() {
    const text = `No DailyQuiz cheguei no final: "${ending.title}". Suas escolhas mudam quem você se torna.`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "DailyQuiz", text });
        return;
      } catch {
        /* usuário cancelou */
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      alert("Resultado copiado para a área de transferência!");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10 gap-6 max-w-2xl mx-auto">
      {/* "Cena pixelada" do desfecho — composta com gradientes e blocos */}
      <EndingScene ending={ending} gender={gender} />

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-center"
        style={{ color: ending.palette.accent }}
      >
        {ending.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[11px] md:text-sm leading-relaxed text-center px-2 opacity-90"
      >
        {ending.narrative}
      </motion.p>

      {/* Resumo das 3 decisões mais impactantes */}
      <section className="w-full mt-2">
        <h2 className="text-[10px] uppercase tracking-widest opacity-70 mb-3 text-center">
          O que mais pesou
        </h2>
        <ul className="flex flex-col gap-2">
          {top3.map((r) => (
            <li
              key={`${r.day}-${r.choiceId}`}
              className="flex justify-between items-center text-[10px] md:text-xs pixel-border-soft p-2"
              style={{ background: "var(--color-pixel-wood-dark)" }}
            >
              <span>
                Dia {r.day}: <strong>{r.label}</strong>
              </span>
              <span className="opacity-80">{formatEffects(r.effects)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Stats finais */}
      <section className="w-full">
        <h2 className="text-[10px] uppercase tracking-widest opacity-70 mb-3 text-center">
          Como você terminou
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
          {(Object.keys(stats) as (keyof typeof stats)[]).map((k) => (
            <div
              key={k}
              className="pixel-border-soft p-2 text-center"
              style={{ background: "var(--color-pixel-wood-dark)" }}
            >
              <div className="opacity-70 uppercase">{labelOf(k)}</div>
              <div
                className="text-base mt-1"
                style={{ color: "var(--color-pixel-gold)" }}
              >
                {stats[k]}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3 mt-6">
        <Link href="/game" onClick={() => resetGame()}>
          <PixelButton>Jogar novamente</PixelButton>
        </Link>
        <PixelButton variant="ghost" onClick={share}>
          Compartilhar
        </PixelButton>
      </div>

      <Link
        href="/"
        className="text-[9px] opacity-60 hover:opacity-100 underline mt-4"
      >
        Voltar ao menu
      </Link>
    </main>
  );
}

function labelOf(k: string) {
  return (
    {
      health: "Saúde",
      focus: "Foco",
      social: "Social",
      money: "Finanças",
    } as Record<string, string>
  )[k] ?? k;
}

function formatEffects(e: Record<string, number | undefined>) {
  return Object.entries(e)
    .filter(([, v]) => v !== undefined && v !== 0)
    .map(([k, v]) => `${labelOf(k)} ${v! > 0 ? "+" : ""}${v}`)
    .join(" · ");
}

/**
 * Cena pixelada do final — composta com camadas CSS coloridas usando a paleta
 * do desfecho. Mantém estética sem precisar de assets PNG.
 */
function EndingScene({
  ending,
  gender,
}: {
  ending: (typeof ENDINGS)[EndingType];
  gender: "boy" | "girl";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full aspect-video pixel-border relative overflow-hidden"
      style={{ background: ending.palette.sky }}
      aria-label={ending.scene}
    >
      {/* Chão */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "40%", background: ending.palette.ground }}
      />
      {/* Sol/lua */}
      <div
        className="absolute"
        style={{
          width: 40,
          height: 40,
          background: ending.palette.accent,
          right: "12%",
          top: "12%",
          boxShadow: "0 0 0 4px rgba(0,0,0,0.2)",
        }}
      />
      {/* Silhueta do personagem (8x8 grid escalado) */}
      <div
        className="absolute"
        style={{
          left: "45%",
          bottom: "30%",
          width: 64,
          height: 80,
          imageRendering: "pixelated",
        }}
      >
        <svg viewBox="0 0 8 10" width="100%" height="100%" shapeRendering="crispEdges">
          <rect x="1" y="0" width="4" height="1" fill={gender === "girl" ? "#4a2b1a" : "#2a1b0e"} />
          <rect x="0" y="1" width="6" height="1" fill={gender === "girl" ? "#4a2b1a" : "#2a1b0e"} />
          <rect x="1" y="2" width="4" height="2" fill="#f1c39c" />
          <rect x="2" y="3" width="1" height="1" fill="#2a1b0e" />
          <rect x="4" y="3" width="1" height="1" fill="#2a1b0e" />
          <rect x="1" y="4" width="4" height="3" fill={ending.palette.accent} />
          <rect x="0" y="4" width="1" height="3" fill="#f1c39c" />
          <rect x="5" y="4" width="1" height="3" fill="#f1c39c" />
          <rect x="1" y="7" width="4" height="2" fill="#3a2b1f" />
        </svg>
      </div>
      {/* Texto descritivo da cena para acessibilidade */}
      <span className="sr-only">{ending.scene}</span>
    </motion.div>
  );
}
