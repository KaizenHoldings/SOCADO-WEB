import type { InfoCardTable as InfoCardTableData } from "@/lib/services/workclub-passes.service";
import { Num } from "./Num";

/**
 * A short table under the price cards: credits per room, rates per hour.
 *
 * Two shapes, chosen in the admin because they read differently:
 *
 * - `inline` is a sentence — "sala 1: 1 crédito por hora" — where the value
 *   completes the label and must stay next to it.
 * - `split` is a price list: the label on the left, the figure on the right,
 *   so the figures line up and can be compared.
 */
export function InfoCardTable({ card }: { card: InfoCardTableData }) {
  const split = card.layout === "split";

  return (
    <article className="rounded-2xl bg-wc-verde-claro/25 p-[var(--pass-info-pad)]">
      {card.title && (
        <h3 className="font-raleway text-lg font-semibold text-wc-verde lowercase">
          <Num>{card.title}</Num>
        </h3>
      )}
      {card.subtitle && (
        <p className="font-outfit text-sm font-light text-wc-marron/70 lowercase">
          <Num>{card.subtitle}</Num>
        </p>
      )}

      <dl className="mt-[var(--pass-small-mt)]">
        {card.rows.map((row, index) => (
          <div
            key={`${row.label}-${index}`}
            className={`border-b border-wc-gris-claro py-1.5 last:border-b-0 ${
              split ? "flex items-baseline justify-between gap-4" : ""
            }`}
          >
            <dt
              className={`font-raleway text-sm font-semibold text-wc-verde lowercase ${
                split ? "" : "inline"
              }`}
            >
              <Num>{row.label}</Num>
              {/* The colon belongs to the sentence, not to the stored label. */}
              {!split && ":"}
              {split && row.note && (
                <span className="font-outfit font-light text-wc-marron/70">
                  {" · "}
                  <Num>{row.note}</Num>
                </span>
              )}
            </dt>
            <dd
              className={
                split
                  ? "shrink-0 font-raleway text-sm font-semibold text-wc-terracota-medio lowercase"
                  : "inline font-outfit text-sm font-light text-wc-marron/80 lowercase"
              }
            >
              {!split && " "}
              <Num>{row.value}</Num>
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default InfoCardTable;
