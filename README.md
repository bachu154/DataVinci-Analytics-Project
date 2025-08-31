📊 DataVinci Analytics Agency Assignment

This project is part of the DataVinci Frontend Assignment. It demonstrates responsive UI implementation (desktop & mobile), a fully functional nested checkbox component, and a Loom walkthrough video.

🚀 Tech Stack

ReactJS (CRA / Vite depending on setup)

CSS / TailwindCSS (responsive styling)

React Hooks (useState, useEffect, useMemo)

Accessibility APIs (labels, ARIA attributes)

LocalStorage (for persistence)

📌 Assignment Tasks
Task 1: Responsive Layout Implementation

Implemented Figma design for Desktop & Mobile.

Layout adapts across breakpoints (>1024px desktop, <768px mobile).

Includes:

Navigation bar with hamburger menu on mobile.

Multi-column desktop view → single-column mobile view.

Scalable buttons & inputs with accessibility compliance.

✅ Tested in Chrome DevTools device simulator.

Figma Reference:
View Design

Task 2: Nested Checkbox Component

A custom checkbox tree with 3-state logic:

Select All

✅ Checks every node (Fruits, Vegetables + all children).

⬜ Unchecks all.

Parent Category (Fruits / Vegetables)

✅ Selects all children under that category.

⬜ Unchecks all children.

Child Items (e.g., Apple, Banana)

Checked individually.

Parent auto-updates:

✅ All children selected → parent checked.

➖ Some children selected → parent indeterminate.

⬜ None selected → parent unchecked.

📐 Logic: State propagates downward (parent → child) and upward (child → parent).
🧩 Data Structure: Tree-like object with recursive rendering.

Task 3: Loom Video Walkthrough

🎥 Video covers:

Introduction (background & role).

Code Walkthrough:

Responsive design approach (Task 1).

Nested checkbox logic (Task 2).

Demo:

Desktop layout.

Mobile responsiveness.

🛠️ Installation & Setup

Install dependencies:

npm install


Run locally:

npm start


Build for production:

npm run build

✅ Features Implemented

Pixel-perfect responsive design (desktop ↔ mobile).

Nested checkbox logic with Select All, parent-child propagation, and indeterminate states.

Accessibility: Labels, ARIA attributes, keyboard navigation.

LocalStorage persistence: Selection state retained across reloads.

Performance: Optimized with useMemo & useCallback.

Animations for smoother UX.

🔮 Possible Improvements

Add unit tests for checkbox logic.

Extend component into a generic TreeView.

Support async data fetching for dynamic lists.

📝 Submission Checklist

✅ Figma design implemented (desktop & mobile).

✅ Checkbox logic fixed & tested.

✅ Loom video walkthrough recorded.
