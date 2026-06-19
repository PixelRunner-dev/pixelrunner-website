import { afterEach, describe, expect, it, vi } from 'vitest';

import { PRICE_EUR, ceilSatsToHundreds, eurToSats, fetchBtcEur, formatSats, productPriceSats } from '@/lib/price';

describe('eurToSats', () => {
  it('converts EUR to sats at the given BTC/EUR rate', () => {
    // 210 / 55815 * 1e8 ≈ 376,243
    expect(eurToSats(PRICE_EUR, 55815)).toBe(376243);
  });

  it('rounds to the nearest sat', () => {
    expect(eurToSats(1, 100_000_000)).toBe(1); // 1 EUR @ 1e8 EUR/BTC = 1 sat
    expect(eurToSats(1, 66_000_000)).toBe(2); // 1e8/66e6 ≈ 1.515 -> rounds up
  });

  it.each([0, -1, NaN, Infinity])('throws on invalid rate %s', (rate) => {
    expect(() => eurToSats(PRICE_EUR, rate)).toThrow();
  });
});

describe('ceilSatsToHundreds', () => {
  it('rounds sats up to the next 100 sats', () => {
    expect(ceilSatsToHundreds(385399)).toBe(385400);
    expect(ceilSatsToHundreds(385400)).toBe(385400);
    expect(ceilSatsToHundreds(1)).toBe(100);
  });
});

describe('productPriceSats', () => {
  it('converts a mempool BTC/EUR rate to a product price rounded up to 100 sats', () => {
    expect(productPriceSats(55815)).toBe(376300);
  });
});

describe('formatSats', () => {
  it('groups thousands with thin spaces', () => {
    expect(formatSats(376243)).toBe('376 243');
    expect(formatSats(1000000)).toBe('1 000 000');
    expect(formatSats(42)).toBe('42');
  });
});

describe('fetchBtcEur', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns the EUR price from a 200 response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ USD: 64000, EUR: 55815 }) })
    );
    await expect(fetchBtcEur()).resolves.toBe(55815);
  });

  it('throws on a non-200 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(fetchBtcEur()).rejects.toThrow(/503/);
  });

  it('throws when EUR is missing or invalid', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ USD: 64000 }) }));
    await expect(fetchBtcEur()).rejects.toThrow(/EUR/);
  });
});
