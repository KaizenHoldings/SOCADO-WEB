# Socado Web — Architecture

This document is the source of truth for the technical architecture, project structure, dependency rules, and separation of responsibilities in Socado Web.

Installation, local development, code generation, testing, and operational commands belong in `docs/DEVELOPMENT.md`.

Product, brand, frontend, and feature-specific rules are documented separately:

* `docs/PRODUCT.md`
* `docs/BRAND.md`
* `docs/UI_UX.md`
* `docs/features/CATERING.md`

---

## 1. System overview

Socado Web is a digital platform for Socado Café focused on presenting the brand experience and capturing qualified leads through a catering quote workflow.

The application includes:

* A public website.
* A catering product catalog.
* A free-selection catering experience.
* An “Arma tu box” experience.
* A quote cart.
* A customer and event information form.
* Quote request creation.
* Transactional emails for the customer and commercial team.
* Commercial notifications.
* A private administrative panel.
* Product, category, price, discount, promotion, and tax management.

The commercial flow does not include a payment gateway.

The customer journey ends with the registration and delivery of a quote request.

---

## 2. Technology stack

| Area                       | Technology                             |
| -------------------------- | -------------------------------------- |
| Framework                  | Next.js 16 with App Router             |
| UI library                 | React 19                               |
| Language                   | TypeScript                             |
| CMS and embedded backend   | Payload CMS 3.85                       |
| Database                   | PostgreSQL                             |
| Database adapter           | `@payloadcms/db-postgres`              |
| Media storage              | Vercel Blob                            |
| Media adapter              | `@payloadcms/storage-vercel-blob`      |
| Styling                    | Tailwind CSS v4                        |
| Design token configuration | `@theme` in `styles.css`               |
| Client state               | Zustand                                |
| Animation                  | Motion                                 |
| Icons                      | Lucide React                           |
| Modals and alerts          | SweetAlert2                            |
| Rich text                  | Lexical                                |
| Fonts                      | Raleway and Outfit through `next/font` |
| Integration testing        | Vitest                                 |
| End-to-end testing         | Playwright                             |
| Package manager            | pnpm                                   |

Do not introduce an equivalent or duplicate technology without a clear technical justification.

Before adding a dependency, verify whether the requirement is already covered by the existing stack.

---

## 3. Primary architecture principle

Layered architecture is mandatory and non-negotiable.

The general dependency direction is:

```text
Presentation → Transport → Service → Data → Database
```

For operations initiated through an API route or server-side interface:

```text
Transport → Service → Data
```

Dependencies must flow in one direction.

A lower-level layer must never depend on a higher-level layer.

---

## 4. Layer responsibilities

### 4.1. Presentation layer

Primary locations:

```text
src/app/(frontend)/
src/components/catalog/
```

Responsibilities:

* Render the user interface.
* Receive user interactions.
* Manage strictly visual state.
* Display loading, success, error, and empty states.
* Compose reusable React components.
* Apply brand, responsive, and accessibility rules.
* Communicate with approved transport or server interfaces.
* Present data received through props, stores, hooks, or transport functions.

The presentation layer must not:

* Query PostgreSQL directly.
* Access the persistence layer directly.
* Implement business rules.
* Calculate authoritative quotes, discounts, or taxes.
* Orchestrate transactional emails.
* Contain secrets.
* Depend on internal Payload implementation details without necessity.
* Treat client-side values as authoritative commercial data.

Components must receive explicit and predictable data structures.

---

### 4.2. Transport layer

Primary location:

```text
src/app/api/
```

The transport layer may also include:

* Route handlers.
* Server Actions used as transport adapters.
* Webhooks.
* Server-side controllers.
* Other external entry points.

Responsibilities:

1. Receive the request.
2. Extract input data.
3. Validate the input format.
4. Resolve authentication or authorization when required.
5. Delegate the operation to a service.
6. Convert the service result into an HTTP or equivalent response.
7. Translate known domain errors into appropriate response codes.

