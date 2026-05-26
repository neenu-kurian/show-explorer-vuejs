import "@testing-library/jest-dom/vitest";

export function createDeferred<T>() {
  let resolve: (value: T) => void;
  const promise = new Promise<T>((res) => { resolve = res; });
  return { promise, resolve: resolve! };
}
