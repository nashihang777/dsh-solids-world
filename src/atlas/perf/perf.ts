/** Lightweight marks used by the atlas to log entry switch timings. */

const marks = new Map<string, number>()

export function pmark(name: string): void {
  marks.set(name, performance.now())
}

export function pspan(name: string): number {
  const start = marks.get(name)
  if (start === undefined) return 0
  return performance.now() - start
}
