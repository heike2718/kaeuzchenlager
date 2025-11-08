# BEM (Block-Element-Modifier) CSS Methodology

### Purpose

The primary purpose of BEM is to solve common CSS problems including:

- **Inheritance conflicts**: Traditional CSS can lead to unintended style inheritance that creates bugs across large codebases
- **Naming collisions**: Generic class names like `.active` or `.button` can conflict across different components
- **Scalability issues**: As projects grow, unstructured CSS becomes difficult to maintain and extend
- **Team collaboration**: Without clear conventions, different developers may use conflicting naming approaches

### Complete Syntax Pattern

```css
/* Block */
.block {
}

/* Element */
.block__element {
}

/* Block Modifier */
.block--modifier {
}

/* Element Modifier */
.block__element--modifier {
}
```

### BEM as a Component Mindset (especially in Angular)

Think of **BEM Blocks as independent UI components** — similar to **Angular components**.

- A **Block** (e.g., `.card`, `.modal`, `.user-profile`) represents a self-contained, reusable piece of UI.
- If you define a BEM block, it’s a strong signal that this part of the markup and styles **could (and often should) be extracted into a separate Angular component**.
- This promotes:
  - Reusability across pages and modules
  - Encapsulation (styles stay within the block/component)
  - Maintainability (changes are localized)
  - Testability (component logic and styles are isolated)

Example:

```html
<!-- This is a clear BEM block → perfect candidate for an Angular component -->
<div class="card">
  <img class="card__image" src="..." alt="" />
  <div class="card__body">
    <h3 class="card__title">Title</h3>
    <p class="card__text">Description...</p>
    <button class="card__button card__button--primary">Action</button>
  </div>
</div>
```

> **Rule of thumb**:
> “If you’re writing a BEM block, ask yourself: Can this be an Angular component?”
> If yes → extract it. You’ll thank yourself later.

## Practical BEM Examples

