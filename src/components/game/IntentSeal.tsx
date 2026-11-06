import { INTENT_LABEL, type Intent } from "@/game/data";
import { cn } from "@/lib/utils";

const toneMap = {
  blood: "border-blood text-blood bg-blood-dark/40",
  bone: "border-bone/60 text-bone bg-secondary",
  violet: "border-violet text-violet bg-violet/15",
  rot: "border-rot text-rot bg-rot/10",
  ember: "border-ember text-ember bg-ember/10",
};

/** Selo de cera com a intenção do inimigo. */
export function IntentSeal({ intent, value }: { intent: Intent; value?: string | undefined }) {
  const meta = INTENT_LABEL[intent];
  return (
    <div className="flex items-center gap-3 animate-rise">
      <div
        className={cn(
          "relative flex size-14 items-center justify-center rounded-full border-2 shadow-[0_6px_14px_oklch(0_0_0/0.6)]",
          toneMap[meta.tone],
        )}
      >
        <div className="absolute inset-1 rounded-full border border-current opacity-40" />
        <span className="font-mono text-sm font-semibold">{value ?? "!"}</span>
      </div>
      <div>
        <div className="label-mono text-bone-dim">Intenção</div>
        <div className={cn("font-display text-lg", toneMap[meta.tone].split(" ")[1])}>{meta.label}</div>
      </div>
    </div>
  );
}
