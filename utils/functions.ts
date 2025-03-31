export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export function includes(arr: string[], value: string) {
  return arr.some((v) => new RegExp(value).test(v));
}
