import type { Level } from "../types";
import { levelMeta } from "../lib/engine";

export function LevelBadge({ level, large }: { level: Level; large?: boolean }) {
  const meta = levelMeta[level];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-semibold ${
        large ? "px-4 py-2 text-sm" : "px-3 py-1 text-xs"
      }`}
      style={{ backgroundColor: meta.soft, color: meta.tone }}
    >
      <span
        className="inline-block size-2 rounded-full"
        style={{ backgroundColor: meta.tone }}
        aria-hidden
      />
      {meta.short}
    </span>
  );
}
