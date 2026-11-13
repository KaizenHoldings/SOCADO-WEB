import type { InfoCard } from "@/lib/services/workclub-passes.service";
import { InfoCardIncludes } from "./InfoCardIncludes";
import { InfoCardTable } from "./InfoCardTable";

/**
 * Row of info cards of the open pass type, in the order of the admin.
 *
 * Each card is a block in Payload, so the shape decides the component. A pass
 * without blocks renders nothing — not an empty row.
 *
 * The wider column is for the list of benefits: it holds two columns of text,
 * while the table is a short column of figures.
 */
export function InfoCards({ cards }: { cards: InfoCard[] }) {
  if (cards.length === 0) return null;

  return (
    <div
      className={`grid gap-6 ${cards.length > 1 ? "md:grid-cols-[1.4fr_1fr]" : ""}`}
    >
      {cards.map((card, index) =>
        card.type === "includes" ? (
          <InfoCardIncludes key={`${card.type}-${index}`} card={card} />
        ) : (
          <InfoCardTable key={`${card.type}-${index}`} card={card} />
        ),
      )}
    </div>
  );
}

export default InfoCards;
