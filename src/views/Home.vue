<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue';
import HorizontalRule from '@/components/HorizontalRule.vue';
// import FeaturedApplet from '@/components/FeaturedApplet.vue';
import PriceBadge from '@/components/PriceBadge.vue';
import FeatureStrip from '@/components/FeatureStrip.vue';
import ProductGallery from '@/components/ProductGallery.vue';
import AppletShowcase from '@/components/AppletShowcase.vue';
// import BuyLinks from '@/components/BuyLinks.vue';
</script>

<template>
  <main id="main" class="home">
    <HeroSection />
    <!-- <PriceBadge /> -->
    <FeatureStrip />
    <AppletShowcase />
    <ProductGallery />
    <!-- <FeaturedApplet /> -->
    <!-- <BuyLinks /> -->
    <HorizontalRule />
  </main>
</template>

<style scoped>
.home { position: relative; }
</style>
