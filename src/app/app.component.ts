import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { animate, scroll } from 'motion';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EASE_OUT, MotionService } from './motion/motion.service';
import { PageTransitionService } from './motion/page-transition.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('progress') progress!: ElementRef<HTMLElement>;
  @ViewChild('main') main!: ElementRef<HTMLElement>;
  @ViewChild('curtainAccent') curtainAccent!: ElementRef<HTMLElement>;
  @ViewChild('curtainInk') curtainInk!: ElementRef<HTMLElement>;
  @ViewChild('curtainLabel') curtainLabel!: ElementRef<HTMLElement>;
  @ViewChild('curtainCount') curtainCount!: ElementRef<HTMLElement>;

  private subs = new Subscription();
  private stopProgress?: () => void;

  constructor(
    private router: Router,
    private zone: NgZone,
    private motion: MotionService,
    private transition: PageTransitionService
  ) {}

  ngAfterViewInit(): void {
    this.transition.register({
      accent: this.curtainAccent.nativeElement,
      ink: this.curtainInk.nativeElement,
      label: this.curtainLabel.nativeElement,
      count: this.curtainCount.nativeElement,
    });
    this.transition.intro();

    this.zone.runOutsideAngular(() => {
      const bar = this.progress.nativeElement;
      this.stopProgress = scroll(({ y }) => (bar.style.transform = `scaleX(${y.progress})`));
    });

    // Back/forward navigation skips the curtain, so give the page a soft entrance instead.
    let popstate = false;
    this.subs.add(
      this.router.events.pipe(filter((e) => e instanceof NavigationStart)).subscribe((e) => {
        popstate = (e as NavigationStart).navigationTrigger === 'popstate';
      })
    );
    this.subs.add(
      this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
        if (popstate && !this.motion.reduced) {
          this.zone.runOutsideAngular(() =>
            animate(this.main.nativeElement, { opacity: [0, 1], y: [24, 0] }, { duration: 0.7, easing: EASE_OUT })
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.stopProgress?.();
  }
}
