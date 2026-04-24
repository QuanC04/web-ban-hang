---
name: Bookora
description: Warm, curated multi-shop bookstore with a practical seller center.
colors:
  ink-900: "#0f172a"
  ink-700: "#334155"
  ink-600: "#475569"
  ink-500: "#64748b"
  line-300: "#cbd5e1"
  line-200: "#e2e8f0"
  mist-100: "#f1f5f9"
  paper: "#ffffff"
  paper-warm: "#fff7ed"
  amber-300: "#fcd34d"
  amber-200: "#fde68a"
  amber-700: "#b45309"
  orange-300: "#fdba74"
  sky-300: "#7dd3fc"
typography:
  display:
    fontFamily: "system-ui, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(3rem, 7vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 1.04
  headline:
    fontFamily: "system-ui, Segoe UI, Roboto, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.15
  title:
    fontFamily: "system-ui, Segoe UI, Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1.3
  body:
    fontFamily: "system-ui, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "system-ui, Segoe UI, Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.2em"
rounded:
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.paper}"
    rounded: "9999px"
    padding: "0.75rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.ink-700}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-700}"
    rounded: "9999px"
    padding: "0.75rem 1.5rem"
  chip-accent:
    backgroundColor: "{colors.amber-200}"
    textColor: "{colors.amber-700}"
    rounded: "9999px"
    padding: "0.5rem 0.875rem"
  card-default:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-700}"
    rounded: "{rounded.xl}"
    padding: "1rem"
  input-default:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-700}"
    rounded: "{rounded.sm}"
    padding: "0.625rem 0.75rem"
---

# Design System: Bookora

## 1. Overview

**Creative North Star: "The Contemporary Book Hall"**

Bookora should feel like a well-lit contemporary bookstore translated into product UI. The buyer-facing surfaces carry warmth, breathing room, and a sense of curation. The seller-facing surfaces keep the same color family and rounded geometry, but use it with more operational restraint. This is a commerce product first, not a nostalgic art project and not a generic SaaS dashboard.

The system balances editorial warmth with practical clarity. Large headlines, warm paper backgrounds, amber accents, and rounded containers help the storefront feel inviting. Slate neutrals, strong labels, and compact controls keep the interface usable for search, filtering, cart actions, and seller workflows.

This system explicitly rejects purple-gradient SaaS styling, neon-dark ecommerce, heavy glassmorphism, and endless nested cards. It should read as curated and dependable, not trend-chasing.

**Key Characteristics:**
- Warm light surfaces with dark slate anchors.
- Rounded shapes used consistently, especially pills and soft panels.
- Bold typography for entry points, quieter typography for supporting detail.
- Clear action hierarchy with restrained accent use.
- Slightly more atmospheric storefront, slightly more functional seller tools.

## 2. Colors

The palette is restrained: mostly slate neutrals and white-paper surfaces, with amber carrying warmth and emphasis.

### Primary
- **Reading Ink** (`#0f172a`): The main anchor for primary buttons, strong text, badges, and navigation emphasis. It should carry authority without feeling harsh.
- **Shelved Slate** (`#334155`): The softened companion to the primary ink, used for hover states and secondary emphasis.

### Secondary
- **Bookmark Amber** (`#fcd34d`): Used for warm highlights, promotional chips, and focal accents that should feel inviting rather than urgent.
- **Soft Gold Paper** (`#fde68a`): A lighter accent fill for chips, small callouts, and warm emphasis blocks.

### Tertiary
- **Sky Note** (`#7dd3fc`): A small atmospheric support color, mostly decorative or used in gentle illustrations and ambient blurs.
- **Apricot Glow** (`#fdba74`): Secondary warmth for soft background glows and occasional visual framing.

### Neutral
- **Paper White** (`#ffffff`): Main card and control background.
- **Warm Paper** (`#fff7ed`): Used in broad page backgrounds and sections where the storefront should feel less clinical.
- **Mist Line** (`#e2e8f0`): Quiet borders that define surfaces without hard separation.
- **Soft Line** (`#cbd5e1`): Slightly stronger borders for inputs and actionable containers.
- **Body Slate** (`#475569`): Default body text and supporting UI copy.
- **Quiet Slate** (`#64748b`): Captions, metadata, and secondary labels.

### Named Rules
**The Accent Rarity Rule.** Amber should guide attention, not flood the page. Keep it for chips, key CTAs, and warm highlights. Most surfaces should remain neutral.

## 3. Typography

**Display Font:** `system-ui, Segoe UI, Roboto, sans-serif`
**Body Font:** `system-ui, Segoe UI, Roboto, sans-serif`
**Label/Mono Font:** `system-ui, Segoe UI, Roboto, sans-serif` and `ui-monospace, Consolas, monospace` where code-like data is needed.

