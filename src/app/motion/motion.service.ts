import { Injectable } from '@angular/core';

export type Bezier = [number, number, number, number];

/** Long, soft deceleration — used for most reveals. */
export const EASE_OUT: Bezier = [0.22, 1, 0.36, 1];
/** Strong in-out — used for curtains and large wipes. */
export const EASE_IN_OUT: Bezier = [0.76, 0, 0.24, 1];
/** Expo-style out for counters. */
export const EASE_EXPO: Bezier = [0.16, 1, 0.3, 1];

@Injectable({ providedIn: 'root' })
export class MotionService {
  readonly reduced =
    typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  readonly finePointer =
    typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}