The transport layer must remain thin.

It must not:

* Implement business rules.
* Query the database directly.
* Calculate quotes.
* Apply discount or tax rules.
* Orchestrate complex workflows.
* Build complete transactional emails.
* Contain domain decisions.

Correct flow:

```text
API route
  → parse and validate input
  → call service
  → return response
```

Incorrect flow:

```text
API route
  → query database
  → calculate discounts
  → save quote
  → construct email
  → send notifications
```

---

### 4.3. Service layer

Primary location:

```text
src/lib/services/
```

The service layer contains the platform’s business logic.

Responsibilities:

* Calculate estimates and quotes.
* Validate catalog rules.
* Validate catering selection rules.
* Validate “Arma tu box” configurations.
* Apply discount and tax rules.
* Coordinate quote registration.
* Orchestrate notifications and transactional emails.
* Coordinate operations involving multiple repositories.
* Expose reusable business operations to different transports.

Services must:

* Receive explicit input structures.
* Return clear and typed results.
* Remain independent from the visual framework.
* Remain independent from the transport mechanism.
* Be testable in isolation.
* Use the data layer for persistence.
* Work with domain models, DTOs, or pure structures.

Services must not depend directly on:

* React components.
* JSX.
* React hooks.
* Visual contexts.
* Navigation APIs.
* Native `Request` or `Response` objects.
* Next.js cookies, headers, or request context unless an exception is explicitly documented.

When a business operation needs authentication, cookie, or header information, the transport layer must extract it and pass a pure data structure to the service.

---

### 4.4. Data layer

Primary location:

```text
src/lib/data/
```

Responsibilities:

* Encapsulate Payload CMS and PostgreSQL access.
* Read and write persistent information.
* Manage transactions.
* Convert persistence records into clean models or DTOs.
* Isolate CMS and database implementation details.
* Expose clear interfaces to services.

The data layer is the only domain layer authorized to centralize persistence access.

It must not:

* Render interfaces.
* Return HTTP responses.
* Contain visual logic.
* Orchestrate emails.
* Apply complex business rules.
* Return presentation-specific objects when a clean domain model can be returned.

Direct database queries are prohibited from:

* Components.
* Visual hooks.
* Zustand stores.
* Route handlers.
* Presentation utilities.
* Style files.

---

## 5. Dependency rules

Allowed dependencies:

```text
Presentation → Transport
Transport → Service
Service → Data
Data → Payload/PostgreSQL
```

Shared dependencies may include:

```text
Shared types
Pure utilities
Validation schemas
Configuration
Domain errors
```

These shared dependencies must not introduce circular references.

Forbidden dependencies include:

```text
Data → Service
Service → API route
Service → React component
Data → React component
Component → Database
API route → Database
Zustand store → Database
```

Any exception must be minimal, justified, and documented.

---

## 6. Payload CMS

Payload CMS operates as the embedded CMS and administrative backend.

Its responsibilities include:

* Catalog administration.
* Product management.
* Category management.
* Media management.
* Price management.
* Discount, promotion, and tax management.
* Administrative user management.
* Persistence of relevant business entities.

Payload collections define persistence and administrative structures, but they do not replace the service layer.

A Payload collection, hook, or access function must not automatically become the location for all related business logic.

When a rule is relevant to multiple entry points, it belongs in the service layer.

---

## 7. Persistence

The official database is PostgreSQL.

Do not assume that the project uses MongoDB, even if outdated references from the original Payload template still exist.

Persistence must be isolated behind:

* Data access functions.
* Repositories.
* Adapters.
* Query builders.
* Controlled Payload interfaces.

Persistence functions should return consistent models or DTOs to minimize coupling with Payload or PostgreSQL.

Database records must not leak unnecessarily into the presentation layer.

---

## 8. Client-side state

Zustand is used for cart-related state.

Primary location:

```text
src/lib/store/
```

The store may manage:

