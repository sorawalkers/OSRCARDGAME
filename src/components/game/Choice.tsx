import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Escolha narrativa com marcador em losango. */
export function Choice({
  children,
  check,
  onClick,
  disabled,
  tone = "bone",
}: {
  children: ReactNode;
  check?: string | undefined;
  onClick?: (() => void) | undefined;
  disabled?: boolean | undefined;
  tone?: "bone" | "violet" | "blood" | undefined;
}) {
  const diamond =
    tone === "violet" ? "border-violet bg-violet/20" : tone === "blood" ? "border-blood bg-blood/20" : "border-ember/70 bg-transparent";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex w-full items-start gap-4 border-b border-border/50 py-3 text-left transition-colors",
        "hover:border-ember/50 disabled:cursor-not-allowed disabled:opacity-40",
      )}
    >
      <span
        className={cn(
          "mt-2 size-2.5 shrink-0 rotate-45 border transition-all group-hover:scale-125 group-hover:bg-ember group-hover:shadow-[var(--shadow-ember)]",
          diamond,
        )}
      />
      <span className="flex-1 font-narrative text-lg leading-snug text-bone group-hover:text-ember-glow">
        {children}
      </span>
      {check && <span className="label-mono mt-1.5 shrink-0 text-bone-dim">{check}</span>}
    </button>
  );
}
