---
name: Obsidian & Gilt
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#d0cecd'
  on-tertiary: '#313030'
  tertiary-container: '#b5b2b2'
  on-tertiary-container: '#454545'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  h1:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Noto Serif
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  button:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

The brand personality is rooted in the tradition of the master barber, reimagined for the modern gentleman. It evokes feelings of exclusivity, precision, and confidence. The target audience values craft, time, and a high-end grooming experience that feels like a retreat rather than a chore.

The design system employs a **Minimalist** style with a focus on high-contrast visuals and intentional whitespace. It utilizes a "Dark Mode by Default" philosophy to maintain a cinematic, premium atmosphere. Motion is subtle and deliberate, favoring ease-in-out transitions that mimic the smooth glide of a straight razor. Imagery should be high-contrast, black-and-white or desaturated, featuring close-ups of textures (steel, leather, hair) and atmospheric shop interiors.

## Colors

The palette is anchored in deep, matte blacks and charcoals to create a sense of depth and luxury. Gold (#D4AF37) is used sparingly as a high-impact accent color for primary actions, active states, and brand marks. 

- **Primary (Gold):** Represents excellence and the "gold standard" of service. Use for call-to-action buttons and critical highlights.
- **Secondary (Matte Black):** The foundation of the UI, providing a sophisticated backdrop that lets photography pop.
- **Neutral (Crisp White):** Reserved for primary body text and headlines to ensure maximum legibility against the dark backgrounds.
- **Surface (Charcoal):** Used for cards and input fields to differentiate layers of information from the base background.

## Typography

This design system utilizes a sophisticated typographic pairing to balance tradition and modernity. 

**Noto Serif** (replacing Playfair Display) is the headline face. It should be used for large, impactful statements and section titles. Its classic proportions suggest heritage and authority.

**Manrope** (replacing Montserrat) serves as the functional workhorse. It provides a clean, modern contrast to the serif headings. Its geometric clarity ensures readability in booking flows and service descriptions.

Key styling rule: All small labels and overlines should be set in Manrope Bold with wide letter spacing and uppercase transformation to evoke a sense of premium "labeling" or branding.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model on desktop to maintain a controlled, editorial feel, while transitioning to a fluid model on mobile devices. 

A 12-column grid is used for the desktop experience with generous gutters of 24px. The design system prioritizes vertical rhythm and large "breathing rooms" between sections (Section Gaps) to prevent the dark UI from feeling cramped. Elements should often be center-aligned or use asymmetrical layouts to mimic a high-end fashion magazine or a luxury boutique's digital presence.

## Elevation & Depth

To maintain the "Matte" aesthetic, the design system avoids heavy drop shadows. Depth is instead achieved through **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** Deepest black (#0A0A0A).
- **Level 1 (Cards/Containers):** Soft Charcoal (#1A1A1A).
- **Level 2 (Active States/Modals):** Subtle 1px borders using a slightly lighter charcoal (#2D2D2D) or a thin Gold stroke for focus.

For high-end interactions, use a very faint ambient glow in the gold accent color behind primary buttons, rather than a traditional black shadow. This creates a "backlit" effect common in luxury environments.

## Shapes

The design system utilizes **Sharp (0px)** roundedness. 

Hard corners are essential to the masculine and architectural aesthetic. This sharpness conveys precision, reminiscent of hair clippers and straight blades. All buttons, input fields, cards, and images must feature 90-degree angles. Any deviation (such as circles for profile avatars) should be used only when technically necessary or for specific brand icons.

## Components

### Buttons
- **Primary:** Solid Gold background with black text. Sharp corners. Hover state: slight desaturation or white border.
- **Secondary:** Transparent background with a 1px Gold or White border. White text.

### Input Fields
- Matte black background with a 1px charcoal border. On focus, the bottom border turns Gold. Labels are always uppercase and positioned above the field.

### Cards
- Used for service listings or barber profiles. Solid charcoal background. No shadows. Imagery should be full-bleed at the top of the card.

### Chips/Tags
- Small, rectangular boxes with thin borders. Used for indicating availability times or service categories (e.g., "HAIRCUT", "BEARD TRIM").

### Special Components
- **Booking Timeline:** A vertical, minimalist line representing the day's schedule, using Gold dots for available slots.
- **Service Menu:** An editorial-style list where the price and service name are connected by a subtle dotted leader line, emphasizing the premium nature of the shop.
- **Image Masonry:** A grid for the portfolio section that uses varying rectangular sizes but maintains the 0px corner radius throughout.