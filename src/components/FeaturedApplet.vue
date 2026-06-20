<script setup lang="ts">
import AppletImage from '@/components/AppletImage.vue';
import { applets, imageUrl } from '@/lib/applets';

const BACKGROUNDS = ['bookshelf', 'lofi-desk'] as const;
const background = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];

const featured =
  applets.length > 0 ? applets[Math.floor(Math.random() * applets.length)] : null;
</script>

<template>
  <section v-if="featured" class="featured-applet">
    <picture class="featured-applet__bg" aria-hidden="true">
      <source
        media="(max-width: 760px)"
        :srcset="`/featured-backgrounds/${background}--portrait.png`"
      />
      <img
        :src="`/featured-backgrounds/${background}--landscape.png`"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </picture>

    <div class="featured-applet__inner">
      <AppletImage :src="imageUrl(featured)" :alt="featured.name" show-frame />
    </div>
  </section>
</template>

<style scoped>
.featured-applet {
  position: relative;
  isolation: isolate;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-inline: clamp(1rem, 4vw, 2rem);
  min-height: 864px;
  overflow: hidden;
}
@media (max-width: 760px) {
  .featured-applet { min-height: 1536px; }
}
.featured-applet__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
.featured-applet__bg img {
  width: 100%;
  height: 100%;
  object-fit: none;
  object-position: center center;
  display: block;
}
.featured-applet__inner {
  width: 100%;
  max-width: 21rem;
}
.featured-applet__inner :deep(.is-showing-frame) {
  margin-top: 0;
}
</style>
