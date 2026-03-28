# Azure Concierge Design System

## 1. Overview & Creative North Star
**Creative North Star: The Seamless Facilitator**

Azure Concierge is a design system built for high-trust AI interactions. It moves away from the "robotic" and "stiff" interfaces of the past toward a "High-End Editorial" experience. It mimics the clarity of a premium broadsheet while maintaining the fluid dynamics of a modern digital workspace. The system breaks traditional grid rigidity through intentional asymmetry—such as message bubbles with singular sharp corners—and high-contrast typography that prioritizes readability over mere decoration.

## 2. Colors
The palette is rooted in a spectrum of deep blues (`#0284C7`) and organic greens (`#16A34A`), representing intelligence and growth.

*   **The "No-Line" Rule:** Sectioning is achieved through color-blocking rather than borders. Use `surface-container` variations to delineate content areas. 1px solid borders are strictly prohibited for internal layout; use them only for the outermost modal containers or "Ghost Border" interactive states.
*   **Surface Hierarchy:**
    *   `background`: #F8FAFC (The canvas)
    *   `surface_container_lowest`: #ffffff (Primary content cards)
    *   `surface_container`: #e7eeff (Secondary UI elements like filters)
*   **Signature Textures:** Main CTAs utilize a 135-degree linear gradient from `primary` to `primary_container` to create a sense of forward momentum and depth.

## 3. Typography
The system uses a dual-font strategy to balance character with utility.

*   **Display & Headlines:** **Manrope** (Bold/Extrabold). Used for high-level navigation and page titles to provide a modern, structural feel.
*   **Body & Labels:** **Inter**. Chosen for its exceptional legibility in dense chat logs and data tables.

**Typography Scale (Extracted Ground Truth):**
*   **Hero Headlines:** 1.875rem (30px) - Extrabold, tracking-tight.
*   **Sub-headers:** 1.25rem (20px) - Bold.
*   **Standard Body:** 0.9375rem (15px) - Used for chat messages to optimize word count per line.
*   **Labels/UI Text:** 0.875rem (14px) - Semi-bold.
*   **Micro-data:** 10px - Bold, Uppercase, Tracking-widest (used for timestamps).

## 4. Elevation & Depth
Depth is communicated through "Tonal Layering" and sophisticated shadowing rather than structural lines.

*   **The Layering Principle:** Higher-priority elements (like the chat transcript modal) sit on `surface_bright` (#ffffff) to pop against the `background` (#F8FAFC).
*   **Ambient Shadows:**
    *   `shadow-sm`: Used for message bubbles to provide a lift without appearing heavy.
    *   `shadow-md`: Used for primary action buttons.
    *   `shadow-2xl`: Reserved exclusively for modals to create a distinct separation from the background dashboard.
*   **Glassmorphism:** The system utilizes `backdrop-blur-sm` with a `black/50` overlay for modal backgrounds to maintain context of the dashboard while focusing the user's attention.

## 5. Components
*   **Message Bubbles:** Asymmetric rounding (2xl on three corners, sm on the fourth) to indicate directionality.
*   **Buttons:** Primary buttons use the signature blue gradient. Secondary buttons use a "Ghost" style: a 1px border of `neutral_color_hex` (#1E293B) with high-contrast text.
*   **Status Badges:** Use a "Pill" shape with a high-saturation background and matching icon (e.g., Teal-50 background with #14B8A6 icon and text for success states).
*   **Input Fields:** Minimalist styling with a focus on the `outline-variant` for focus states.

## 6. Do's and Don'ts
### Do:
*   Use uppercase tracking-widest for metadata (timestamps, IDs).
*   Apply `backdrop-blur` to any element that floats above the main content.
*   Use asymmetric rounding for chat-related components.

### Don't:
*   Use 1px borders to separate dashboard sections; use tonal shifts.
*   Mix the Headline font (Manrope) into body paragraphs.
*   Use pure black for text; always use `on-surface` (#111c2d) to maintain the editorial softness.