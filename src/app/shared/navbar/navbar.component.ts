import { ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { animate, stagger } from 'motion';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PROFILE } from '../../data/portfolio.data';
import { EASE_OUT, MotionService } from '../../motion/motion.service';
import { PageTransitionService } from '../../motion/page-transition.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('menu') menu?: ElementRef<HTMLElement>;

  readonly profile = PROFILE;
  readonly links = [
    { path: '/', label: 'Home' },
    { path: '/work', label: 'Work' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  active = '/';
  hidden = false;
  scrolled = false;
  menuOpen = false;
  time = '';

  private sub?: Subscription;
  private clock?: number;
  private onScroll?: () => void;

  constructor(
    public theme: ThemeService,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private motion: MotionService,
    private transition: PageTransitionService
  ) {}

  ngOnInit(): void {
    this.sub = this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.active = this.router.url.split(/[?#]/)[0] || '/';
      this.hidden = false;
      if (this.menuOpen) this.setMenu(false);
    });

    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: PROFILE.timeZone, hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => (this.time = fmt.format(new Date()));
    tick();
    this.zone.runOutsideAngular(() => {
      this.clock = window.setInterval(() => this.zone.run(tick), 20_000);

      let lastY = window.scrollY;
      this.onScroll = () => {
        const y = window.scrollY;
        const scrolled = y > 24;
        const hidden = y > 160 && y > lastY && !this.menuOpen;
        lastY = y;
        if (scrolled !== this.scrolled || hidden !== this.hidden) {
          this.scrolled = scrolled;
          this.hidden = hidden;
          this.cdr.detectChanges();
        }
      };
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    window.clearInterval(this.clock);
    if (this.onScroll) window.removeEventListener('scroll', this.onScroll);
    document.documentElement.style.overflow = '';
  }

  isActive(path: string): boolean {
    return this.active === path;
  }

  toggleTheme(e: MouseEvent): void {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.theme.toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }

  toggleMenu(): void {
    this.setMenu(!this.menuOpen);
  }

  go(path: string): void {
    if (this.menuOpen) this.setMenu(false);
    this.transition.go(path);
  }

  private setMenu(open: boolean): void {
    this.menuOpen = open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (!open || this.motion.reduced) return;
    this.cdr.detectChanges();
    const items = this.menu?.nativeElement.querySelectorAll<HTMLElement>('[data-menu-item]');
    if (!items?.length) return;
    this.zone.runOutsideAngular(() =>
      animate(
        items,
        { opacity: [0, 1], transform: ['translateY(60%)', 'translateY(0%)'] },
        { duration: 0.8, delay: stagger(0.06, { start: 0.15 }), easing: EASE_OUT }
      )
    );
  }
}
