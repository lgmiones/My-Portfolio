import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { animate } from 'motion';
import { EASE_EXPO, EASE_IN_OUT, EASE_OUT, MotionService } from './motion.service';

interface CurtainRefs {
  accent: HTMLElement;
  ink: HTMLElement;
  label: HTMLElement;
  count: HTMLElement;
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/work': 'Work',
  '/about': 'About',
  '/contact': 'Contact',
};

const INTRO_KEY = 'lg-intro-seen';

/**
 * Drives the curtain that covers the screen between routes, plus the
 * first-load intro. Page animations wait on `ready()` so they start as the
 * curtain lifts instead of playing unseen underneath it.
 */
@Injectable({ providedIn: 'root' })
export class PageTransitionService {
  private refs?: CurtainRefs;
  private busy = false;
  private resolveReady: () => void = () => {};
  private readyPromise: Promise<void>;

  constructor(private router: Router, private zone: NgZone, private motion: MotionService) {
    this.readyPromise = new Promise<void>((r) => (this.resolveReady = r));
    if (this.motion.reduced) this.resolveReady();
  }

  /** Resolves when the current page is visible and may start animating. */
  ready(): Promise<void> {
    return this.readyPromise;
  }

  register(refs: CurtainRefs): void {
    this.refs = refs;
  }

  /** First paint: count up, then lift the curtain. */
  intro(): void {
    const refs = this.refs;
    if (!refs || this.motion.reduced) {
      this.hideCurtain();
      this.resolveReady();
      return;
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === '1';
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* storage blocked — just play the intro */
    }

    this.zone.runOutsideAngular(async () => {
      refs.label.textContent = 'Louell Grey — Portfolio';
      if (!seen) {
        refs.count.style.opacity = '1';
        animate(refs.label, { transform: ['translateY(110%)', 'translateY(0%)'] }, { duration: 0.8, easing: EASE_OUT });
        await settle(
          animate((p: number) => (refs.count.textContent = String(Math.round(p * 100)).padStart(3, '0')), {
            duration: 1.2,
            easing: EASE_EXPO,
          }).finished,
          1600
        );
      } else {
        refs.label.style.transform = 'translateY(0%)';
      }
      await this.reveal();
    });
  }

  /** Navigate with a curtain wipe. Falls back to plain routing when motion is reduced. */
  async go(url: string): Promise<void> {
    const current = this.router.url.split(/[?#]/)[0] || '/';
    if (url === current) {
      window.scrollTo({ top: 0, behavior: this.motion.reduced ? 'auto' : 'smooth' });
      return;
    }
    if (this.busy) return;

    const refs = this.refs;
    if (!refs || this.motion.reduced) {
      await this.zone.run(() => this.router.navigateByUrl(url));
      return;
    }

    this.busy = true;
    this.readyPromise = new Promise<void>((r) => (this.resolveReady = r));

    try {
      await this.zone.runOutsideAngular(async () => {
        refs.count.style.opacity = '0';
        refs.label.textContent = PAGE_LABELS[url] ?? '';
        refs.label.style.transform = 'translateY(110%)';
        document.documentElement.classList.add('is-transitioning');

        animate(refs.accent, { transform: ['translateY(100%)', 'translateY(0%)'] }, { duration: 0.6, easing: EASE_IN_OUT });
        await settle(
          animate(refs.ink, { transform: ['translateY(100%)', 'translateY(0%)'] }, { duration: 0.6, delay: 0.08, easing: EASE_IN_OUT })
            .finished,
          1000
        );
        await settle(
          animate(refs.label, { transform: ['translateY(110%)', 'translateY(0%)'] }, { duration: 0.45, easing: EASE_OUT }).finished,
          700
        );
      });

      await this.zone.run(() => this.router.navigateByUrl(url));
      window.scrollTo(0, 0);
      await this.zone.runOutsideAngular(() => this.reveal());
    } finally {
      this.busy = false;
    }
  }

  private async reveal(): Promise<void> {
    const refs = this.refs;
    if (!refs) {
      this.resolveReady();
      return;
    }
    await settle(
      animate(refs.label, { transform: ['translateY(0%)', 'translateY(-110%)'] }, { duration: 0.4, easing: EASE_IN_OUT }).finished,
      700
    );
    const ink = animate(refs.ink, { transform: ['translateY(0%)', 'translateY(-100%)'] }, { duration: 0.75, easing: EASE_IN_OUT });
    const accent = animate(
      refs.accent,
      { transform: ['translateY(0%)', 'translateY(-100%)'] },
      { duration: 0.75, delay: 0.1, easing: EASE_IN_OUT }
    );
    // let the page start animating while the curtain is still lifting
    setTimeout(() => this.resolveReady(), 320);
    await settle(Promise.all([ink.finished, accent.finished]), 1400);
    this.hideCurtain();
  }

  /** Parks the curtain off-screen, cancelling anything still running on it. */
  private hideCurtain(): void {
    const refs = this.refs;
    document.documentElement.classList.remove('is-transitioning', 'is-booting');
    if (!refs) return;
    [refs.accent, refs.ink, refs.label].forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
    [refs.accent, refs.ink].forEach((el) => (el.style.transform = 'translateY(100%)'));
    refs.count.style.opacity = '0';
  }
}

/**
 * Resolves when the promise settles or after `ms`, whichever comes first, so a
 * stalled animation (background tab, throttled frames) can never block the curtain.
 */
function settle(p: Promise<unknown>, ms: number): Promise<void> {
  return Promise.race([p.then(() => undefined, () => undefined), new Promise<void>((r) => setTimeout(r, ms))]);
}
