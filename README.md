# OopsKart — The World's Worst E-Commerce Website

> **“Shopping made unnecessarily difficult!”**

OopsKart begins as a polished, credible online store — and then, as you click,
scroll, search and add things to your cart, it slowly descends into glorious,
**controlled chaos**. Every feature genuinely works. Every frustration is
intentional. Nothing is real.

It is a humorous UX experiment that proves a serious point: good design is
invisible, and bad design is exhausting.

---

## Problem statement

Modern e-commerce lives or dies on usability. Poor UX — unstable buttons,
opaque pricing, endless motion, hidden fees, inaccessible controls — quietly
destroys trust and conversion. OopsKart demonstrates these problems by
*becoming* them, in a way that is funny rather than harmful, and then explains
the lessons on a built-in dashboard.

## Objectives

- Build a **fully functional** store: catalogue, search, filters, cart,
  persistence, checkout simulation.
- Show **progressive chaos** driven by a 0–100 chaos score, without ever
  breaking usability or trapping the user.
- Champion **accessible, transparent, predictable** design as the real goal.
- Deliver a **hackathon-ready, memorable live demo** that runs locally with no
  API keys, no database and no real payments.

## Real-world relevance

- Demonstrates how **feature creep and gratuitous animation** harm readability.
- Shows why **transparent pricing** (here: absurd delivery fees, disclosed
  early) matters for trust.
- Reinforces **accessibility** as a baseline, not a feature: semantic HTML,
  keyboard support, visible focus and `prefers-reduced-motion`.
- Provides a teaching tool for UX/UI workshops and design critiques.

---

## Features

### Storefront
- Custom **OopsKart** logo, responsive navbar with live search and cart badge.
- Hero section, ridiculous discount marquee, and category filters.
- **16 fictional products** across **Home, Tech, Fashion, Food**, stored in a
  separate reusable data file.
- Product cards with emoji/CSS illustrations, ratings, stock status, MRP
  strikethrough and an accessible **product details modal**.

### Search, filters & sorting
- Live text search across name, tagline, description and category.
- Category filtering, price sorting (low→high / high→low), top-rated sort.
- Clear-filters action and a friendly empty state.

### Working cart
- Add / remove items, increase / decrease quantity (capped at 10).
- Live subtotal, delivery estimate and total.
- **localStorage persistence** for both cart and chaos state.
- Slide-over **cart drawer** plus a full **Cart page** with delivery selection.

### Chaos engine
- Reusable `useChaos` hook with a **0–100 score**, an **interaction counter**
  and five escalating chaos levels:
  - **L1** — clean and professional.
  - **L2** — cards lean slightly, colours misbehave.
  - **L3** — cards wobble, buttons pulse.
  - **L4** — floating emoji and absurd promotional shouts.
  - **L5** — maximum cosmetic chaos with a **Reset** button always available.
- Chaos Mode **ON/OFF** toggle; when off, visuals rest but the score is kept.
- All effects are CSS + React state. Nothing moves controls away from focus or
  blocks navigation.

### Promotions
- Clearly fictional offers such as “Buy One, Receive One Existential Crisis”,
  “90% Off* (*on absolutely nothing)” and “Premium delivery by a confused
  pigeon”.

### Checkout simulation
- **Demo login** (`/login`) with login/signup toggle, validation, show/hide
  password and a one-click demo account — required before checkout.
- Full form validation (name, email, 10-digit phone, address, city, 6-digit PIN).
- Transparent delivery breakdown, order summary, and fictional payment methods.
- Randomly generated demo order ID and a funny confirmation screen.
- **No card / CVV / UPI details are ever requested. No real money moves.**

### Hackathon UX dashboard
- Live **demo metrics**: total interactions, chaos score, cart count, products
  explored, current chaos level.
- “Usability problems demonstrated” list and a **Bad UX vs. Good UX** comparison.
- All metrics are clearly labelled as **demo metrics** generated locally — no
  real users were tested and no research findings are claimed.

---

## Technology stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Build tool | Vite 6 |
| Language | JavaScript (JSX) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | Lucide React |
| Routing | React Router v7 |
| Persistence | Browser `localStorage` |
| Backend | **None required** — runs entirely client-side |

