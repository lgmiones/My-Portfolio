import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { animate, inView, scroll, stagger } from 'motion';
import { EASE_EXPO, EASE_OUT, MotionService } from './motion.service';
import { PageTransitionService } from './page-transition.service';

/** Shared plumbing: waits for the page curtain, runs outside Angular, cleans up. */
@Directive()
abstract class MotionBase implements OnDestroy {
  protected cleanups: Array<() => void> = [];
  protected destroyed = false;

  constructor(
    protected el: ElementRef<HTMLElement>,
    protected zone: NgZone,
    protected motion: MotionService,
    protected transition: PageTransitionService
  ) {}

  protected whenReady(fn: () => void): void {
    this.transition.ready().then(() => {
      if (!this.destroyed) this.zone.runOutsideAngular(fn);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.cleanups.forEach((c) => c());
    this.cleanups = [];
  }
}

/** Fades and lifts an element in when it scrolls into view. */
@Directive({ selector: '[appReveal]' })
export class RevealDirective extends MotionBase implements AfterViewInit {
  @Input() revealDelay = 0;
  @Input() revealY = 36;
  @Input() revealAmount: number | 'any' | 'all' = 0.25;

  constructor(el: ElementRef<HTMLElement>, zone: NgZone, motion: MotionService, transition: PageTransitionService) {
    super(el, zone, motion, transition);
  }

  ngAfterViewInit(): void {
    if (this.motion.reduced) return;
    const node = this.el.nativeElement;
    node.style.opacity = '0';
    this.whenReady(() => {
      const stop = inView(
        node,
        () => {
          animate(node, { opacity: [0, 1], y: [this.revealY, 0] }, { duration: 1, delay: this.revealDelay, easing: EASE_OUT });
          stop();
        },
        { amount: this.revealAmount }
      );
      this.cleanups.push(stop);
    });
  }
}

/** Staggers the element's direct children (or `[data-stagger]` descendants) into view. */
@Directive({ selector: '[appStagger]' })
export class StaggerDirective extends MotionBase implements AfterViewInit {
  @Input() staggerGap = 0.08;
  @Input() staggerDelay = 0;
  @Input() staggerY = 28;

  constructor(el: ElementRef<HTMLElement>, zone: NgZone, motion: MotionService, transition: PageTransitionService) {
    super(el, zone, motion, transition);
  }

  ngAfterViewInit(): void {
    if (this.motion.reduced) return;
    const host = this.el.nativeElement;
    const marked = host.querySelectorAll<HTMLElement>('[data-stagger]');
    const items = marked.length ? Array.from(marked) : (Array.from(host.children) as HTMLElement[]);
    if (!items.length) return;
    items.forEach((i) => (i.style.opacity = '0'));
    this.whenReady(() => {
      const stop = inView(
        host,
        () => {
          animate(
            items,
            { opacity: [0, 1], y: [this.staggerY, 0] },
            { duration: 0.9, delay: stagger(this.staggerGap, { start: this.staggerDelay }), easing: EASE_OUT }
          );
          stop();
        },
        { amount: 0.15 }
      );
      this.cleanups.push(stop);
    });
  }
}

/**
 * Splits text into masked words or characters that slide up into place.
 * Screen readers get the original text via a visually-hidden copy.
 */
@Directive({ selector: '[appSplit]' })
export class SplitTextDirective extends MotionBase implements AfterViewInit {
  @Input() splitBy: 'chars' | 'words' = 'chars';
  @Input() splitDelay = 0;
  @Input() splitGap = 0.035;
  /** `load` plays as soon as the page is revealed; `view` waits until it scrolls into view. */
  @Input() splitTrigger: 'load' | 'view' = 'view';

  constructor(el: ElementRef<HTMLElement>, zone: NgZone, motion: MotionService, transition: PageTransitionService) {
    super(el, zone, motion, transition);
  }

  ngAfterViewInit(): void {
    const host = this.el.nativeElement;
    const text = (host.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (!text || this.motion.reduced) return;

    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    visual.className = 'split';
    const pieces: HTMLElement[] = [];

    text.split(' ').forEach((word, wi, words) => {
      const wordEl = document.createElement('span');
      wordEl.className = 'split__word';
      const units = this.splitBy === 'chars' ? Array.from(word) : [word];
      units.forEach((u) => {
        const mask = document.createElement('span');
        mask.className = 'split__mask';
        const inner = document.createElement('span');
        inner.className = 'split__item';
        inner.textContent = u;
        mask.appendChild(inner);
        wordEl.appendChild(mask);
        pieces.push(inner);
      });
      visual.appendChild(wordEl);
      if (wi < words.length - 1) visual.appendChild(document.createTextNode(' '));
    });

    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;

    host.textContent = '';
    host.append(sr, visual);
    pieces.forEach((p) => (p.style.transform = 'translateY(110%)'));

    const play = () =>
      animate(
        pieces,
        { transform: ['translateY(110%)', 'translateY(0%)'] },
        { duration: 1, delay: stagger(this.splitGap, { start: this.splitDelay }), easing: EASE_OUT }
      );

    this.whenReady(() => {
      if (this.splitTrigger === 'load') {
        play();
        return;
      }
      const stop = inView(
        host,
        () => {
          play();
          stop();
        },
        { amount: 0.4 }
      );
      this.cleanups.push(stop);
    });
  }
}

/** Pulls an element toward the cursor and springs it back on leave. */
@Directive({ selector: '[appMagnetic]' })
export class MagneticDirective extends MotionBase implements AfterViewInit {
  @Input() magnetStrength = 0.35;

  constructor(el: ElementRef<HTMLElement>, zone: NgZone, motion: MotionService, transition: PageTransitionService) {
    super(el, zone, motion, transition);
  }

  ngAfterViewInit(): void {
    if (this.motion.reduced || !this.motion.finePointer) return;
    const node = this.el.nativeElement;
    this.zone.runOutsideAngular(() => {
      const move = (e: PointerEvent) => {
        const r = node.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * this.magnetStrength;
        const y = (e.clientY - (r.top + r.height / 2)) * this.magnetStrength;
        animate(node, { x, y }, { duration: 0.35, easing: EASE_OUT });
      };
      const leave = () => animate(node, { x: 0, y: 0 }, { duration: 0.8, easing: [0.34, 1.56, 0.64, 1] });
      node.addEventListener('pointermove', move);
      node.addEventListener('pointerleave', leave);
      this.cleanups.push(() => {
        node.removeEventListener('pointermove', move);
        node.removeEventListener('pointerleave', leave);
      });
    });
  }
}

/** Scroll-linked vertical drift for an image inside a clipping frame. */
@Directive({ selector: '[appParallax]' })
export class ParallaxDirective extends MotionBase implements AfterViewInit {
  /** Total travel as a percentage of the element's height. */
  @Input() parallaxAmount = 12;

  constructor(el: ElementRef<HTMLElement>, zone: NgZone, motion: MotionService, transition: PageTransitionService) {
    super(el, zone, motion, transition);
  }

  ngAfterViewInit(): void {
    if (this.motion.reduced) return;
    const node = this.el.nativeElement;
    const frame = node.parentElement ?? node;
    const half = this.parallaxAmount / 2;
    this.zone.runOutsideAngular(() => {
      const stop = scroll(animate(node, { y: [`-${half}%`, `${half}%`] }, { easing: 'linear' }), {
        target: frame,
        offset: ['start end', 'end start'],
      });
      this.cleanups.push(stop);
    });
  }
}

/** Counts a number up from zero when it scrolls into view. */
@Directive({ selector: '[appCountUp]' })
export class CountUpDirective extends MotionBase implements AfterViewInit {
  @Input('appCountUp') target = 0;
  @Input() countPad = 2;

  constructor(el: ElementRef<HTMLElement>, zone: NgZone, motion: MotionService, transition: PageTransitionService) {
    super(el, zone, motion, transition);
  }

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    const fmt = (n: number) => String(Math.round(n)).padStart(this.countPad, '0');
    node.textContent = fmt(this.motion.reduced ? this.target : 0);
    if (this.motion.reduced) return;
    this.whenReady(() => {
      const stop = inView(node, () => {
        animate((p: number) => (node.textContent = fmt(p * this.target)), { duration: 1.8, easing: EASE_EXPO });
        stop();
      });
      this.cleanups.push(stop);
    });
  }
}

/**
 * Internal link that plays the curtain transition. Keeps a real href so
 * middle-click / ctrl-click still open a new tab.
 */
@Directive({ selector: 'a[appLink]' })
export class TransitionLinkDirective implements OnChanges {
  @Input('appLink') path = '/';
  @HostBinding('attr.href') href = '/';

  constructor(private transition: PageTransitionService) {}

  ngOnChanges(): void {
    this.href = this.path;
  }

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent): void {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    this.transition.go(this.path);
  }
}

export const MOTION_DIRECTIVES = [
  RevealDirective,
  StaggerDirective,
  SplitTextDirective,
  MagneticDirective,
  ParallaxDirective,
  CountUpDirective,
  TransitionLinkDirective,
];
