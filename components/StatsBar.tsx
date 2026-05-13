"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Stats, StatKey } from "@/lib/types";

interface Props {
  stats: Stats;
  /** Delta da última escolha, usado para mostrar +N/-N flutuando. */
  delta?: Partial<Stats>;
}

const META: Record<
  StatKey,
  { label: string; color: string; emoji: string }
> = {
  health: { label: "Saúde", color: "var(--color-stat-health)", emoji: "♥" },
  focus: { label: "Foco", color: "var(--color-stat-focus)", emoji: "✦" },
  social: { label: "Social", color: "var(--color-stat-social)", emoji: "☺" },
  money: { label: "Finanças", color: "var(--color-stat-money)", emoji: "$" },
};

function Bar({ k, value, delta }: { k: StatKey; value: number; delta?: number }) {
  const meta = META[k];
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span
        className="text-xs"
        style={{ color: meta.color }}
        aria-hidden="true"
      >
        {meta.emoji}
      </span>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between text-[8px] uppercase tracking-wider">
          <span>{meta.label}</span>
          <span className="relative">
            {value}
            <AnimatePresence>
              {delta !== undefined && delta !== 0 && (
                <motion.span
                  key={`${k}-${delta}-${value}`}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -16 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="absolute right-0 -top-1 text-[10px]"
                  style={{
                    color: delta > 0 ? "var(--color-pixel-leaf)" : "var(--color-pixel-rose)",
                  }}
                >
                  {delta > 0 ? `+${delta}` : delta}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </div>
        <div
          className="h-2 w-full bg-pixel-ink/60 pixel-border-soft mt-1 relative overflow-hidden"
          role="progressbar"
          aria-label={meta.label}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className="h-full"
            style={{ background: meta.color }}
            initial={false}
            animate={{ width: `${value}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>
    </div>
  );
}

export default function StatsBar({ stats, delta }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full">
      {(Object.keys(META) as StatKey[]).map((k) => (
        <Bar key={k} k={k} value={stats[k]} delta={delta?.[k]} />
      ))}
    </div>
  );
}
