/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  src/index.js  —  React Entry Point                         ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║                                                              ║
 * ║  WHAT THIS FILE DOES (in 3 steps):                          ║
 * ║    1. Finds <div id="root"> in public/index.html            ║
 * ║    2. Creates a React "root" (mounting point) inside it     ║
 * ║    3. Renders your <App /> component into that root         ║
 * ║                                                              ║
 * ║  React Native analogy:                                       ║
 * ║    AppRegistry.registerComponent('MyApp', () => App)        ║
 * ║    This does the same job — connects React to the platform. ║
 * ║                                                              ║
 * ║  YOU WILL NEVER NEED TO EDIT THIS FILE.                     ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// React: the core library. Same React you use in React Native.
import React from 'react';

// ReactDOM: the WEB-specific renderer.
// React Native uses a native renderer instead.
// ReactDOM translates your JSX into real HTML DOM elements.
import ReactDOM from 'react-dom/client';

// Your entire portfolio — every section, every component.
// This is the only file you ever edit for content/design.
import App from './App';

// ── Step 1: Find the <div id="root"> in public/index.html ──────
const rootElement = document.getElementById('root');

// ── Step 2: Create a React 18 "root" ───────────────────────────
// createRoot() is the React 18 way (replaces old ReactDOM.render).
// It enables concurrent features (React can pause/resume rendering).
const root = ReactDOM.createRoot(rootElement);

// ── Step 3: Render your App into the root ──────────────────────
root.render(
  /**
   * React.StrictMode:
   *   A development-only wrapper that:
   *   - Intentionally renders components TWICE to catch side effects
   *   - Warns about deprecated React APIs you might be using
   *   - Has ZERO effect on production builds (zero performance cost)
   *
   *   React Native analogy: similar to the __DEV__ checks
   *   in React Native that only run during development.
   */
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
