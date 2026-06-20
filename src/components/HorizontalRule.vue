<template>
  <hr class="pixel-rule" aria-hidden="true" />
</template>

<style scoped>
.pixel-rule {
  display: block;
  width: 100%;
  height: clamp(0.55rem, 1.2vw, 0.9rem);
  margin: 0;
  border: 0;
  background-image: linear-gradient(
    90deg,
    transparent     0 14px,
    var(--accent)   14px 28px,
    var(--accent-2) 28px 42px,
    var(--ink)      42px 56px
  );
  background-size: 56px 100%;
  background-repeat: repeat;
  background-position: 0 0;
  box-shadow:
    4px 4px 0 color-mix(in oklab, var(--ink) 80%, transparent),
    8px 8px 0 color-mix(in oklab, var(--ink) 35%, transparent);
  animation: pixel-rule-scroll 14s steps(56, end) infinite;
}

@keyframes pixel-rule-scroll {
  from { background-position: 0 0; }
  to   { background-position: 56px 0; }
}

@media (prefers-reduced-motion: reduce) {
  .pixel-rule { animation: none; }
}
</style>
