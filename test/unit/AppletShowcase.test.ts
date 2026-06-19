import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';

import AppletShowcase from '@/components/AppletShowcase.vue';
import { applets, filterByTag } from '@/lib/applets';

// v-reveal directive and $t are provided app-wide; stub them for isolated mounting.
const global = { directives: { reveal: {} }, mocks: { $t: (key: string) => key } };

describe('AppletShowcase', () => {
  it('shows all applets by default', () => {
    const wrapper = mount(AppletShowcase, { global });
    expect(wrapper.findAll('.applet')).toHaveLength(applets.length);
  });

  it('always shows a dimmed more applets item', () => {
    const wrapper = mount(AppletShowcase, { global });
    expect(wrapper.get('.more-applets').text()).toBe('applets.more');
  });

  it('filters the grid when a tag tab is selected', async () => {
    const wrapper = mount(AppletShowcase, { global });
    await wrapper.get('[data-tag="clock"]').trigger('click');

    expect(wrapper.findAll('.applet')).toHaveLength(filterByTag('clock').length);
    expect(wrapper.get('[data-tag="clock"]').classes()).toContain('tab-active');
  });

  it('builds CDN image urls on the thumbnails', () => {
    const wrapper = mount(AppletShowcase, { global });
    const src = wrapper.get('.applet img').attributes('src');
    expect(src).toMatch(/^https:\/\/applets\.pixelrunner\.dev\/[^/]+\.webp$/);
  });
});