**Character:** The type system is straightforward and modern, relying on weight, spacing, and line-height rather than ornamental font choices. It should feel confident and readable in Vietnamese, with bold headlines for merchandising and crisp labels for seller operations.

### Hierarchy
- **Display** (900, `clamp(3rem, 7vw, 4.5rem)`, 1.04): Reserved for homepage hero statements and major landing moments.
- **Headline** (800, `2rem`, 1.15): Section headers, primary page titles, and major dashboard headings.
- **Title** (800, `1.125rem`, 1.3): Product names, card titles, and sub-section heads.
- **Body** (400, `1rem`, 1.6): Default reading copy. Aim for 65-75ch max line length for longer paragraphs.
- **Label** (700, `0.75rem`, 1.2, `0.2em` tracking): Eyebrows, chips, and compact UI labels that need quick scanning.

### Named Rules
**The Two-Speed Rule.** Merchandising text can be bold and spacious. Operational text should tighten up and prioritize scan speed.

## 4. Elevation

Bookora uses light physical elevation, not dramatic layering. Most surfaces are flat white cards with soft borders and a restrained shadow. Depth is there to separate browsing modules and action areas, not to create spectacle. Seller pages should feel even flatter than the storefront, using borders and spacing first.

### Shadow Vocabulary
- **Floating Shelf** (`0 18px 40px -28px rgba(15,23,42,0.45)`): Used on major header shells and hero framing.
- **Lifted Card** (`0 24px 40px -28px rgba(15,23,42,0.6)`): Used on hover for product cards and selected interactive modules.
- **Ambient Panel** (`0 25px 60px -40px rgba(15,23,42,0.45)`): Used on large section containers that need gentle separation.

### Named Rules
**The Flat-at-Rest Rule.** Surfaces should earn heavier elevation through context or interaction. Do not make every card look lifted by default.

## 5. Components

### Buttons
- **Shape:** Pill-first, with fully rounded primary actions (`9999px`) and softer rounded rectangles for utility controls.
- **Primary:** Deep slate fill with white text, medium-to-bold weight, and generous horizontal padding.
- **Hover / Focus:** Hover darkens or lightens within the same slate family. Focus should rely on clear outline contrast rather than glow-heavy effects.
- **Secondary / Ghost:** White or near-white background, slate text, visible border, and minimal visual drama.

### Chips
- **Style:** Rounded pills with compact horizontal padding and strong label weight.
- **State:** Warm amber variants signal offers, badges, and positive metadata. Neutral variants can support counts and small filters.

### Cards / Containers
- **Corner Style:** Large radii are standard, usually `1.5rem` to `2rem` on major cards.
- **Background:** Predominantly white cards over warm or neutral page grounds.
- **Shadow Strategy:** Soft ambient shadow for major groups, stronger lift only on hover or emphasis.
- **Border:** Quiet slate border, often semi-transparent in spirit even when expressed as a flat token.
- **Internal Padding:** Usually `1rem` to `1.5rem`, increased on hero and section containers.

### Inputs / Fields
- **Style:** White background, soft border, rounded corners around `0.75rem`, readable placeholder text.
- **Focus:** Border darkens toward slate rather than switching to a bright accent.
- **Error / Disabled:** Errors should use clear text and border contrast. Disabled states should reduce contrast without making content unreadable.

### Navigation
- **Style:** Navigation items are compact, rounded, and text-led.
- **Default / Hover / Active:** Default is quiet slate, hover gains a subtle neutral fill, active goes to deep slate with white text.
- **Mobile Treatment:** Keep actions large enough for touch and avoid burying cart, profile, or auth entry points.

### Signature Component
- **Marketplace Product Card:** A soft rectangular cover area, a shop badge overlaid near the top, bold product title, category and rating beneath, then a clear price chip and two compact actions. It should feel merchandised, not crowded.

## 6. Do's and Don'ts

### Do:
- **Do** keep storefront backgrounds warm and airy, using `#fff7ed`, `#ffffff`, and slate text as the main environment.
- **Do** use `#0f172a` for the clearest primary actions and active navigation states.
- **Do** keep amber focused on offers, badges, and selective moments of warmth.
- **Do** use large radii and soft borders to create friendliness without resorting to novelty textures.
- **Do** make seller surfaces denser and more operational than storefront surfaces while keeping the same underlying palette.

### Don't:
- **Don't** introduce purple gradients, neon accents, or a dark cyberpunk palette.
- **Don't** stack cards inside cards inside cards just to manufacture structure.
- **Don't** rely on glassmorphism, gradient text, or decorative blur as the default visual language.
- **Don't** turn every book-related screen into faux paper, parchment, or vintage-library decoration.
- **Don't** use color alone to communicate status, ratings, validation, or urgency.