* Selected products.
* Quantities.
* Configured boxes.
* Cart drawer state.
* Temporary information required to complete a quote.
* Non-authoritative client calculations used for display.

The store must not:

* Query the database directly.
* Send emails.
* Contain secrets.
* Replace server persistence.
* Become the authoritative source for prices.
* Become the authoritative source for discounts or taxes.
* Implement business validation that is only enforced in the browser.

All commercially relevant information must be validated again on the server before a quote is recorded.

---

## 9. Main project structure

```text
src/
├── app/
│   ├── (frontend)/
│   │   ├── page.tsx
│   │   ├── catering/
│   │   └── styles.css
│   │
│   ├── (payload)/
│   │   └── admin/
│   │
│   └── api/
│       ├── csv/
│       ├── discounts/
│       ├── quotes/
│       └── shop-taxes/
│
├── collections/
│   ├── Products
│   ├── Categories
│   ├── Quotes
│   ├── Taxes
│   ├── Stores
│   └── other Payload collections
│
├── components/
│   ├── catalog/
│   ├── admin/
│   └── payload/
│
├── lib/
│   ├── services/
│   ├── data/
│   ├── store/
│   ├── types/
│   └── utils/
│
├── migrations/
└── payload-types.ts
```

The structure may evolve, but the conceptual separation between presentation, transport, service, and data must remain intact.

---

## 10. Functional map

### Public website

Primary location:

```text
src/app/(frontend)/
```

Includes:

* Home page.
* Hero sections.
* Promotions.
* Socado story.
* Store presentation.
* Timeline experiences.
* Catering promotion.
* Catering catalog and quote flow.

### Administrative panel

Primary location:

```text
src/app/(payload)/admin/
```

Current purpose:

* Catalog management.
* Price updates.
* Category management.
* Media management.
* Commercial entity management.

The administrative panel is not a payment platform or a complete sales management system.

### API

Primary location:

```text
src/app/api/
```

Includes operations related to:

* Quotes.
* Discounts.
* Taxes.
* CSV import and export.
* Required integrations.

---

## 11. Main flows

### 11.1. Catalog retrieval

```text
Interface
  → transport or server interface
  → catalog service
  → data layer
  → Payload/PostgreSQL
```

### 11.2. Catalog update

```text
Administrative operation
  → authorized transport
  → catalog service
  → data layer
  → Payload/PostgreSQL
```

### 11.3. Quote registration

```text
Checkout form
  → quote transport
  → quote service
  → data layer
  → quote persistence
  → transactional notification orchestration
```

Prices, discounts, taxes, quantities, and selection rules must be validated on the server.

Never trust client-calculated commercial values without server validation.

### 11.4. Notifications

```text
Service
  → notification or email adapter
  → external transactional provider
```

Provider credentials must never be exposed to the browser.

---

## 12. Types and contracts

All new code must use TypeScript.

Layer boundaries should use explicit contracts whenever reasonable:

* Input DTOs.
* Output DTOs.
* Domain models.
* Service result types.
* Validation schemas.
* Domain error types.
* Repository interfaces.

Avoid:

* Untyped objects.
* Unnecessary use of `any`.
* Ambiguous return values.
* Implicit dependencies.
* Multiple incompatible definitions of the same domain concept.

Payload-generated types are generated files and must not be edited manually.

---

## 13. Error handling

Each layer should handle only the errors that belong to it.

### Data layer errors

Examples:

* Record not found.
* Persistence conflict.
* Invalid query.
* Database connection failure.
* Transaction failure.

### Service layer errors

The service layer should translate technical errors into domain errors where appropriate:

* Product unavailable.
* Invalid box configuration.
* Discount not applicable.
* Incomplete quote.
* Invalid quantity.
* Invalid catalog selection.
* Price mismatch.

### Transport layer errors

The transport layer should convert domain errors into appropriate responses:

