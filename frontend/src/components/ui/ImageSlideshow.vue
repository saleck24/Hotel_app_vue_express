<template>
  <div class="slideshow" @mouseenter="pause" @mouseleave="start">
    <div 
      class="slides-container" 
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div v-for="(image, index) in images" :key="index" class="slide">
        <img :src="image" :alt="`Slide ${index + 1}`" class="slide-image" />
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button v-if="images.length > 1" class="nav-btn prev" @click.stop="prev">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>
    <button v-if="images.length > 1" class="nav-btn next" @click.stop="next">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>

    <!-- Indicators -->
    <div v-if="images.length > 1" class="indicators">
      <span 
        v-for="(_, index) in images" 
        :key="index" 
        class="dot" 
        :class="{ active: index === currentIndex }"
        @click.stop="goTo(index)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 5000
  }
})

const currentIndex = ref(0)
let timer = null

function next() {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

function goTo(index) {
  currentIndex.value = index
}

function start() {
  if (props.autoPlay && props.images.length > 1) {
    timer = setInterval(next, props.interval)
  }
}

function pause() {
  if (timer) clearInterval(timer)
}

onMounted(() => {
  start()
})

onUnmounted(() => {
  pause()
})
</script>

<style scoped>
.slideshow {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slides-container {
  display: flex;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide {
  min-width: 100%;
  height: 100%;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
  opacity: 0;
}

.slideshow:hover .nav-btn {
  opacity: 1;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-50%) scale(1.1);
}

.prev { left: 10px; }
.next { right: 10px; }

.indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 10;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  background: white;
  width: 18px;
  border-radius: 4px;
}
</style>
