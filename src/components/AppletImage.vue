<script setup lang="ts">
interface Props {
  src: string;
  alt: string;
  showFrame?: boolean;
}
withDefaults(defineProps<Props>(), { showFrame: false });

function onError(e: Event) {
  (e.target as HTMLImageElement).classList.add('broken');
}
</script>

<template>
  <div class="component--applet-image" :class="{ 'is-showing-frame': showFrame }">
    <div v-if="showFrame" class="image-frame frame__outer-bevel">
      <div class="frame__flat-surface">
        <div class="frame__inner-bevel">
          <img
            :src="src"
            :alt="alt"
            class="applet-image"
            loading="lazy"
            decoding="async"
            @error="onError"
          />
        </div>
      </div>
    </div>

    <img
      v-else
      :src="src"
      :alt="alt"
      class="applet-image"
      loading="lazy"
      decoding="async"
      @error="onError"
    />
  </div>
</template>

<style scoped>
.component--applet-image {
  background-color: black;
}

.component--applet-image:not(.is-showing-frame) {
  overflow: hidden;
}

.is-showing-frame {
  --s: 100px;
  --_d: calc(0.21 * var(--s));

  aspect-ratio: 2 / 1;
  margin-top: 4rem;
  margin-right: var(--_d);
  position: relative;
  isolation: isolate;
}

.is-showing-frame::before {
  content: '';
  clip-path: polygon(
    var(--_d) 0,
    100% 0,
    100% calc(100% - var(--_d)),
    calc(100% - var(--_d)) 100%,
    0 100%,
    0 var(--_d)
  );
  background: conic-gradient(
    from -90deg at calc(100% - var(--_d)) var(--_d),
    #703d15 135deg,
    #3b2805 0 270deg,
    transparent 0
  );
  width: calc(100% + var(--_d));
  height: calc(100% + var(--_d));
  display: block;
  position: absolute;
  top: calc(var(--_d) * -1);
  right: calc(var(--_d) * -1);
  z-index: -1;
}

.image-frame {
  border-color: rgb(109, 84, 58) rgb(24, 19, 13) rgb(24, 19, 13) rgb(109, 84, 58);
  border-style: solid;
  border-width: 2px;
}

.image-frame > div {
  border: 4px solid rgb(65, 40, 16);
}

.image-frame > div > div {
  border-color: rgb(24, 19, 13) rgb(109, 84, 58) rgb(109, 84, 58) rgb(24, 19, 13);
  border-style: solid;
  border-width: 5px;
}

.applet-image {
  aspect-ratio: 2 / 1;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 50%;
  display: flex;
  image-rendering: pixelated;
  mask-image: url('/mask.png');
  -webkit-mask-image: url('/mask.png');
  mask-position: center;
  -webkit-mask-position: center;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-size: contain;
  -webkit-mask-size: contain;
  min-width: 192px;
  width: 100%;
}
.applet-image.broken { visibility: hidden; }
</style>
