import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/views/Home.vue';
import Privacy from '@/views/Privacy.vue';
import Terms from '@/views/Terms.vue';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/privacy', name: 'privacy', component: Privacy },
    { path: '/terms', name: 'terms', component: Terms }
  ],
  scrollBehavior(to, from) {
    // Same-page query/replace navigations (e.g. search ?q= sync) keep current scroll.
    if (to.path === from.path && to.hash === from.hash) return false;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0 };
  }
});