- [BEM (Block-Element-Modifier) CSS Methodology](#bem-block-element-modifier-css-methodology)
  - [Purpose](#purpose)
  - [Complete Syntax Pattern](#complete-syntax-pattern)
  - [BEM as a Component Mindset (especially in Angular)](#bem-as-a-component-mindset-especially-in-angular)
  - [Practical BEM Examples](#practical-bem-examples)
    - [1. Button Component](#1-button-component)
    - [2. Navigation Menu](#2-navigation-menu)
    - [3. Card Component](#3-card-component)
    - [4. Form Component](#4-form-component)
    - [5. Modal Component](#5-modal-component)
    - [6. Alert/Notification Component](#6-alertnotification-component)
    - [7. Dropdown Menu](#7-dropdown-menu)
    - [8. Breadcrumb Navigation](#8-breadcrumb-navigation)
    - [9. Tab Component](#9-tab-component)
    - [10. Accordion Component](#10-accordion-component)
    - [11. Badge/Label Component](#11-badgelabel-component)
    - [12. Pagination Component](#12-pagination-component)
    - [13. Progress Bar Component](#13-progress-bar-component)
    - [14. User Profile Card](#14-user-profile-card)
    - [15. Grid Layout System](#15-grid-layout-system)
  - [Best Practices](#best-practices)
    - [Best Practices](#best-practices-1)
    - [Common Mistakes to Avoid](#common-mistakes-to-avoid)
  - [Further Reading](#further-reading)

### 1. Button Component

**Use Case:** A reusable button component with different styles and states.

**HTML:**

```html
<button class="button button--primary">
  <span class="button__text">Click Me</span>
</button>

<button class="button button--secondary button--large">
  <span class="button__icon">🔍</span>
  <span class="button__text">Search</span>
</button>

<button class="button button--disabled">
  <span class="button__text">Disabled</span>
</button>
```

**CSS:**

```css
.button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;

  &__text {
    font-weight: 500;
  }

  &__icon {
    margin-right: 0.5rem;
  }

  &--primary {
    background-color: #007bff;
    color: white;
  }

  &--secondary {
    background-color: #6c757d;
    color: white;
  }

  &--large {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

---

### 2. Navigation Menu

**Use Case:** A main navigation menu with active state highlighting.

**HTML:**

```html
<nav class="nav">
  <ul class="nav__list">
    <li class="nav__item nav__item--active">
      <a href="/" class="nav__link">Home</a>
    </li>
    <li class="nav__item">
      <a href="/about" class="nav__link">About</a>
    </li>
    <li class="nav__item">
      <a href="/contact" class="nav__link">Contact</a>
    </li>
  </ul>
</nav>
```

**CSS:**

```css
.nav {
  background-color: #333;
  padding: 1rem;

  &__list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
  }

  &__item {
    position: relative;

    &--active .nav__link {
      color: #007bff;
      font-weight: bold;
    }
  }

  &__link {
    color: white;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #007bff;
    }
  }
}
```

---

### 3. Card Component

**Use Case:** A content card used for displaying articles, products, or information blocks.

**HTML:**

```html
<article class="card">
  <img src="image.jpg" alt="Card image" class="card__image" />
  <div class="card__content">
    <h2 class="card__title">Card Title</h2>
    <p class="card__description">This is a description of the card content.</p>
    <button class="card__button">Read More</button>
  </div>
</article>

<article class="card card--featured">
  <img src="featured.jpg" alt="Featured" class="card__image" />
  <div class="card__content">
    <h2 class="card__title">Featured Article</h2>
    <p class="card__description">This card is highlighted.</p>
    <button class="card__button">Read More</button>
  </div>
</article>
```

**CSS:**

```css
.card {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: white;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  &__content {
    padding: 1.5rem;
  }

  &__title {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
    color: #333;
  }

  &__description {
    color: #666;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  &__button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  &--featured {
    border-color: #007bff;
    border-width: 2px;

    .card__title {
      color: #007bff;
    }
  }
}
```

---

### 4. Form Component

**Use Case:** A registration or contact form with validation states.

**HTML:**

```html
<form class="form">
  <div class="form__group">
    <label class="form__label" for="email">Email</label>
    <input
      type="email"
      id="email"
      class="form__input"
      placeholder="Enter email"
    />
  </div>

  <div class="form__group form__group--error">
    <label class="form__label" for="password">Password</label>
    <input
      type="password"
      id="password"
      class="form__input form__input--error"
    />
    <span class="form__error-message">Password is required</span>
  </div>

  <div class="form__group form__group--success">
    <label class="form__label" for="confirm">Confirm Password</label>
    <input
      type="password"
      id="confirm"
      class="form__input form__input--success"
    />
  </div>

  <button type="submit" class="form__submit">Submit</button>
</form>
```

**CSS:**

```css
.form {
  max-width: 400px;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 0.5rem;

  &__group {
    margin-bottom: 1.5rem;

    &--error {
    }

    &--success {
    }
  }

  &__label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  &__input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    font-size: 1rem;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: #007bff;
    }

    &--error {
      border-color: #dc3545;
    }

    &--success {
      border-color: #28a745;
    }
  }

  &__error-message {
    display: block;
    margin-top: 0.25rem;
    color: #dc3545;
    font-size: 0.875rem;
  }

  &__submit {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    cursor: pointer;
  }
}
```

---

### 5. Modal Component

**Use Case:** A popup dialog for displaying content overlays.

**HTML:**

```html
<div class="modal modal--open">
  <div class="modal__overlay"></div>
  <div class="modal__container">
    <div class="modal__header">
      <h2 class="modal__title">Modal Title</h2>
      <button class="modal__close">×</button>
    </div>
    <div class="modal__body">
      <p class="modal__content">This is the modal content.</p>
    </div>
    <div class="modal__footer">
      <button class="modal__button modal__button--cancel">Cancel</button>
      <button class="modal__button modal__button--confirm">Confirm</button>
    </div>
  </div>
</div>
```

**CSS:**

```css
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;

  &--open {
    display: block;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &__container {
    position: relative;
    max-width: 500px;
    margin: 5rem auto;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #ddd;
  }

  &__title {
    margin: 0;
    font-size: 1.5rem;
  }

  &__close {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #666;
  }

  &__body {
    padding: 1.5rem;
  }

  &__content {
    line-height: 1.6;
    color: #333;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid #ddd;
  }

  &__button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;

    &--cancel {
      background-color: #6c757d;
      color: white;
    }

    &--confirm {
      background-color: #007bff;
      color: white;
    }
  }
}
```

---

### 6. Alert/Notification Component

**Use Case:** Display status messages with different severity levels.

**HTML:**

```html
<div class="alert alert--success">
  <span class="alert__icon">✓</span>
  <div class="alert__content">
    <h4 class="alert__title">Success!</h4>
    <p class="alert__message">Your changes have been saved.</p>
  </div>
  <button class="alert__close">×</button>
</div>

<div class="alert alert--error">
  <span class="alert__icon">✗</span>
  <div class="alert__content">
    <h4 class="alert__title">Error!</h4>
    <p class="alert__message">Something went wrong.</p>
  </div>
  <button class="alert__close">×</button>
</div>

<div class="alert alert--warning">
  <span class="alert__icon">⚠</span>
  <div class="alert__content">
    <h4 class="alert__title">Warning!</h4>
    <p class="alert__message">Please check your input.</p>
  </div>
  <button class="alert__close">×</button>
</div>
```

**CSS:**

```css
.alert {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  border-left: 4px solid;

  &__icon {
    font-size: 1.5rem;
    margin-right: 1rem;
  }

  &__content {
    flex: 1;
  }

  &__title {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: bold;
  }

  &__message {
    margin: 0;
    font-size: 0.875rem;
  }

  &__close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0.5;
    margin-left: 1rem;
  }

  &--success {
    background-color: #d4edda;
    border-color: #28a745;
    color: #155724;
  }

  &--error {
    background-color: #f8d7da;
    border-color: #dc3545;
    color: #721c24;
  }

  &--warning {
    background-color: #fff3cd;
    border-color: #ffc107;
    color: #856404;
  }
}
```

---

### 7. Dropdown Menu

**Use Case:** A dropdown navigation or select menu component.

**HTML:**

```html
<div class="dropdown">
  <button class="dropdown__trigger">
    <span class="dropdown__label">Select Option</span>
    <span class="dropdown__arrow">▼</span>
  </button>
  <ul class="dropdown__menu dropdown__menu--open">
    <li class="dropdown__item dropdown__item--selected">
      <a href="#" class="dropdown__link">Option 1</a>
    </li>
    <li class="dropdown__item">
      <a href="#" class="dropdown__link">Option 2</a>
    </li>
    <li class="dropdown__item dropdown__item--disabled">
      <a href="#" class="dropdown__link">Option 3 (Disabled)</a>
    </li>
  </ul>
</div>
```

**CSS:**

```css
.dropdown {
  position: relative;
  display: inline-block;

  &__trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  &__label {
    font-size: 1rem;
  }

  &__arrow {
    font-size: 0.75rem;
    color: #666;
  }

  &__menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 200px;
    margin-top: 0.25rem;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    list-style: none;
    padding: 0;
    z-index: 100;

    &--open {
      display: block;
    }
  }

  &__item {
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    &--selected .dropdown__link {
      background-color: #007bff;
      color: white;
    }

    &--disabled .dropdown__link {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  &__link {
    display: block;
    padding: 0.75rem 1rem;
    color: #333;
    text-decoration: none;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }
  }
}
```

---

### 8. Breadcrumb Navigation

**Use Case:** Display the user's current location in a navigation hierarchy.

**HTML:**

```html
<nav class="breadcrumb">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a href="/" class="breadcrumb__link">Home</a>
    </li>
    <li class="breadcrumb__separator">/</li>
    <li class="breadcrumb__item">
      <a href="/products" class="breadcrumb__link">Products</a>
    </li>
    <li class="breadcrumb__separator">/</li>
    <li class="breadcrumb__item breadcrumb__item--active">
      <span class="breadcrumb__current">Product Details</span>
    </li>
  </ol>
</nav>
```

**CSS:**

```css
.breadcrumb {
  padding: 1rem 0;

  &__list {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__item {
    font-size: 0.875rem;

    &--active {
      pointer-events: none;
    }
  }

  &__link {
    color: #007bff;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #0056b3;
      text-decoration: underline;
    }
  }

  &__separator {
    margin: 0 0.5rem;
    color: #666;
  }

  &__current {
    color: #666;
    font-weight: 500;
  }
}
```

---

### 9. Tab Component

**Use Case:** Organize content into tabbed sections for better organization.

**HTML:**

```html
<div class="tabs">
  <div class="tabs__header">
    <button class="tabs__tab tabs__tab--active">Tab 1</button>
    <button class="tabs__tab">Tab 2</button>
    <button class="tabs__tab">Tab 3</button>
  </div>
  <div class="tabs__content">
    <div class="tabs__panel tabs__panel--active">
      <p>Content for Tab 1</p>
    </div>
    <div class="tabs__panel">
      <p>Content for Tab 2</p>
    </div>
    <div class="tabs__panel">
      <p>Content for Tab 3</p>
    </div>
  </div>
</div>
```

**CSS:**

```css
.tabs {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  overflow: hidden;

  &__header {
    display: flex;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }

  &__tab {
    flex: 1;
    padding: 1rem;
    background: none;
    border: none;
    border-right: 1px solid #ddd;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;

    &:last-child {
      border-right: none;
    }

    &:hover {
      background-color: #e9ecef;
    }

    &--active {
      background-color: white;
      font-weight: bold;
      color: #007bff;
    }
  }

  &__content {
    padding: 1.5rem;
  }

  &__panel {
    display: none;

    &--active {
      display: block;
    }
  }
}
```

---

### 10. Accordion Component

**Use Case:** Collapsible sections for FAQ pages or content organization.

**HTML:**

```html
<div class="accordion">
  <div class="accordion__item accordion__item--open">
    <button class="accordion__header">
      <span class="accordion__title">Question 1</span>
      <span class="accordion__icon">−</span>
    </button>
    <div class="accordion__content">
      <p class="accordion__text">Answer to question 1.</p>
    </div>
  </div>

  <div class="accordion__item">
    <button class="accordion__header">
      <span class="accordion__title">Question 2</span>
      <span class="accordion__icon">+</span>
    </button>
    <div class="accordion__content">
      <p class="accordion__text">Answer to question 2.</p>
    </div>
  </div>
</div>
```

**CSS:**

```css
.accordion {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  overflow: hidden;

  &__item {
    border-bottom: 1px solid #ddd;

    &:last-child {
      border-bottom: none;
    }

    &--open .accordion__content {
      display: block;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1rem;
    background-color: #f5f5f5;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.2s;

    &:hover {
      background-color: #e9ecef;
    }
  }

  &__title {
    font-size: 1rem;
    font-weight: 500;
  }

  &__icon {
    font-size: 1.25rem;
    font-weight: bold;
    color: #666;
  }

  &__content {
    display: none;
    padding: 1rem;
    background-color: white;
  }

  &__text {
    margin: 0;
    line-height: 1.6;
    color: #666;
  }
}
```

---

### 11. Badge/Label Component

**Use Case:** Small status indicators or category labels.

**HTML:**

```html
<span class="badge badge--primary">New</span>
<span class="badge badge--success">Active</span>
<span class="badge badge--warning">Pending</span>
<span class="badge badge--danger">Urgent</span>
<span class="badge badge--info badge--rounded">99+</span>
```

**CSS:**

```css
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  border-radius: 0.25rem;

  &--primary {
    background-color: #007bff;
    color: white;
  }

  &--success {
    background-color: #28a745;
    color: white;
  }

  &--warning {
    background-color: #ffc107;
    color: #333;
  }

  &--danger {
    background-color: #dc3545;
    color: white;
  }

  &--info {
    background-color: #17a2b8;
    color: further;
  }

  &--rounded {
    border-radius: 1rem;
    min-width: 1.5rem;
    padding: 0.25rem 0.5rem;
  }
}
```

---

### 12. Pagination Component

**Use Case:** Navigate through multiple pages of content.

**HTML:**

```html
<nav class="pagination">
  <ul class="pagination__list">
    <li class="pagination__item pagination__item--disabled">
      <button class="pagination__link">Previous</button>
    </li>
    <li class="pagination__item pagination__item--active">
      <button class="pagination__link">1</button>
    </li>
    <li class="pagination__item">
      <button class="pagination__link">2</button>
    </li>
    <li class="pagination__item">
      <button class="pagination__link">3</button>
    </li>
    <li class="pagination__item pagination__item--ellipsis">
      <span class="pagination__dots">...</span>
    </li>
    <li class="pagination__item">
      <button class="pagination__link">10</button>
    </li>
    <li class="pagination__item">
      <button class="pagination__link">Next</button>
    </li>
  </ul>
</nav>
```

**CSS:**

```css
.pagination {
  display: flex;
  justify-content: center;
  padding: 2rem 0;

  &__list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 0.5rem;
  }

  &__item {
    display: flex;

    &--active .pagination__link {
      background-color: #007bff;
      color: white;
      border-color: #007bff;
      font-weight: bold;
      pointer-events: none;
    }

    &--disabled .pagination__link {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    &--ellipsis {
    }
  }

  &__link {
    padding: 0.5rem 0.75rem;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    cursor: pointer;
    color: #333;
    transition: all 0.2s;

    &:hover {
      background-color: #007bff;
      color: white;
      border-color: #007bff;
    }
  }

  &__dots {
    padding: 0.5rem 0.75rem;
    color: #666;
  }
}
```

---

### 13. Progress Bar Component

**Use Case:** Display task completion or loading status.

**HTML:**

```html
<div class="progress">
  <div class="progress__bar" style="width: 60%">
    <span class="progress__label">60%</span>
  </div>
</div>

<div class="progress progress--small">
  <div class="progress__bar progress__bar--success" style="width: 100%"></div>
</div>

<div class="progress progress--large">
  <div class="progress__bar progress__bar--warning" style="width: 75%">
    <span class="progress__label">75% Complete</span>
  </div>
</div>
```

**CSS:**

```css
.progress {
  width: 100%;
  height: 2rem;
  background-color: #e9ecef;
  border-radius: 0.25rem;
  overflow: hidden;
  margin-bottom: 1rem;

  &__bar {
    height: 100%;
    background-color: #007bff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 0.3s ease;

    &--success {
      background-color: #28a745;
    }

    &--warning {
      background-color: #ffc107;
    }

    &--danger {
      background-color: #dc3545;
    }
  }

  &__label {
    color: white;
    font-size: 0.875rem;
    font-weight: bold;
  }

  &--small {
    height: 0.5rem;
  }

  &--large {
    height: 3rem;
  }
}
```

---

### 14. User Profile Card

**Use Case:** Display user information with avatar and status.

**HTML:**

```html
<div class="profile">
  <img src="avatar.jpg" alt="User" class="profile__avatar" />
  <div class="profile__info">
    <h3 class="profile__name">John Doe</h3>
    <p class="profile__title">Software Developer</p>
    <span class="profile__status profile__status--online">Online</span>
  </div>
  <div class="profile__actions">
    <button class="profile__button profile__button--primary">Follow</button>
    <button class="profile__button profile__button--secondary">Message</button>
  </div>
</div>
```

**CSS:**

```css
.profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 0.5rem;

  &__avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__info {
    flex: 1;
  }

  &__name {
    margin: 0 0 0.25rem 0;
    font-size: 1.25rem;
    color: #333;
  }

  &__title {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: #666;
  }

  &__status {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 0.25rem;

    &--online {
      background-color: #d4edda;
      color: #28a745;
    }

    &--offline {
      background-color: #f8d7da;
      color: #dc3545;
    }
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
  }

  &__button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.875rem;

    &--primary {
      background-color: #007bff;
      color: white;
    }

    &--secondary {
      background-color: #6c757d;
      color: white;
    }
  }
}
```

---

### 15. Grid Layout System

**Use Case:** Responsive grid layout for organizing content.

**HTML:**

```html
<div class="grid">
  <div class="grid__row">
    <div class="grid__col grid__col--4">
      <div class="grid__item">Column 1</div>
    </div>
    <div class="grid__col grid__col--4">
      <div class="grid__item">Column 2</div>
    </div>
    <div class="grid__col grid__col--4">
      <div class="grid__item">Column 3</div>
    </div>
  </div>

  <div class="grid__row grid__row--centered">
    <div class="grid__col grid__col--6">
      <div class="grid__item">Centered Column</div>
    </div>
  </div>
</div>
```

**CSS:**

```css
.grid {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;

  &__row {
    display: flex;
    flex-wrap: wrap;
    margin: -0.5rem;

    &--centered {
      justify-content: center;
    }
  }

  &__col {
    padding: 0.5rem;
    flex: 1;

    &--4 {
      flex: 0 0 33.333%;
      max-width: 33.333%;
    }

    &--6 {
      flex: 0 0 50%;
      max-width: 50%;
    }

    &--8 {
      flex: 0 0 66.666%;
      max-width: 66.666%;
    }

    &--12 {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }

  &__item {
    padding: 1rem;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    &__col--4,
    &__col--6,
    &__col--8 {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
}
```

## Best Practices

### Best Practices

1. **Use Classes Only**

   - Always use CSS classes for styling, not IDs or element selectors
   - This maintains low specificity and improves reusability
   - Exception: Use element selectors for global resets only

2. **Don't Create Elements of Elements**

   - Never use naming like `.block__element__subelement`
   - Instead, all elements should be direct children of the block: `.block__subelement`
   - The DOM structure can be nested, but BEM naming should remain flat

3. **Always Include the Base Class with Modifiers**

   - Modifiers cannot exist in isolation
   - Correct: `<div class="card card--featured">`
   - Incorrect: `<div class="card--featured">`

4. **Keep Blocks Independent**
   - Blocks should not have external margins or positioning
   - Use mix techniques or wrapper elements for layout positioning
   - This ensures blocks can be reused anywhere

### Common Mistakes to Avoid

1. **❌ Creating "Great-Grandchildren" (Multiple Levels of Elements)**

   **Wrong:**

   ```html
   <article class="card">
     <header class="card__header">
       <h2 class="card__header__title">Title</h2>
     </header>
   </article>
   ```

   **Correct:**

   ```html
   <article class="card">
     <header class="card__header">
       <h2 class="card__title">Title</h2>
     </header>
   </article>
   ```

```css
.gt-card {
  &__row {
    /* Element im Row-Bereich ansprechen */
    .gt-card__label {
      /* Nachfahre */
    }
    > .gt-card__label {
      /* direktes Kind */
    }

    /* Modifier des Elements */
    &--tight {
      /* .gt-card__row--tight */
    }
  }

  /* Block-Modifier kombiniert mit Element */
  &--dark .gt-card__label {
    /* .gt-card--dark .gt-card__label */
  }
}
```

_Merksatz:_ Für Elemente nur einmal verketteten Namen bilden (.block\_\_element). Keine zweite Verkettung (\_\_element\_\_sub). Für „Enkel“ immer kombinierte Selektoren verwenden.

1. **❌ Using Modifiers Without Base Classes**

   **Wrong:**

   ```html
   <button class="button--primary">Click</button>
   ```

   **Correct:**

   ```html
   <button class="button button--primary">Click</button>
   ```

2. **❌ Nesting Blocks Incorrectly**

   **Wrong:**

   ```html
   <article class="card">
     <header class="header">
       <h2 class="card__title">Title</h2>
     </header>
   </article>
   ```

   **Correct:**

   ```html
   <article class="card">
     <header class="card__header">
       <h2 class="card__title">Title</h2>
     </header>
   </article>
   ```

3. **❌ Nesting CSS Selectors**

   **Wrong:**

   ```css
   .card {
     .card__title {
       font-size: 1.5rem;
     }
   }
   ```

   **Correct:**

   ```css
   .card {
     /* card styles */
   }

   .card__title {
     font-size: 1.5rem;
   }
   ```

4. **❌ Creating Blocks That Are Too Large**

   **Wrong:**

   ```html
   <body class="body">
     <header class="body__header"></header>
     <main class="body__main"></main>
     <footer class="body__footer"></footer>
   </body>
   ```

   **Correct:**

   ```html
   <body>
     <header class="header"></header>
     <main class="main"></main>
     <footer class="footer"></footer>
   </body>
   ```

5. **❌ Using BEM Classes as Utility Classes**

   **Wrong:**

   ```html
   <!-- Using component-specific class as utility -->
   <div class="hero__margin-top">Content</div>
   <div class="card__margin-top">More Content</div>
   ```

   **Correct:**

   ```html
   <!-- Create separate utility classes if needed -->
   <div class="hero u-margin-top">Content</div>
   <div class="card u-margin-top">More Content</div>
   ```

6. **❌ Adding Margins to Blocks**

   **Wrong:**

   ```css
   .card {
     margin: 2rem;
   }
   ```

   **Correct:**

   ```css
   .card {
     /* No external margins */
   }

   /* Use a wrapper or mix for positioning */
   .section__card {
     margin: 2rem;
   }
   ```

7. **❌ Mixing BEM with Non-BEM Approaches**

   **Wrong:**

   ```html
   <div class="card">
     <h2 class="title">Title</h2>
     <p class="description">Text</p>
   </div>
   ```

   **Correct:**

   ```html
   <div class="card">
     <h2 class="card__title">Title</h2>
     <p class="card__description">Text</p>
   </div>
   ```

8. **❌ Forgetting BEM is About Semantics, Not Structure**

   Don't mirror your entire DOM structure in class names. BEM should represent the semantic relationship between components, not the HTML hierarchy.

---

## Further Reading

- **[GetBEM.com](http://getbem.com)** - Official BEM website with methodology documentation and naming conventions
- **[BEM Official Methodology](https://en.bem.info/methodology/)** - Comprehensive methodology guide from Yandex
- **[BEM Naming Convention](https://en.bem.info/methodology/naming-convention/)** - Detailed naming rules and examples
