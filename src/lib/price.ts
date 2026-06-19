// Live BTC price + EUR->sats conversion. Price source: mempool.space.
// The product is priced at a fixed EUR 210 anchor but paid only in sats.

export const PRICE_EUR = 210;
export const SATS_PER_BTC = 100_000_000;
const PRICES_URL = 'https://mempool.space/api/v1/prices';

/** Convert a EUR amount to sats given the BTC/EUR rate. Throws on a bad rate. */
export function eurToSats(eur: number, btcEur: number): number {
  if (!Number.isFinite(btcEur) || btcEur <= 0) {
    throw new Error(`Invalid BTC/EUR rate: ${btcEur}`);
  }
  return Math.round((eur / btcEur) * SATS_PER_BTC);
}

/** Round a sats amount up to the next 100 sats. */
export function ceilSatsToHundreds(sats: number): number {
  return Math.ceil(sats / 100) * 100;
}

/** Convert mempool.space's BTC/EUR result into the displayed product price in sats. */
export function productPriceSats(btcEur: number): number {
  return ceilSatsToHundreds(eurToSats(PRICE_EUR, btcEur));
}

/** Fetch the current BTC price in EUR from mempool.space. */
export async function fetchBtcEur(signal?: AbortSignal): Promise<number> {
  const response = await fetch(PRICES_URL, { signal });
  if (!response.ok) {
    throw new Error(`mempool.space returned HTTP ${response.status}`);
  }
  const data: unknown = await response.json();
  const eur = (data as { EUR?: unknown })?.EUR;
  if (typeof eur !== 'number' || !Number.isFinite(eur) || eur <= 0) {
    throw new Error('mempool.space response missing a valid EUR price');
  }
  return eur;
}

/** Group digits with spaces, e.g. 376243 -> "376 243". */
export function formatSats(sats: number): string {
  return Math.round(sats).toLocaleString('en-US').replace(/,/g, ' ');
}
