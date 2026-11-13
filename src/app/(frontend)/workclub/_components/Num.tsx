/**
 * Renders text with every run of digits set in Outfit, while the surrounding
 * letters keep the typeface of their context.
 *
 * Brand rule for this landing: letters in Raleway, numbers in Outfit. Wrapping
 * the digits by hand in every price, schedule and index is error-prone, so all
 * numeric copy goes through this helper. It only changes what is rendered
 * inside a Raleway context; in body copy, already set in Outfit, it is a no-op.
 *
 *   <Num>$20</Num>/día        → "$20" with the digits in Outfit
 *   <Num>8:00 a 18:00</Num>   → both times in Outfit
 */

/** Capturing group: `split` then alternates literal text and digit runs. */
const DIGIT_RUN = /(\d+(?:[.,:/]\d+)*)/;

interface NumProps {
  children: string | number;
  /** Extra classes applied to each digit run. */
  className?: string;
}

export function Num({ children, className }: NumProps) {
  const parts = String(children).split(DIGIT_RUN);

  return (
    <>
      {parts.map((part, index) =>
        // With a single capturing group, odd positions are the matches.
        index % 2 === 1 ? (
          <span key={index} className={`font-outfit ${className ?? ""}`}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default Num;
