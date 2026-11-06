import { ATTRS, fmtMod, mod, type AttrKey } from "@/game/data";
import { cn } from "@/lib/utils";

export type SheetData = {
  name?: string | undefined;
  race?: string | undefined;
  cls?: string | undefined;
  background?: string | undefined;
  motivation?: string | undefined;
  level?: number | undefined;
  xp?: number | undefined;
  attrs?: Partial<Record<AttrKey, number>> | undefined;
  hp?: number | undefined;
  hpMax?: number | undefined;
  ac?: number | undefined;
  attack?: number | undefined;
  weapon?: string | undefined;
  armor?: string | undefined;
  virtues?: string[] | undefined;
  flaws?: string[] | undefined;
  items?: string[] | undefined;
  saves?: [number, number, number] | undefined;
  highlight?: AttrKey | undefined;
};

function Field({ label, value, className }: { label: string; value?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="min-h-[1.6rem] truncate border-b ink-line pb-0.5 font-narrative text-lg italic leading-tight text-ink">
        {value || <span className="text-ink-faded/40">—</span>}
      </div>
      <div className="label-mono mt-0.5 text-[0.55rem] text-ink-faded">{label}</div>
    </div>
  );
}

/** A ficha de papel do herói. */
export function CharacterSheet({ data, className }: { data: SheetData; className?: string }) {
  const a = data.attrs ?? {};
  return (
    <div className={cn("paper rounded-sm p-6 sm:p-7", className)}>
      <div className="relative z-10">
        <div className="flex items-end justify-between border-b-2 ink-line pb-2">
          <h3 className="font-display text-2xl text-ink">Ficha do Aventureiro</h3>
          <span className="label-mono text-ink-faded">Mesa Vazia · v8</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
          <Field label="Nome" value={data.name} className="col-span-2" />
          <Field label="Raça" value={data.race} />
          <Field label="Classe" value={data.cls} />
          <Field label="Antecedente" value={data.background} />
          <Field label="Nível · XP" value={data.level ? `${data.level} · ${data.xp ?? 0}` : undefined} />
        </div>

        <div className="mt-5 grid grid-cols-6 gap-1.5">
          {ATTRS.map((at) => {
            const v = a[at.key];
            return (
              <div
                key={at.key}
                className={cn(
                  "flex flex-col items-center rounded-sm border ink-line py-1.5 transition-colors",
                  data.highlight === at.key && "border-ink-red bg-ink-red/10",
                )}
              >
                <span className="label-mono text-[0.55rem] text-ink-faded">{at.key}</span>
                <span className="font-mono text-xl font-semibold text-ink">{v ?? "·"}</span>
                <span className="font-mono text-[0.7rem] text-ink-faded">{v ? fmtMod(mod(v)) : ""}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { l: "Vida", v: data.hp !== undefined ? `${data.hp}/${data.hpMax}` : undefined, tone: "text-ink-red" },
            { l: "CA", v: data.ac },
            { l: "Ataque", v: data.attack !== undefined ? fmtMod(data.attack) : undefined },
          ].map((s) => (
            <div key={s.l} className="flex flex-col items-center rounded-full border-2 ink-line py-2">
              <span className={cn("font-mono text-xl font-semibold text-ink", s.tone)}>{s.v ?? "·"}</span>
              <span className="label-mono text-[0.55rem] text-ink-faded">{s.l}</span>
            </div>
          ))}
        </div>

        {data.saves && (
          <div className="mt-4">
            <div className="label-mono mb-1 text-[0.55rem] text-ink-faded">Testes de resistência</div>
            <div className="grid grid-cols-3 gap-2 font-mono text-sm text-ink">
              {["Veneno", "Paralisia", "Magia"].map((s, i) => (
                <div key={s} className="flex justify-between border-b ink-line">
                  <span className="text-ink-faded">{s}</span>
                  <span>{data.saves?.[i]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
          <Field label="Arma" value={data.weapon} />
          <Field label="Armadura" value={data.armor} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-5">
          <div>
            <div className="label-mono mb-1 text-[0.55rem] text-ink-faded">Virtudes</div>
            <p className="font-narrative italic text-ink">{data.virtues?.length ? data.virtues.join(", ") : "—"}</p>
          </div>
          <div>
            <div className="label-mono mb-1 text-[0.55rem] text-ink-faded">Defeitos</div>
            <p className="font-narrative italic text-ink-red">{data.flaws?.length ? data.flaws.join(", ") : "—"}</p>
          </div>
        </div>

        {data.items && (
          <div className="mt-4">
            <div className="label-mono mb-1 text-[0.55rem] text-ink-faded">Equipamento</div>
            <ul className="paper-rule font-narrative leading-7 text-ink">
              {data.items.map((i) => (
                <li key={i}>· {i}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4">
          <div className="label-mono mb-1 text-[0.55rem] text-ink-faded">Motivação</div>
          <p className="min-h-[1.6rem] border-b ink-line font-narrative text-lg italic text-ink">
            {data.motivation ? `“${data.motivation}”` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
