<template>
  <div class="carousel-items">
    <div @click="pre" class="slider-btn pre-btn">
      <Icon type="ios-arrow-back" />
    </div>
    <slider ref="slider" :options="{ ...options, ...config }">
      <slideritem
        v-for="(item, index) in data"
        :key="index + '_carouselItem'"
        class="slider-item"
        :style="{ ...config.style }"
      >
        <carousel-content
          @on-mouserover="mouseOver"
          @on-mouseleave="mouseLeave"
          @click.native="handleClickCarousel(item)"
          :data="item"
        />
      </slideritem>
      <div slot="loading"></div>
    </slider>
    <div @click="next" class="slider-btn next-btn">
      <Icon type="ios-arrow-forward" />
    </div>
  </div>
</template>

<script>
import { slider, slideritem } from 'vue-concise-slider'
import CarouselContent from './CarouselContent.vue'

export default {
  name: 'CarouselItem',
  components: {
    slider,
    slideritem,
    CarouselContent
  },
  props: {
    config: {
      type: Object,
      required: false
    },
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentCarousel: 0,
      options: {
        currentPage: 0,
        tracking: false,
        thresholdDistance: 100,
        thresholdTime: 300,
        autoplay: '3000',
        slidesToScroll: 1,
        loop: true,
        loopedSlides: 3,
        itemAnimation: true
      }
    }
  },
  watch: {},
  methods: {
    handleClickCarousel(item) {
      this.$emit('on-click-carousel', item)
    },
    handleClickTabs(name) {
      this.currentCarousel = parseInt(name)
    },
    next() {
      this.$refs.slider.$emit('slideNext')
    },
    pre() {
      this.$refs.slider.$emit('slidePre')
    },
    mouseOver() {
      this.$refs.slider.$emit('autoplayStop')
    },
    mouseLeave() {
      this.$refs.slider.$emit('autoplayStart', 3000)
    }
  }
}
</script>

<style scoped lang="scss">
.carousel-items {
  width: 100%;
  margin: 0 auto;
  height: 360px;
  position: relative;
  &:hover {
    .slider-btn {
      opacity: 1;
    }
  }
  .slider-btn {
    opacity: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 50px;
    border: 0;
    color: var(--font);
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    cursor: pointer;
    z-index: 2;
    &:hover {
      color: var(--theme);
    }
    &.pre-btn {
      left: -50px;
    }
    &.next-btn {
      right: -50px;
    }
  }
  .slider-item {
    width: calc(97% / 4);
    margin-right: 0;
    padding: 0 5px;
  }
  ::v-deep .swiper-container-horizontal .slider-pagination-bullet-active,
  .swiper-container-vertical .slider-pagination-bullet-active {
    background: var(--color) none repeat scroll 0 0;
    opacity: 0.8;
  }
  ::v-deep .swiper-container-horizontal > * > .slider-pagination-bullet {
    margin-top: 10px;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    bottom: 0;
  }
  ::v-deep .slider-pagination {
  }
}
@media screen and (max-width: 760px) {
  .carousel-items .slider-item {
    width: 100% !important;
  }
}
@media screen and (max-width: 500px) {
  .carousel-items .slider-item {
    width: 96% !important;
  }
}
</style>
