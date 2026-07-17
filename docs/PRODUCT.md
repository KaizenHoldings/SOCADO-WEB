# Socado Web — Product

This document is the source of truth for the product purpose, users, scope, principles, and intended customer experience of Socado Web.

Technical architecture belongs in `ARCHITECTURE.md`. Brand rules belong in `BRAND.md`. Catering-specific business rules belong in `features/CATERING.md`.

## 1. Product purpose

Present the Socado Café experience and convert customer interest into qualified catering quote requests.

The platform must connect inspiration, product exploration, catering configuration, and quote submission in a clear and coherent journey.

There is no payment gateway. The customer journey ends with the submission of a quote request.

## 2. Target users

### Individual customers

People planning:

- Personal celebrations.
- Family gatherings.
- Informal meetings.
- Small events.
- Shared coffee or food experiences.

### Corporate customers

Teams and organizations planning:

- Meetings.
- Workshops.
- Training sessions.
- Office breakfasts.
- Coffee breaks.
- Corporate celebrations.
- Internal or client-facing events.

### Internal users

Authorized Socado team members who manage:

- Products.
- Categories.
- Prices.
- Media.
- Promotions.
- Discounts.
- Taxes.
- Quote records.

## 3. Product scope

### Included

- Public brand website.
- Store and experience presentation.
- Catering discovery.
- Free product selection.
- “Arma tu box”.
- Product filtering.
- Cart or quote summary.
- Event and customer information form.
- Quote creation.
- Transactional customer email.
- Commercial team notification.
- Administrative catalog and pricing management.
- Discount, promotion, and tax configuration.
- CSV catalog operations where enabled.

### Not included in the current scope

- Online payment.
- Automatic payment authorization.
- Customer self-service order confirmation.
- Real-time delivery tracking.
- Full CRM functionality.
- Complete sales pipeline management.
- Marketplace functionality.
- Public administrative access.

Any addition to the excluded scope must be treated as a new product decision and reviewed before implementation.

## 4. Primary customer journey

1. Discover Socado and its catering proposition.
2. Enter the catering experience.
3. Choose between free selection and “Arma tu box”.
4. Select products or configure boxes.
5. Review the quote cart.
6. Enter personal and event information.
7. Submit the request.
8. Receive confirmation.
9. Allow the commercial team to follow up.

The journey should be understandable without requiring technical or internal knowledge.

## 5. Product principles

- Communicate clearly before decorating.
- Reduce friction between discovery and quote submission.
- Preserve the warmth and sophistication of Socado.
- Keep selections and constraints understandable.
- Show the customer what has been selected and what remains incomplete.
- Prevent invalid configurations before submission.
- Validate commercial rules on the server.
- Avoid introducing payment expectations.
- Keep the experience responsive and accessible.
- Use progressive disclosure instead of overwhelming the customer.
- Reuse consistent patterns across catalog, box builder, cart, and checkout.

## 6. Brand alignment

The product must follow the personality, voice, visual identity, typography, colors, imagery, and motion direction defined in:

```text
docs/BRAND.md
```

## 7. Administrative product principles

The private panel should:

- Make catalog maintenance efficient.
- Make price changes controlled and traceable.
- Reduce the risk of inconsistent data.
- Prevent unauthorized changes.
- Support clear validation and error messages.
- Keep generated and operational workflows maintainable.

The panel is not intended to become a complete sales or payment platform in the current phase.

## 8. Quote integrity

The customer interface may display provisional totals, but the server remains authoritative.

Before registering a quote, validate:

- Product availability.
- Current prices.
- Quantities.
- Box rules.
- Discounts.
- Promotions.
- Taxes.
- Required customer and event information.
- Any relevant minimum or maximum rules.

Do not trust client-side values without server validation.

## 9. Accessibility and inclusion

The intended target is WCAG 2.1 AA whenever reasonably achievable.

The product should preserve:

- Semantic structure.
- Keyboard navigation.
- Visible focus states.
- Legible contrast.
- Appropriate touch targets.
- Meaningful image alternatives.
- Clear form labels and errors.
- Reduced-motion alternatives.
- Content visibility when JavaScript or animation fails.
- Language that is inclusive, simple, and respectful.

## 10. Product anti-references

Avoid:

- Over-designed interfaces.
- Confusing selection flows.
- Hidden commercial constraints.
- Aggressive sales pressure.
- Payment-like language when payment is not available.
- Excessive modal nesting.
- Generic brand presentation.
- Interfaces that feel distant or arrogant.
- Decorative motion that delays understanding.
- Duplicate or contradictory totals.
- Client-only business validation.

## 11. Success criteria

The product is working as intended when users can:

- Understand Socado’s catering proposition.
- Choose the appropriate catering mode.
- Complete a valid selection.
- Understand their quote summary.
- Submit event and contact information.
- Receive clear confirmation.
- Generate an actionable request for the commercial team.

Future product metrics may include:

- Catering entry rate.
- Quote flow completion rate.
- Abandonment by step.
- Validation error frequency.
- Average quote composition.
- Commercial response time.
- Quote-to-sale conversion.

Metrics should be added only when data collection and governance are formally defined.

## 12. Feature documentation

Detailed catering rules are documented in:

```text
docs/features/CATERING.md
```

Feature documentation must remain consistent with this product scope and the architecture rules.