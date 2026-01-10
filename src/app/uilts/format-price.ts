export function toCents(stringifiedPrice: string): number {
  const cleanStr = stringifiedPrice.replace(/\s/g, '').replace(',', '.');

  return Math.round(parseFloat(cleanStr) * 100);
}

export function fromCents(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',');
}
