<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue';
import PriceBadge from '@/components/PriceBadge.vue';
import FeatureStrip from '@/components/FeatureStrip.vue';
import ProductGallery from '@/components/ProductGallery.vue';
import AppletShowcase from '@/components/AppletShowcase.vue';
import BuyLinks from '@/components/BuyLinks.vue';
</script>

<template>
  <main id="main" class="home">
    <HeroSection />
    <PriceBadge />
    <FeatureStrip />
    <AppletShowcase />
    <ProductGallery />
    <BuyLinks />
  </main>
</template>

<style scoped>
.home { position: relative; }
</style>
