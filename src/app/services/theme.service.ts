import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'theme';

/**
 * The initial theme is applied by an inline script in index.html (before
 * Angular boots) to avoid a flash; this service reads it and toggles it.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  get current(): Theme {
    return document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light';
  }

  /** Toggle, expanding the new theme as a circle from the given point when supported. */
  toggle(origin?: { x: number; y: number }): void {
    const next: Theme = this.current === 'dark' ? 'light' : 'dark';
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!doc.startViewTransition || reduced || !origin) {
      this.apply(next);
      return;
    }

    const radius = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
    const vt = doc.startViewTransition(() => this.apply(next));
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${radius}px at ${origin.x}px ${origin.y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' } as KeyframeAnimationOptions
      );
    });
  }

  private apply(theme: Theme): void {
    document.documentElement.dataset['theme'] = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage blocked — theme still applies for this visit */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', theme === 'dark' ? '#0e0e0d' : '#eeeae2');
  }
}