* `400` for invalid input.
* `401` for missing authentication.
* `403` for insufficient authorization.
* `404` for missing resources.
* `409` for conflicts.
* `422` for valid input that violates a business rule when appropriate.
* `500` for unexpected failures.

Do not expose stack traces, secrets, database details, or internal provider information to the client.

---

## 14. Security

Minimum security requirements:

* Validate all external input.
* Authorize administrative operations.
* Never trust prices supplied by the client.
* Never expose secrets to the browser.
* Never log credentials or tokens.
* Keep `.env` outside version control.
* Sanitize editable content when necessary.
* Validate imported files before processing.
* Limit bulk operations when appropriate.
* Handle external provider failures safely.
* Avoid returning internal errors to public clients.
* Apply least-privilege access to administrative functionality.

---

## 15. Performance

Performance decisions must preserve architecture boundaries.

The project should:

* Avoid repeated queries.
* Avoid unnecessary requests.
* Avoid loading administrative data into the public application.
* Use client components only when necessary.
* Use Next.js server capabilities when they provide a clear benefit.
* Optimize images and media.
* Avoid duplicating the same state in multiple stores.
* Separate animation behavior from business logic.
* Avoid unnecessary animation libraries.
* Avoid sending excessive CMS data to the browser.

A performance optimization does not justify breaking the layered architecture.

---

## 16. Testing strategy

The architecture must support isolated testing.

### Service tests

Prioritize:

* Quote rules.
* Discount calculations.
* Tax calculations.
* Box validation.
* Catalog rules.
* Domain error handling.
* Notification orchestration.

### Data tests

Prioritize:

* Queries.
* Record transformation.
* Persistence.
* Empty results.
* Conflicts.
* Transaction behavior.
* Provider failures.

### Transport tests

Prioritize:

* Input validation.
* Response codes.
* Authorization.
* Delegation to services.
* Domain error translation.

### End-to-end tests

Prioritize:

* Navigation.
* Product selection.
* Box creation.
* Cart behavior.
* Checkout form.
* Quote registration.
* Success states.
* Error states.
* Mobile behavior.

---

## 17. Rules for new features

Before implementing a feature:

1. Identify its business rules.
2. Define the responsible service.
3. Define the required persistence interface.
4. Define the transport entry point.
5. Define the presentation requirements.
6. Add types and validation.
7. Add the relevant tests.
8. Verify that responsibilities remain separated.

For catering-related work, also read:

```text
docs/features/CATERING.md
```

---

## 18. Generated files

Do not manually edit:

```text
src/payload-types.ts
```

Do not manually edit Payload-generated import maps or other files explicitly marked as generated.

After modifying a Payload collection, run the code-generation commands documented in:

```text
docs/DEVELOPMENT.md
```

---

## 19. Prohibited patterns

Do not implement:

* Direct database queries from components.
* Direct database queries from route handlers.
* Business rules inside JSX.
* Services dependent on React.
* Services dependent on native request or response objects.
* Secrets in source code.
* Manual changes to generated types.
* Business validation only on the client.
* Duplicate business logic across client and server without an authoritative source.
* New libraries for problems already solved by the current stack.
* Monolithic components combining UI, persistence, and business logic.
* Circular dependencies between layers.
* Broad refactors unrelated to the requested task.

---

## 20. Exception criteria

An architectural exception may only be accepted when:

* A concrete technical limitation exists.
* The correct alternative introduces disproportionate complexity.
* The exception is explicitly documented.
* Its scope is minimal.
* It does not establish a pattern that should be repeated.
* A future correction strategy is included when appropriate.

“Faster to implement” is not sufficient justification by itself.

---

## 21. Maintainability objective

The architecture is designed to support:

* Independent frontend evolution.
* A future migration to a dedicated backend.
* Replacement of external providers.
* Isolated testing of business rules.
* Controlled changes to persistence.
* Reuse of services through different entry points.
* Reduced coupling with Next.js and Payload.
* Safe collaboration between human developers and coding agents.

Every technical decision should be evaluated against these objectives.
