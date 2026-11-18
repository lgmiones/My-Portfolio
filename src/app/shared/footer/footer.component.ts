import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PROFILE } from '../../data/portfolio.data';
import { MotionService } from '../../motion/motion.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, OnDestroy {
  readonly profile = PROFILE;
  readonly year = new Date().getFullYear();
  readonly links = [
    { path: '/', label: 'Home' },
    { path: '/work', label: 'Work' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];
  readonly socials = [
    { label: 'GitHub', url: PROFILE.socials.github },
    { label: 'LinkedIn', url: PROFILE.socials.linkedin },
    { label: 'Facebook', url: PROFILE.socials.facebook },
    { label: 'Figma', url: PROFILE.socials.figma },
  ];

  showCta = true;
  private sub?: Subscription;

  constructor(private router: Router, private motion: MotionService) {}

  ngOnInit(): void {
    this.sub = this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.showCta = !this.router.url.startsWith('/contact');
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toTop(): void {
    window.scrollTo({ top: 0, behavior: this.motion.reduced ? 'auto' : 'smooth' });
  }
}