No paid APIs, no external keys, no database.

---

## Project structure

```
oopskart/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                 # Providers + router + mount
    ├── App.jsx                  # Layout, routes, chaos attribute
    ├── index.css                # Theme tokens, keyframes, chaos levels
    ├── data/
    │   └── products.js          # Products, categories, delivery, promos
    ├── utils/
    │   └── formatCurrency.js     # Currency, helpers, order id
    ├── hooks/
    │   ├── useCart.jsx           # Cart state + localStorage
    │   ├── useAuth.jsx           # Demo login/signup + localStorage
    │   └── useChaos.jsx          # Chaos score/level/interactions + history
    ├── components/
    │   ├── Navbar.jsx            Hero.jsx            PromoBanner.jsx
    │   ├── ProductCard.jsx       ProductGrid.jsx     ProductModal.jsx
    │   ├── CategoryFilter.jsx    StarRating.jsx      CartDrawer.jsx
    │   ├── ChaosMeter.jsx        ChaosToggle.jsx     ChaosLayer.jsx
    │   ├── Toast.jsx             CheckoutForm.jsx    Footer.jsx
    └── pages/
        ├── Home.jsx
        ├── Cart.jsx
        ├── Checkout.jsx
        ├── Login.jsx
        └── UxDashboard.jsx
```

---

## Installation & run commands

> Requires **Node.js 18+**. On Windows, if `npm` is blocked by PowerShell
> execution policy, use `npm.cmd` instead of `npm`.

```bash
cd OopsKart
npm install
npm run dev
```

Open **http://localhost:5174** in your browser.

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # preview the production build (http://localhost:4174)
```

---

## Demo instructions (2-minute script)

1. **Professional homepage (15s)**
   Show the clean navbar, hero headline *“Shopping made unnecessarily
   difficult.”*, and the trust badges. Point out the **Chaos Meter** reading 0.
2. **Shop like a normal human (20s)**
   Use the search box (“invisible”), filter to a category, sort by price, and
   open a product modal. Add two items — note the cart badge, the toast, and the
   **cart drawer** sliding in.
3. **Unleash chaos (35s)**
   Keep clicking: change filters, open products, adjust quantities. Watch the
   meter climb through **L1 → L5**: cards start leaning, then wobbling, then
   floating emoji appear and promotions shout. Stress that **buttons never move**
   and the layout is still usable.
4. **Login & checkout (25s)**
   Open the **Cart page**, switch delivery to “Premium Confused Pigeon”, watch
   the total update transparently, then go to **Checkout**. It asks you to log in
   — hit **“Use demo account”** (`demo@oopskart.test` / `chaos123`) and return.
   Try submitting empty to trigger validation, then place the **Demo Order**.
   Show the random order ID and confirmation screen.
5. **The lesson (25s)**
   Open the **UX Dashboard**. Show interactions, chaos score, products explored,
   and the **Bad UX vs. Good UX** table. Click **Reset chaos** (or toggle Chaos
   Mode OFF) to return to a calm, professional store — the payoff.

---

## Accessibility & quality

- Semantic HTML landmarks (`header`, `nav`, `main`, `footer`, headings, tables).
- Keyboard-accessible controls, visible focus rings, a **Skip to content** link.
- Labelled form fields with `aria-invalid` / `aria-describedby` error messaging.
- Dialogs trap nothing but close on `Escape` and restore body scroll.
- `prefers-reduced-motion` disables all chaos animations and the marquee.
- No broken links or non-functional buttons; every route resolves (incl. a 404).
- Chaos is **cosmetic only** — controls stay put and remain fully usable.

---

## Limitations & future improvements

- All products, prices, delivery fees and payment methods are **fictional**.
- Metrics are **demo metrics** from local clicks — not real user research.
- No backend: data lives in `localStorage` and does not sync across devices.
- Chaos is deterministic-ish across 5 levels; a future version could add timed
  “chaos events” and an experiment mode (A/B between calm and chaotic UIs).
- Possible additions: product comparison, wishlists, dark/light themes, i18n,
  and automated tests (Vitest + Testing Library).

---

## License / disclaimer

Educational parody project. Not a real store. No products exist, no payments
are processed, and no personal or financial data is collected.
