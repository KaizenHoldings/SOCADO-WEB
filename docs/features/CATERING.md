# Catering Feature

This document is the source of truth for the catering user experience and business rules.

It must be read together with:

- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/BRAND.md`
- `docs/UI_UX.md`

## 1. Purpose

Allow individual and corporate customers to explore Socado catering products, configure a valid selection, and submit a quote request for an event.

The feature does not include online payment.

## 2. Scope

The catering experience includes:

- Free product selection.
- “Arma tu box”.
- Product categories and filtering.
- Quantity management.
- Cart or quote summary.
- Customer and event information.
- Quote validation and submission.
- Customer confirmation.
- Commercial team notification.

## 3. Catering modes

### 3.1. Free selection

The customer selects products without using a predefined box structure.

Basic flow:

1. Open the free-selection experience.
2. Browse products by category.
3. Add products to the quote cart.
4. Adjust quantities.
5. Review the quote summary.
6. Enter customer and event information.
7. Submit the quote request.

### 3.2. “Arma tu box”

The customer selects a predefined box type and completes its required product slots.

Basic flow:

1. Select “Arma tu box”.
2. Select a box type.
3. Select the number of boxes.
4. Choose products according to the selected box rules.
5. Complete all required slots.
6. Confirm the box configuration.
7. Add the completed configuration to the quote cart.
8. Continue to customer and event information.
9. Submit the quote request.

## 4. Box definitions

Initial box rules:

### Desayuno

Required per box:

- 2 bakery items.
- 1 Jugo Socado.

### Lunch

Required per box:

- 1 wrap or 1 sandwich.
- 1 Jugo Socado.

### Coffee Break

Required per box:

- 1 bakery item or 1 snack.
- 1 dessert.

The implementation must use catalog category or subcategory relationships rather than hard-coded product names whenever possible.

## 5. Selection constraints

The available product slots depend on the selected box type.

Rules:

- The customer may only select products eligible for each slot.
- The number of selections must match the selected box requirements.
- The selected number of boxes determines the total required quantity for each slot.
- The UI must clearly show completed and incomplete requirements.
- Invalid or incomplete boxes must not be submitted.
- The server must validate the configuration again before quote registration.
- Client-side validation improves usability but is not authoritative.
- Product availability and current catalog eligibility must be validated on the server.

Example:

For 3 Desayuno boxes, the required total is:

- 6 bakery items.
- 3 Jugo Socado.

The exact distribution rules for choosing repeated or mixed products must be explicitly defined by the implementation and validated consistently on client and server.

## 6. Visual relationship between modes

Free selection and “Arma tu box” should feel like parts of the same catering product.

They should share:

- Brand language.
- Catalog visual system.
- Product card patterns.
- Interaction quality.
- Cart behavior.
- Confirmation and error patterns.

Separate components may be used when necessary to preserve code clarity and avoid compromising stable free-selection logic.

Do not force both modes into one monolithic component if their rules differ significantly.

## 7. Cart behavior

The cart should:

- Show selected free-selection products.
- Show configured boxes as understandable grouped items.
- Show quantity.
- Allow supported quantity adjustments.
- Allow removal.
- Identify incomplete configurations before checkout.
- Present a clear provisional summary.
- Preserve the distinction between free products and configured boxes.
- Avoid implying that payment will occur.

The server remains authoritative for prices, discounts, taxes, eligibility, and quote totals.

## 8. Cart preview

The intended interpretation is that a compact cart preview should display the last three items added by the customer, not the last three products created in the CMS.

For configured boxes, one completed box configuration may be represented as one cart item, even if it contains multiple products.

If the current implementation or product owner requires a different interpretation, update this section before changing the behavior.

## 9. Quote form

The form should collect the data required for commercial follow-up.

Expected information may include:

- Customer name.
- Email.
- Phone.
- Company, when applicable.
- Event date.
- Event time.
- Event location.
- Number of attendees.
- Event type.
- Additional notes.
- Selected catering summary.

Required fields must be clearly identified.

Do not collect information that is not necessary for the quote or operational follow-up.

## 10. Quote submission

On submission:

1. Validate input format.
2. Validate required customer and event fields.
3. Retrieve current product and commercial data.
4. Validate product availability.
5. Validate box configuration.
6. Recalculate authoritative prices.
7. Apply valid discounts, promotions, and taxes.
8. Register the quote.
9. Send customer confirmation.
10. Notify the commercial team.
11. Return a clear success or failure state.

The absence of online payment must remain clear.

## 11. Error states

The experience should handle:

- Product no longer available.
- Product no longer eligible for a selected box slot.
- Incomplete box.
- Invalid quantity.
- Price change.
- Discount no longer valid.
- Missing customer or event information.
- Network failure.
- Quote registration failure.
- Email or notification provider failure.

Error messages should be clear, warm, and actionable.

Do not expose internal stack traces, database information, or provider details.

## 12. Loading and success states

Loading states should:

- Prevent duplicate submission.
- Preserve the selected information.
- Communicate progress without unnecessary animation.
- Remain accessible.

Success should:

- Confirm that the request was received.
- Explain that it is a quote request, not a paid order.
- Set expectations for commercial follow-up.
- Avoid displaying sensitive internal information.

## 13. Responsive behavior

The feature must work on mobile and desktop.

Mobile priorities:

- Clear mode selection.
- Large touch targets.
- Understandable slot progress.
- Easy quantity controls.
- Accessible cart access.
- Manageable form sections.
- No reliance on hover.

Desktop priorities:

- Efficient catalog browsing.
- Clear relationship between catalog and cart.
- Consistent hierarchy.
- No unnecessary empty or fixed space.

Do not change approved layout during motion-only tasks.

## 14. Accessibility

Preserve:

- Semantic controls.
- Keyboard navigation.
- Visible focus states.
- Clear labels and instructions.
- Programmatic error association.
- Screen-reader-readable selection progress.
- Sufficient contrast.
- Appropriate touch targets.
- Reduced-motion behavior.
- Focus management for drawers and modals.

Product selection must not depend on color alone.

## 15. Architecture requirements

Follow:

```text
Presentation → Transport → Service → Data → Database
```

Business rules for box eligibility, quantities, discounts, taxes, and quote creation belong in services.

Persistence belongs in the data layer.

Components and Zustand stores must not become authoritative for commercial validation.

## 16. Acceptance criteria

### Free selection

- Customers can browse eligible products.
- Customers can add and remove products.
- Quantity changes update the provisional summary.
- Server validation occurs at submission.
- The quote can be submitted without payment.

### “Arma tu box”

- Customers can select a box type.
- Customers can select a box quantity.
- Only eligible products are available for each required slot.
- Progress is understandable.
- Incomplete configurations cannot be submitted.
- Completed configurations can be added to the cart.
- The server validates the completed box.

### Cart and checkout

- Free products and boxes are understandable.
- The compact preview can show the last three customer-added items.
- Customer and event fields are validated.
- Duplicate submission is prevented.
- Success and error states are clear.
- Commercial values are recalculated on the server.
- Customer and commercial notifications are triggered according to the service workflow.

## 17. Open product decisions

Document unresolved decisions here before implementation.

Potential decisions:

- Minimum order value.
- Minimum or maximum number of boxes.
- Whether customers may mix different eligible products inside one multi-box configuration.
- Whether every box in the same line must have the same composition.
- Delivery or pickup rules.
- Geographic service limits.
- Lead time requirements.
- Tax display rules.
- Discount stacking rules.
- Quote expiration.
- Commercial response-time expectation.

Do not invent unresolved business rules in code. Escalate or document them before implementation.

## 18. Documentation maintenance

Update this document when a permanent catering rule, box definition, validation rule, field requirement, or acceptance criterion changes.

Do not duplicate full architecture or brand rules here; reference their source documents.