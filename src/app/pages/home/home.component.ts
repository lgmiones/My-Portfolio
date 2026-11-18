import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { animate, scroll } from 'motion';
import { EXPERIENCE, MARQUEE, PROFILE, PROJECTS, SERVICES, SKILLS } from '../../data/portfolio.data';
import { EASE_OUT, MotionService } from '../../motion/motion.service';
import { PageTransitionService } from '../../motion/page-transition.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pill') pill!: ElementRef<HTMLElement>;
  @ViewChild('pillImg') pillImg!: ElementRef<HTMLElement>;
  @ViewChildren('card') cards!: QueryList<ElementRef<HTMLElement>>;

  readonly profile = PROFILE;
  readonly year = new Date().getFullYear();
  readonly featured = PROJECTS.filter((p) => p.featured);
  readonly projectCount = PROJECTS.length;
  readonly services = SERVICES;
  readonly skills = SKILLS;
  readonly experience = EXPERIENCE;
  readonly marquee = MARQUEE;

  private cleanups: Array<() => void> = [];
  private destroyed = false;

  constructor(private zone: NgZone, private motion: MotionService, private transition: PageTransitionService) {}

  ngAfterViewInit(): void {
    if (this.motion.reduced) return;

    const pill = this.pill.nativeElement;
    const img = this.pillImg.nativeElement;
    pill.style.clipPath = 'inset(50% 50% 50% 50% round 999px)';

    this.transition.ready().then(() => {
      if (this.destroyed) return;
      this.zone.runOutsideAngular(() => {
        // Portrait capsule opens from its centre between the first and last name.
        animate(
          pill,
          { clipPath: ['inset(50% 50% 50% 50% round 999px)', 'inset(0% 0% 0% 0% round 999px)'] },
          { duration: 1.1, delay: 0.35, easing: EASE_OUT }
        );
        animate(img, { scale: [1.5, 1] }, { duration: 1.4, delay: 0.35, easing: EASE_OUT });

        // Stacked project cards: each one sinks back as the next slides over it.
        const cards = this.cards.toArray().map((c) => c.nativeElement);
        const stacked = window.matchMedia('(min-width: 861px)').matches;
        if (!stacked) return;
        cards.slice(0, -1).forEach((card, i) => {
          const target = 1 - (cards.length - 1 - i) * 0.035;
          const stop = scroll(
            animate(card, { scale: [1, target], filter: ['brightness(1)', 'brightness(0.86)'] }, { easing: 'linear' }),
            { target: card, offset: ['start start', 'end start'] }
          );
          this.cleanups.push(stop);
        });
      });
    });
  }

  /** Keeps the "Visit ↗" badge under the cursor inside a project image. */
  trackBadge(e: PointerEvent): void {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.cleanups.forEach((c) => c());
  }
}
