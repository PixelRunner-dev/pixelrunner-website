import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';

import PriceBadge from '@/components/PriceBadge.vue';

const fetchBtcEur = vi.hoisted(() => vi.fn());

vi.mock('@/lib/price', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/price')>();
  return { ...actual, fetchBtcEur };
});

// $t is provided app-wide by i18next-vue; stub it for isolated mounting.
const mountOpts = { global: { mocks: { $t: (key: string) => key } } };

describe('PriceBadge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    fetchBtcEur.mockReset();
  });
  afterEach(() => vi.useRealTimers());

  it('renders €210 and the live sats figure rounded up to 100 sats', async () => {
    fetchBtcEur.mockResolvedValue(55815);
    const wrapper = mount(PriceBadge, mountOpts);
    await flushPromises();

    expect(wrapper.text()).toContain('€210');
    expect(wrapper.get('[data-test="sats"]').text()).toBe('376 300');
  });

  it('shows "—" and a notice when the rate fetch fails', async () => {
    fetchBtcEur.mockRejectedValue(new Error('network'));
    const wrapper = mount(PriceBadge, mountOpts);
    await flushPromises();

    expect(wrapper.get('[data-test="sats"]').text()).toBe('—');
    expect(wrapper.text()).toContain('€210');
    expect(wrapper.find('.price-stale').exists()).toBe(true);
  });
});
