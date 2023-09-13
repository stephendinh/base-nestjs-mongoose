export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function sleepRandom({ range = 1000, min = 5000 } = {}): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.round(Math.random() * range + min));
  });
}
