import { JOURNAL } from "@/game/data";

/** O diário de campanha, escrito sozinho. */
export function Journal() {
  return (
    <div className="paper min-h-full rounded-sm p-6">
      <div className="relative z-10">
        <h3 className="border-b-2 ink-line pb-2 font-display text-2xl text-ink">Diário de Campanha</h3>
        <ol className="mt-4 space-y-4">
          {JOURNAL.map((e, i) => (
            <li key={i} className="border-l-2 border-ink-red/50 pl-3">
              <div className="label-mono flex gap-2 text-[0.58rem] text-ink-faded">
                <span>Dia {e.day}</span>·<span>{e.time}</span>·<span className="text-ink-red">{e.tag}</span>
              </div>
              <p className="mt-1 font-narrative text-[1.02rem] leading-snug text-ink">{e.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-center font-narrative italic text-ink-faded">— a tinta ainda está fresca —</p>
      </div>
    </div>
  );
}
