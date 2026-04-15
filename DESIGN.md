# Design Brief: Kami Shopsy

## Purpose & Context
Premium luxury e-commerce storefront for Pakistani market. Admin-curated product catalog (12 categories, 20+ items each). Dark-mode first, welcoming but refined.

## Aesthetic
Luxury refined minimalism. Deep navy anchor, warm gold accents, crisp whites. No decoration — only intentional surfaces.

## Color Palette

| Semantic        | Light                  | Dark                   | Usage                      |
|-----------------|------------------------|------------------------|----------------------------|
| **Background**  | `0.98 0 0` (off-white) | `0.12 0 0` (deep navy) | Page background            |
| **Foreground**  | `0.15 0 0` (charcoal)  | `0.95 0 0` (white)     | Body text                  |
| **Card**        | `0.96 0 0` (cream)     | `0.16 0 0` (card navy) | Category/product tiles     |
| **Primary**     | `0.68 0.18 48` (gold)  | `0.75 0.22 48` (gold)  | Active, interactive        |
| **Secondary**   | `0.92 0 0` (light)     | `0.2 0 0` (dark grey)  | Muted secondary text       |
| **Accent**      | `0.68 0.18 48` (gold)  | `0.75 0.22 48` (gold)  | Highlights, hover states   |
| **Destructive** | `0.55 0.22 25` (red)   | `0.65 0.19 22` (red)   | Remove, cancel actions     |

## Typography

| Tier        | Font         | Usage                                      |
|-------------|--------------|-------------------------------------------|
| **Display** | Fraunces     | Headers, welcome message, category titles |
| **Body**    | General Sans | Product names, descriptions, form inputs  |
| **Mono**    | JetBrains    | Prices, codes, meta information            |

## Elevation & Depth
Subtle shadows only. `shadow-luxury` (4px) on cards at rest; `shadow-luxury-hover` (8px) on hover. No glows or neon. Clean layering via background tone shifts.

## Structural Zones

| Zone      | Treatment                                 | Intent                           |
|-----------|-------------------------------------------|----------------------------------|
| **Header**     | Dark card (navy) with gold accent bar below. Logo + welcome message. | Establish luxury, anchor brand    |
| **Category**   | Grid of cream/white cards (dark mode: navy cards). Gold on hover. | Visual hierarchy, browsable       |
| **Product**    | White card with image, name, price. Subtle border. Gold on select. | Product focus, transaction ready |
| **Checkout**   | Form in card, gold CTA buttons, navy background. | Clear transaction flow           |
| **Footer**     | Navy background, gold divider, muted text. | Grounding, info architecture     |

## Spacing & Rhythm
16px base unit. Cards use 24px internal padding. Grid gap 16px. Generous whitespace. Typography driven by Fraunces' distinctive letterforms — limit hierarchy to 3 sizes.

## Component Patterns
- **Buttons**: Solid gold background, white text, `rounded-2xl` (32px). Hover: slight shadow lift.
- **Cards**: `rounded-2xl`, subtle border `border-border/50`, never shadowed unless hovered.
- **Inputs**: `rounded-lg` (16px), white background (light) or card navy (dark), gold focus ring.
- **Links**: Gold text, no underline unless hovered. Bold weight.

## Motion
Smooth fade (0.3s ease) on interactive states. Gold accent pulses gently on active buttons. No bounce or elastic tweens. Category tiles slide-in on page load (optional, low complexity).

## Constraints
- No raw hex colors — always use CSS variables.
- Max 2 font families. Fraunces display-only, not body.
- Gold used sparingly: interactive states, accents, highlights — never backgrounds.
- Shadows never use opacity > 0.12 (never blurry/glow-like).
- Dark mode is primary; light mode is fallback.

## Signature Detail
Gold accent bar beneath header. Links category elegance with luxury retail (high-end boutique signage). Instantly recognizable, unprompted.

## Responsive
Mobile-first. Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px). Product grid: 1 col (mobile), 2 cols (sm), 3 cols (md+). Navigation stacks on mobile, horizontal on tablet+.
