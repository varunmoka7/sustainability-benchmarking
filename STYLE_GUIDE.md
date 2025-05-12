# Style Guide: Corporate Emissions Dashboard (Next.js Version)

This document outlines the target styling for the Next.js version of the Corporate Emissions Dashboard, contrasting it with the evolving state of the previous Streamlit application.

## I. Color Palette

The new color palette is defined in `color_palette.json` and integrated into `tailwind.config.ts`.

*   **Primary Background:** Deep Slate (`#2C3E50`)
*   **Primary Text:** White (`#FFFFFF`) on dark backgrounds.
*   **Secondary Text:** Light Bluish Gray (`#B0BEC5`) for less emphasis on dark backgrounds.
*   **Banner Sections:** Pastel Blue (`#87cde7`) with White (`#FFFFFF`) text. (Note: Ensure text is bold or large enough for WCAG AA on this combo).
*   **Interactive Elements (Buttons, Active Links, Dropdowns):** Saturated Teal (`#00a4bd`) with White text. Hover state is a darker Teal (`#007a8c`).
*   **Chart Series Accents:**
    *   Scope 1: Cool Blue (`#5DADE2`)
    *   Scope 2: Warm Orange (`#F39C12`)
    *   Scope 3: Vibrant Purple (`#AF7AC5`)
*   **Tables (on light sections, or if a light mode is introduced):**
    *   Header Background: Very Light Gray (`#f8f9fa`)
    *   Text: Dark Gray/Black (`#212529`)
    *   Row Stripes: White (`#FFFFFF`) and Subtle Light Gray (`#f1f3f5`)
*   **WCAG AA Compliance:** Key text/background color combinations aim for a 4.5:1 contrast ratio.

## II. Typography

*   **Font Family:** Consistent sans-serif stack (Tailwind's default, which includes system fonts; Inter is set up as an example via `next/font` in `src/app/(main-layout)/layout.tsx`).
*   **Hierarchy & Sizes (Target):**
    *   **Main Dashboard Title (H1):** 36px, Bold (`font-bold`)
    *   **Page/Section Headers (H2 in components):** 28px, Bold (`font-bold`)
    *   **Sub-Section Headers (H3 in components):** 22px, Semi-Bold (`font-semibold`)
    *   **Body Text / Paragraphs:** 16px, Regular (`font-normal`)
    *   **Labels / Small Text / Captions:** 14px, Regular (`font-normal`)
    *   **Button Text:** 16px, Semi-Bold (`font-semibold`)
    *   **Table Headers:** 17px, Semi-Bold (`font-semibold`)
    *   **Table Body Text:** 16px, Regular (`font-normal`)
*   **Line Height:** Standardized for readability (e.g., Tailwind's `leading-relaxed` or `1.6`).

## III. Spacing & Layout

*   **Layout:** Wide layout (`max-width: 90%` for main content block) with `2rem` to `3rem` side padding.
*   **Spacing Unit:** Utilize Tailwind's spacing scale (based on 0.25rem increments) for consistent margins (`m-`, `mx-`, `my-`, `mt-`, etc.) and padding (`p-`, `px-`, `py-`, `pt-`, etc.).
    *   Example: `mb-4` (1rem margin-bottom), `p-6` (1.5rem padding).
*   **Vertical Rhythm:** Consistent vertical spacing between sections, headings, paragraphs, and components.
*   **White Space:** Ample use of white space (or "dark space" on the slate background) to prevent clutter and improve focus.

## IV. Component Styling

*   **Navigation (NavBar & DataExplorerSubNav):**
    *   **NavBar:** White background (`bg-white`), shadow (`shadow-md`), sticky. Active links in `action-teal` with an underline/border.
    *   **SubNav:** Light gray background (`bg-gray-100`), shadow (`shadow-sm`), sticky below main nav. Active links similar to NavBar.
*   **Buttons (Primary Action, e.g., Download, Add to Compare):**
    *   Background: Saturated Teal (`bg-action-teal`).
    *   Text: White.
    *   Hover: Darker Teal (`hover:bg-action-teal-hover`).
    *   Padding: `px-4 py-2.5` (example). Rounded corners (`rounded-md`). Shadow (`shadow-sm`).
*   **Buttons (Secondary/Reset):**
    *   Background: Light Gray (`bg-gray-200 dark:bg-neutral-light`).
    *   Text: Dark Gray (`text-gray-700 dark:text-primary-text-on-slate`).
    *   Hover: Slightly darker gray (`hover:bg-gray-300 dark:hover:bg-gray-600`).
*   **Dropdowns (Country Selector):**
    *   Styled using Headless UI and Tailwind. Button matches general interactive element style. Options list has clear hover and selected states. Search input integrated.
*   **KPI Cards:**
    *   Background: Darker Neutral (`bg-neutral-dark` / `#34495E`).
    *   Rounded corners (`rounded-lg`), padding (`p-6` or `p-1.5rem`), drop shadow (`shadow-lg`), subtle border (`border border-neutral-light`).
    *   Label: Secondary text color (`text-secondary-text-on-slate`), smaller font (e.g., 18px).
    *   Value: Primary text color (`text-primary-text-on-slate`), large and bold font (e.g., 38px).
*   **Charts (ChartView - Recharts):**
    *   Transparent plot and paper backgrounds to blend with page.
    *   Grid lines: Light gray (`#e0e0e0` or `chart-grid`).
    *   Axis/Tick Text: Secondary text color (`text-secondary-text-on-slate` / `#B0BEC5`).
    *   Series Colors: Defined scope colors.
    *   Interactive tooltips with custom styling.
*   **Tables (EmissionsTable):**
    *   Responsive (`overflow-x-auto`).
    *   Header: Light gray background (`bg-table-header-bg` / `#f8f9fa`) with dark text for light mode context, or `bg-deep-slate` with `text-secondary-text-on-slate` for dark mode. Uppercase, letter-spaced.
    *   Rows: Alternating stripes for readability if on a light background section (e.g. `bg-white` and `bg-table-row-odd-bg`). On dark theme, subtle dividers are more common.
    *   Text: Clear, legible.
*   **Cookie Banner:** Fixed at bottom, dark background (`bg-cookie-banner-bg`), clear text, prominent "Got it" button.

## V. Responsiveness

*   **Mobile-First Approach (Conceptual):** Styles should adapt gracefully from mobile to desktop.
*   **Tailwind Prefixes:** Use `sm:`, `md:`, `lg:`, `xl:` prefixes for responsive adjustments to layout, typography, and visibility.
*   **Navigation:** Hamburger menu for mobile.
*   **Charts/Tables:** Horizontal scrolling on small screens if content is too wide.

## VI. Accessibility (WCAG AA Focus)

*   **Contrast:** Color choices prioritize meeting 4.5:1 for text.
*   **ARIA Labels:** All interactive elements (buttons, inputs, links without clear text) to have `aria-label` attributes.
*   **Keyboard Navigation:** Ensure all interactive elements are focusable and operable via keyboard.
*   **Semantic HTML:** Use appropriate HTML5 tags (`<nav>`, `<main>`, `<section>`, `<header>`, `<footer>`, etc.).

This style guide provides the target for the Next.js application, moving away from the Streamlit app's previous styling.
