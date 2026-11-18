import { Component } from '@angular/core';

/** Illustrated cover for the Pickleball booking system (no screenshot available). */
@Component({
  selector: 'app-court-art',
  template: `
    <div class="court" role="img" aria-label="Illustration of a pickleball court map with live booking status">
      <div class="court__chips">
        <span class="court__chip"><i class="ok"></i>Court 1 · Open</span>
        <span class="court__chip"><i class="busy"></i>Court 2 · Booked</span>
        <span class="court__chip"><i class="ok"></i>Court 3 · Open</span>
      </div>
      <svg class="court__svg" viewBox="0 0 440 220" aria-hidden="true">
        <rect class="court__surface" x="10" y="10" width="420" height="200" rx="6" />
        <rect class="court__line" x="10" y="10" width="420" height="200" rx="6" />
        <line class="court__line" x1="220" y1="10" x2="220" y2="210" />
        <line class="court__net" x1="220" y1="4" x2="220" y2="216" />
        <rect class="court__kitchen" x="170" y="10" width="100" height="200" />
        <line class="court__line" x1="10" y1="110" x2="170" y2="110" />
        <line class="court__line" x1="270" y1="110" x2="430" y2="110" />
        <circle class="court__ball" cx="318" cy="64" r="9" />
        <path class="court__arc" d="M 90 160 Q 200 -10 318 64" />
      </svg>
      <div class="court__slots">
        <span>7:00</span><span class="taken">8:00</span><span>9:00</span><span class="pick">10:00</span><span>11:00</span>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; width: 100%; height: 100%; }
      .court {
        position: relative; width: 100%; height: 100%; min-height: 260px;
        display: flex; flex-direction: column; justify-content: center; gap: 18px;
        padding: 8% 9%;
        background:
          radial-gradient(120% 90% at 85% 10%, rgba(255, 91, 34, 0.35), transparent 55%),
          linear-gradient(160deg, #1f3b2d 0%, #12251c 100%);
        color: #eeeae2; overflow: hidden;
      }
      .court__chips { display: flex; gap: 8px; flex-wrap: wrap; }
      .court__chip {
        display: inline-flex; align-items: center; gap: 7px; padding: 6px 10px; border-radius: 999px;
        background: rgba(238, 234, 226, 0.1); border: 1px solid rgba(238, 234, 226, 0.18);
        font: 500 10px/1 var(--f-mono); letter-spacing: 0.04em; text-transform: uppercase;
      }
      .court__chip i { width: 7px; height: 7px; border-radius: 50%; }
      .court__chip .ok { background: #5fe39a; }
      .court__chip .busy { background: #ff5b22; }
      .court__svg { width: 100%; height: auto; }
      .court__surface { fill: #2f6b4c; }
      .court__line { fill: none; stroke: rgba(238, 234, 226, 0.85); stroke-width: 2; }
      .court__kitchen { fill: rgba(95, 227, 154, 0.16); stroke: rgba(238, 234, 226, 0.85); stroke-width: 2; }
      .court__net { stroke: #eeeae2; stroke-width: 4; stroke-dasharray: 2 4; }
      .court__ball { fill: #e8ff5a; }
      .court__arc { fill: none; stroke: #e8ff5a; stroke-width: 1.5; stroke-dasharray: 4 6; opacity: 0.8; }
      .court__slots { display: flex; gap: 6px; flex-wrap: wrap; }
      .court__slots span {
        padding: 6px 9px; border-radius: 8px; border: 1px solid rgba(238, 234, 226, 0.22);
        font: 500 10px/1 var(--f-mono);
      }
      .court__slots .taken { opacity: 0.35; text-decoration: line-through; }
      .court__slots .pick { background: #ff5b22; border-color: #ff5b22; color: #151413; }
    `,
  ],
})
export class CourtArtComponent {}
