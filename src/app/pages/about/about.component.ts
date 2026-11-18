import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { animate, inView, scroll } from 'motion';
import { EDUCATION, EXPERIENCE, PROFILE, TRAINING } from '../../data/portfolio.data';
import { EASE_IN_OUT, MotionService } from '../../motion/motion.service';
import { PageTransitionService } from '../../motion/page-transition.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('portrait') portrait!: ElementRef<HTMLElement>;
  @ViewChild('timeline') timeline!: ElementRef<HTMLElement>;
  @ViewChild('fill') fill!: ElementRef<HTMLElement>;

  readonly profile = PROFILE;
  readonly experience = EXPERIENCE;
  readonly training = TRAINING;
  readonly education = EDUCATION;
  readonly principles = [
    { title: 'Clean & maintainable', body: 'Code guided by SOLID principles and kept honest through peer code reviews.' },
    { title: 'Agile by default', body: 'Small, iterative deliveries — from ERP enhancements to a full-stack capstone built the Agile way.' },
    { title: 'User-centered', body: 'Responsive interfaces and clear user journeys, designed in Figma before a line of code.' },
    { title: 'Built for teams', body: 'A clear communicator across cross-functional teams — fast-adapting, resourceful and positive.' },
  ];

  private cleanups: Array<() => void> = [];
  private destroyed = false;

  constructor(private zone: NgZone, private motion: MotionService, private transition: PageTransitionService) {}

  ngAfterViewInit(): void {
    const fill = this.fill.nativeElement;
    if (this.motion.reduced) {
      fill.style.transform = 'scaleY(1)';
      return;
    }
    const frame = this.portrait.nativeElement.querySelector<HTMLElement>('.portrait__frame');
    if (frame) frame.style.clipPath = 'inset(100% 0% 0% 0% round 24px)';

    this.transition.ready().then(() => {
      if (this.destroyed) return;
      this.zone.runOutsideAngular(() => {
        // Portrait wipes up from the bottom.
        if (frame) {
          const stop = inView(
            frame,
            () => {
              animate(frame, { clipPath: ['inset(100% 0% 0% 0% round 24px)', 'inset(0% 0% 0% 0% round 24px)'] }, { duration: 1.3, easing: EASE_IN_OUT });
              stop();
            },
            { amount: 0.2 }
          );
          this.cleanups.push(stop);
        }

        // Timeline line draws itself as you scroll through the jobs.
        this.cleanups.push(
          scroll(animate(fill, { transform: ['scaleY(0)', 'scaleY(1)'] }, { easing: 'linear' }), {
            target: this.timeline.nativeElement,
            offset: ['start 65%', 'end 65%'],
          })
        );
      });
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.cleanups.forEach((c) => c());
  }
}
