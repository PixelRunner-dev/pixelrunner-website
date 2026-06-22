import { describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';

import AppletShowcase from '@/components/AppletShowcase.vue';
import { applets, filterByTag } from '@/lib/applets';

function makeRouter(initialPath = '/') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', name: 'home', component: { template: '<div />' } }]
  });
  router.push(initialPath);
  return router;
}

async function mountWithRouter(initialPath = '/') {
  const router = makeRouter(initialPath);
  await router.isReady();
  const wrapper = mount(AppletShowcase, {
    global: {
      directives: { reveal: {} },
      mocks: { $t: (key: string) => key },
      plugins: [router]
    }
  });
  return { wrapper, router };
}

describe('AppletShowcase', () => {
  it('shows all applets by default', async () => {
    const { wrapper } = await mountWithRouter();
    expect(wrapper.findAll('.applet')).toHaveLength(applets.length);
  });

  it('always shows a dimmed more applets item', async () => {
    const { wrapper } = await mountWithRouter();
    expect(wrapper.get('.more-applets').text()).toBe('applets.more');
  });

  it('filters the grid when a tag tab is selected', async () => {
    const { wrapper } = await mountWithRouter();
    await wrapper.get('[data-tag="clock"]').trigger('click');

    expect(wrapper.findAll('.applet')).toHaveLength(filterByTag('clock').length);
    expect(wrapper.get('[data-tag="clock"]').classes()).toContain('tab-active');
  });

  it('builds CDN image urls on the thumbnails', async () => {
    const { wrapper } = await mountWithRouter();
    const src = wrapper.get('.applet img').attributes('src');
    expect(src).toMatch(/^https:\/\/applets\.pixelrunner\.dev\/[^/]+\.webp$/);
  });

  it('writes the search term into the ?q= URL param', async () => {
    const { wrapper, router } = await mountWithRouter();
    const input = wrapper.get<HTMLInputElement>('[data-test="applet-search"]');
    await input.setValue('clock');
    await flushPromises();
    expect(router.currentRoute.value.query.q).toBe('clock');

    await input.setValue('');
    await flushPromises();
    expect(router.currentRoute.value.query.q).toBeUndefined();
  });

  it('seeds the input from ?q= on load and filters', async () => {
    const { wrapper } = await mountWithRouter('/?q=clock');
    const input = wrapper.get<HTMLInputElement>('[data-test="applet-search"]');
    expect(input.element.value).toBe('clock');
    expect(wrapper.findAll('.applet').length).toBeGreaterThan(0);
    expect(wrapper.findAll('.applet').length).toBeLessThan(applets.length);
  });

  it('does not render raw HTML from ?q= (XSS guard)', async () => {
    const payload = '<img src=x onerror=alert(1)>';
    const { wrapper } = await mountWithRouter(`/?q=${encodeURIComponent(payload)}`);
    const input = wrapper.get<HTMLInputElement>('[data-test="applet-search"]');
    expect(input.element.value).toBe(payload);
    expect(wrapper.html()).not.toContain('onerror=');
    expect(wrapper.find('img[src="x"]').exists()).toBe(false);
  });
});
