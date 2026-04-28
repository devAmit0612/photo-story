type EasingFunction = (progress: number) => number;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const namedEasings: Record<string, EasingFunction> = {
  linear: (progress) => progress,
  ease: cubicBezier(0.25, 0.1, 0.25, 1),
  'ease-in': cubicBezier(0.42, 0, 1, 1),
  'ease-out': cubicBezier(0, 0, 0.58, 1),
  'ease-in-out': cubicBezier(0.42, 0, 0.58, 1),
};

function cubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveCurveX = (x: number): number => {
    let t = x;

    for (let i = 0; i < 8; i += 1) {
      const currentX = sampleCurveX(t) - x;
      const currentDerivative = sampleCurveDerivativeX(t);

      if (Math.abs(currentX) < 1e-6) return t;
      if (Math.abs(currentDerivative) < 1e-6) break;

      t -= currentX / currentDerivative;
    }

    let lower = 0;
    let upper = 1;
    t = x;

    while (lower < upper) {
      const currentX = sampleCurveX(t);
      if (Math.abs(currentX - x) < 1e-6) return t;
      if (x > currentX) {
        lower = t;
      } else {
        upper = t;
      }
      t = (upper - lower) * 0.5 + lower;
    }

    return t;
  };

  return (progress: number) => sampleCurveY(solveCurveX(clamp(progress, 0, 1)));
}

function parseCubicBezier(easing: string): EasingFunction | null {
  const match = easing.match(
    /^cubic-bezier\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)$/i
  );

  if (!match) {
    return null;
  }

  const [, x1, y1, x2, y2] = match;

  return cubicBezier(Number(x1), Number(y1), Number(x2), Number(y2));
}

export default function resolveEasing(easing: string = 'linear'): EasingFunction {
  const normalized = easing.trim().toLowerCase();

  if (namedEasings[normalized]) {
    return namedEasings[normalized];
  }

  return parseCubicBezier(normalized) || namedEasings.linear;
}
