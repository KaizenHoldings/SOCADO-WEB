import type { InfoCardIncludes as InfoCardIncludesData } from "@/lib/services/workclub-passes.service";
import { Num } from "./Num";

/**
 * What a pass includes, as a list of benefits under the price cards.
 *
 * Each benefit hangs from a terracotta rule: the bold line says what it is and
 * the thin one says the condition. Two columns from `sm` up, and one when
 * there is a single benefit, so it does not sit next to an empty half.
 */
export function InfoCardIncludes({ card }: { card: InfoCardIncludesData }) {
  const single = card.items.length === 1;

  return (
    <article className="rounded-2xl border border-wc-gris-claro/70 bg-white p-[var(--pass-info-pad)]">
      {card.title && (
        <h3 className="font-raleway text-lg font-semibold text-wc-verde lowercase">
          <Num>{card.title}</Num>
        </h3>
      )}

      <ul
        className={`mt-[var(--pass-small-mt)] grid gap-x-6 gap-y-3 ${
          single ? "" : "sm:grid-cols-2"
        }`}
      >
        {card.items.map((item, index) => (
          <li
            key={`${item.title}-${index}`}
            className="border-l-2 border-wc-terracota-medio pl-3 text-left"
          >
            <p className="font-raleway text-sm font-semibold text-wc-verde lowercase">
              <Num>{item.title}</Num>
            </p>
            {item.detail && (
              <p className="font-outfit text-sm font-light leading-snug text-wc-marron/80 lowercase">
                <Num>{item.detail}</Num>
              </p>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default InfoCardIncludes;
