"use client";

import { motion } from "framer-motion";

interface Props {
  day: number;
  total: number;
  timeOfDay: "manha" | "tarde" | "noite" | "madrugada";
}

const LABELS = {
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noite",
  madrugada: "Madrugada",
} as const;

export default function DayCounter({ day, total, timeOfDay }: Props) {
  return (
    <motion.div
      key={`${day}-${timeOfDay}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-1"
    >
      <span className="text-[10px] tracking-widest uppercase opacity-70">
        Dia {day} de {total}
      </span>
      <span className="text-sm" style={{ color: "var(--color-pixel-gold)" }}>
        {LABELS[timeOfDay]}
      </span>
    </motion.div>
  );
}
