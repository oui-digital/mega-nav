# Accessible Mega Menu

A premium, framework-agnostic mega-menu navigation component designed for robust accessibility and zero dependencies. 

Built with Vanilla JS (< 2KB), semantic HTML, and progressive CSS Grids, it natively handles advanced layouts like multi-column mega-menus, gracefully collapses for mobile devices without horizontal clipping, and implements a strict interactive disclosure pattern for screen readers.

## 🚀 Features

- **Framework Agnostic:** Drop it perfectly into Astro, 11ty, Next.js, or plain HTML projects.
- **Accessible By Default:** Bypasses restrictive `role="menubar"` traps in favor of standard, reliably traversable disclosure patterns. Tracks ARIA states dynamically. The keyboard tracking stack properly unwinds deep panel nestings natively via the `Escape` key.
- **Progressive Enhancement:** Fully functions without JavaScript enabled via CSS-native `:focus-within` fallback behaviors.
- **Mathematical Layout Bounds:** Uses smart `position: relative` header enclosures and specific `.mn-mega` modifiers to trap massive dropdown arrays, legally preventing them from exceeding viewport widths.
- **Iconography System:** Zero reliance on heavy `.woff2` font loads. Boasts a lightweight, zero-byte inline stroke-SVG system inheriting text contexts via `currentColor`.
- **Dynamic Grids:** Instant 2, 3, and 4-column cascading grid structures.
- **Theming:** Clean CSS variable configuration (`--mn-`) easily overridden by host frameworks, natively supporting `prefers-color-scheme: dark`.

---

## 📦 Installation & Usage

Copy over the relevant stylesheet variant (`.css`, `.scss`, or `.less`) alongside `mega-menu.js` into your core directory.

### 1. The Global Structure
Your navigation wrapper must sit inside a `position: relative` bounding container to mathematically enclose massive dropdown widths without slicing horizontally.

```html
<!DOCTYPE html>
<!-- The JS automatically removes the 'no-js' utility class on load -->
<html lang="en" class="no-js"> 
<body>
  <header style="border-bottom: 1px solid var(--mn-border);">
    <!-- The relative container manages layout constraints for panels -->
    <div style="max-width: 1200px; margin: 0 auto; position: relative;">
      <a href="/">Brand Logo.</a>
      <!-- Insert Nav Component Here -->
      <nav aria-label="Main Navigation" class="mega-nav" id="main-nav">...</nav>
    </div>
  </header>
  
  <!-- Paste the SVG Dictionary Sprite at the bottom of your layouts -->
  <svg style="display: none;" xmlns="http://www.w3.org/2000/svg">...</svg>
  
  <script src="mega-menu.js"></script>
</body>
</html>
```

### 2. Building Grids
Standard sub-menus operate via progressive CSS configurations triggering via `__panel` utility classes. Everything wraps flexibly.

* **2 Columns:** `class="mega-nav__panel mn-grid-2"`
* **3 Columns:** `class="mega-nav__panel mn-grid-3"`
* **4 Columns:** `class="mega-nav__panel mn-grid-4"`

Inside, configure categorized arrays utilizing the native `mega-nav__category` groupings:

```html
<div class="mega-nav__panel mn-grid-3" id="panel-services">
  <div class="mega-nav__panel-inner">
    <div class="mega-nav__panel-grid">
      
      <div class="mega-nav__category">
        <h3 class="mega-nav__category-title">Services</h3>
        <ul class="mega-nav__panel-list">
          <li><a href="#" class="mega-nav__panel-link">Plumbing</a></li>
          <li><a href="#" class="mega-nav__panel-link">Electrical</a></li>
        </ul>
      </div>

    </div>
  </div>
</div>
```

### 3. Mega Spreads vs. Dropdown Anchors
Determine how dropdown elements align to buttons:

* **Massive Header-Spanning Layouts:** Tag your root `<li>` wrapper with `.mn-mega`. This severs the dropdown's attachment from the button itself and stretches it directly across the parent relative container boundaries uniformly.
* **Local Right-Aligned Popovers:** If building standard small lists nested cleanly towards the right screen edge, append `.mn-align-right` against your panel block. This isolates its spawn point natively underneath the button while expanding inversely towards the left text, blocking clipping completely.

### 4. Promotion / CTA Blocks
Create highly styled conversion funnels alongside links dynamically.

```html
<div class="mega-nav__promo">
  <h4 class="mega-nav__promo-title">Need a quote?</h4>
  <p class="mega-nav__promo-text">Get an expert assessment natively.</p>
  <a href="/contact" class="mega-nav__promo-btn">
    Estimate
    <svg class="mega-icon" aria-hidden="true"><use href="#icon-arrow-right"></use></svg>
  </a>
</div>
```

---

## 🎨 Modifying Themes

This widget binds internal styling safely via namespaced CSS properties. Override the following tokens in your `root` or native framework integration:
- `--mn-bg`
- `--mn-text`
- `--mn-panel-bg`
- `--mn-transition`
- `--mn-icon-stroke`
- `--mn-border-radius`
