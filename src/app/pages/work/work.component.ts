import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { animate, stagger } from 'motion';
import { Project, PROJECT_FILTERS, PROJECTS, ProjectCategory } from '../../data/portfolio.data';
import { EASE_OUT, MotionService } from '../../motion/motion.service';
import { PageTransitionService } from '../../motion/page-transition.service';

type Filter = 'All' | ProjectCategory;

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css'],
})
export class WorkComponent implements AfterViewInit, OnDestroy {
  @ViewChild('list') list!: ElementRef<HTMLElement>;
  @ViewChild('preview') preview!: ElementRef<HTMLElement>;
  @ViewChild('filters') filtersEl!: ElementRef<HTMLElement>;
  @ViewChild('pill') pill!: ElementRef<HTMLElement>;

  readonly projects = PROJECTS;
  readonly filterOptions = PROJECT_FILTERS;
  readonly year = new Date().getFullYear();

  filter: Filter = 'All';
  visible: Project[] = PROJECTS;
  open: string | null = null;

  private pos = { x: 0, y: 0, tx: 0, ty: 0 };
  private raf = 0;
  private previewOn = false;
  private destroyed = false;
  private onResize = () => this.movePill(false);

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private motion: MotionService,
    private transition: PageTransitionService
  ) {}

  private onMove = (e: PointerEvent) => this.movePreview(e);

  ngAfterViewInit(): void {
    this.movePill(false);
    window.addEventListener('resize', this.onResize);
    // pointermove fires constantly — keep it out of Angular change detection
    this.zone.runOutsideAngular(() => this.list.nativeElement.addEventListener('pointermove', this.onMove));

    if (!this.motion.reduced) {
      this.list.nativeElement.querySelectorAll<HTMLElement>('.row').forEach((r) => (r.style.opacity = '0'));
    }
    this.transition.ready().then(() => {
      if (!this.destroyed) this.animateRows(0.25);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.list?.nativeElement.removeEventListener('pointermove', this.onMove);
  }

  trackSlug(_: number, p: Project): string {
    return p.slug;
  }

  countFor(f: Filter): number {
    return f === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.category === f).length;
  }

  setFilter(f: Filter): void {
    if (f === this.filter) return;
    this.filter = f;
    this.open = null;
    this.visible = f === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === f);
    this.cdr.detectChanges();
    this.movePill(true);
    this.animateRows(0);
  }

  toggle(slug: string): void {
    this.open = this.open === slug ? null : slug;
    if (this.open) this.hidePreview();
  }

  // ---------- cursor preview (desktop only) ----------

  showPreview(slug: string, e: PointerEvent): void {
    if (!this.motion.finePointer || this.open === slug) {
      this.hidePreview();
      return;
    }
    this.pos.tx = e.clientX;
    this.pos.ty = e.clientY;
    if (!this.previewOn) {
      // appear under the cursor instead of flying in from the last spot
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
    }
    const root = this.preview.nativeElement;
    root.querySelectorAll<HTMLElement>('.preview__item').forEach((el) => el.classList.toggle('is-active', el.dataset['slug'] === slug));
    root.classList.add('is-visible');
    this.previewOn = true;
    this.startFollow();
  }

  hidePreview(): void {
    this.previewOn = false;
    this.preview?.nativeElement.classList.remove('is-visible');
  }

  movePreview(e: PointerEvent): void {
    this.pos.tx = e.clientX;
    this.pos.ty = e.clientY;
    if (this.motion.reduced) {
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
    }
  }

  private startFollow(): void {
    if (this.raf) return;
    this.zone.runOutsideAngular(() => {
      const el = this.preview.nativeElement;
      const step = () => {
        const p = this.pos;
        const k = this.motion.reduced ? 1 : 0.16;
        const dx = p.tx - p.x;
        p.x += dx * k;
        p.y += (p.ty - p.y) * k;
        const tilt = Math.max(-10, Math.min(10, dx * 0.06));
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${tilt}deg)`;
        if (this.previewOn || Math.abs(dx) > 0.5) {
          this.raf = requestAnimationFrame(step);
        } else {
          this.raf = 0;
        }
      };
      this.raf = requestAnimationFrame(step);
    });
  }

  // ---------- motion helpers ----------

  private animateRows(delay: number): void {
    if (this.motion.reduced) return;
    const rows = this.list.nativeElement.querySelectorAll<HTMLElement>('.row');
    this.zone.runOutsideAngular(() =>
      animate(
        rows,
        { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0px)'] },
        { duration: 0.8, delay: stagger(0.05, { start: delay }), easing: EASE_OUT }
      )
    );
  }

  private movePill(animated: boolean): void {
    const host = this.filtersEl?.nativeElement;
    const active = host?.querySelector<HTMLElement>(`[data-filter="${this.filter}"]`);
    if (!host || !active) return;
    const x = active.offsetLeft;
    const y = active.offsetTop;
    const w = active.offsetWidth;
    const h = active.offsetHeight;
    const pill = this.pill.nativeElement;
    if (!animated || this.motion.reduced) {
      Object.assign(pill.style, { width: `${w}px`, height: `${h}px`, transform: `translate(${x}px, ${y}px)` });
      return;
    }
    this.zone.runOutsideAngular(() =>
      animate(
        pill,
        { width: `${w}px`, height: `${h}px`, transform: `translate(${x}px, ${y}px)` },
        { duration: 0.6, easing: [0.34, 1.3, 0.64, 1] }
      )
    );
  }
}
