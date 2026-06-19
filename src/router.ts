import { createRouter, createWebHashHistory } from 'vue-router';

import Home from '@/views/Home.vue';
import Privacy from '@/views/Privacy.vue';
import Terms from '@/views/Terms.vue';

// Hash history: no server rewrites needed on GitHub Pages.
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/privacy', name: 'privacy', component: Privacy },
    { path: '/terms', name: 'terms', component: Terms }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});
