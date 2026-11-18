import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { PROFILE } from '../../data/portfolio.data';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit, OnDestroy {
  readonly profile = PROFILE;
  readonly channels = [
    { label: 'Phone', value: PROFILE.phoneDisplay, url: PROFILE.phoneHref, external: false },
    { label: 'GitHub', value: 'github.com/lgmiones', url: PROFILE.socials.github, external: true },
    { label: 'LinkedIn', value: 'Louell Grey Miones', url: PROFILE.socials.linkedin, external: true },
    { label: 'Facebook', value: 'facebook.com/lgmiones', url: PROFILE.socials.facebook, external: true },
    { label: 'Figma', value: 'Design portfolio', url: PROFILE.socials.figma, external: true },
    { label: 'Résumé', value: 'Download PDF', url: PROFILE.resume, external: true },
  ];

  time = '';
  copied = false;
  private clock?: number;
  private copyTimer?: number;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: PROFILE.timeZone, hour: 'numeric', minute: '2-digit' });
    const tick = () => (this.time = fmt.format(new Date()));
    tick();
    this.zone.runOutsideAngular(() => (this.clock = window.setInterval(() => this.zone.run(tick), 20_000)));
  }

  ngOnDestroy(): void {
    window.clearInterval(this.clock);
    window.clearTimeout(this.copyTimer);
  }

  async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      // Older browsers / insecure contexts: fall back to a hidden textarea.
      const ta = document.createElement('textarea');
      ta.value = PROFILE.email;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    this.copied = true;
    window.clearTimeout(this.copyTimer);
    this.copyTimer = window.setTimeout(() => (this.copied = false), 2400);
  }
}
