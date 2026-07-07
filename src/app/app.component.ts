import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import * as AOS from 'aos';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private theme: ThemeService, private router: Router) {}

  private fxStop?: () => void;
  private rainStop?: () => void;

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,      // animate only once
      offset: 80
    });

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => AOS.refreshHard(), 50);
      });

      // ✅ start rain overlay
    this.rainStop = this.startRain();
    this.fxStop = this.startParticles();
  }
  ngOnDestroy(): void {
    this.rainStop?.();
    this.fxStop?.();
  }

  private startRain(): () => void {
    const canvas = document.getElementById('rain-canvas') as HTMLCanvasElement | null;
    if (!canvas) return () => {};

    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};

    let w = 0, h = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();

    // theme-aware: brighter on dark, subtle on light
    const isDark = () => document.body.classList.contains('dark');

    type Drop = { x: number; y: number; len: number; speed: number; width: number; };
    const drops: Drop[] = [];
    const DROP_COUNT = 140; // adjust: 80..200

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    for (let i = 0; i < DROP_COUNT; i++) {
      drops.push({
        x: rand(0, w),
        y: rand(-h, 0),
        len: rand(10, 22),
        speed: rand(8, 16),
        width: rand(1, 1.6)
      });
    }

    let raf = 0;
    let running = true;

    const draw = () => {
      if (!running) return;

      ctx.clearRect(0, 0, w, h);

      // stroke style changes by theme but no background fill
      ctx.lineCap = 'round';
      ctx.strokeStyle = isDark()
        ? 'rgba(255,255,255,0.22)'
        : 'rgba(0,0,0,0.10)';

      for (const d of drops) {
        ctx.lineWidth = d.width;

        // angled rain
        const dx = 3; // wind: increase for more slant
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + dx, d.y + d.len);
        ctx.stroke();

        d.y += d.speed;
        d.x += dx * 0.15;

        if (d.y > h + 30) {
          d.y = rand(-200, -20);
          d.x = rand(0, w);
        }
        if (d.x > w + 20) d.x = -10;
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    // pause when tab not visible (performance)
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(draw);
      }
    };

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      ctx.clearRect(0, 0, w, h);
    };
  }

  private startParticles(): () => void {
    const canvas = document.getElementById('fx-canvas') as HTMLCanvasElement | null;
    if (!canvas) return () => {};
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};

    let w = 0, h = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();

    const isDark = () => document.body.classList.contains('dark');
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    type P = { x: number; y: number; r: number; vx: number; vy: number; };
    const particles: P[] = [];
    const COUNT = 70; // 40..120

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(1, 2.4),
        vx: rand(-0.25, 0.25),
        vy: rand(-0.15, 0.15),
      });
    }

    let raf = 0;
    let running = true;

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      // draw dots
      const dot = isDark() ? 'rgba(0, 0, 0, 0.16)' : 'rgba(0,0,0,0.08)';
      const line = isDark() ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0,0,0,0.04)';

      // update + render
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.beginPath();
        ctx.fillStyle = dot;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // connect close particles (super subtle)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 140) {
            ctx.strokeStyle = line;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      ctx.clearRect(0, 0, w, h);
    };
  }

  
}
