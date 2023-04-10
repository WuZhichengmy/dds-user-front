<template>
  <div
    class="demo-carousel"
    @mouseover.native="mouseOver"
    @mouseleave.native="mouseLeave"
    title="查看详情"
  >
    <div class="demo-carousel-mask" />
    <img :src="IMG_URL + data.img" alt="" />
    <div class="carousel-banner">
      <p :title="data.text">
        {{ data.text }}
      </p>
    </div>
  </div>
</template>

<script>
import { IMG_URL } from '@/settings'

export default {
  name: 'CarouselConetnt',
  props: {
    data: Object
  },
  data() {
    return {
      IMG_URL
    }
  },
  methods: {
    mouseOver() {
      this.$emit('on-mouserover')
    },
    mouseLeave() {
      this.$emit('on-mouseleave')
    }
  }
}
</script>

<style scoped lang="scss">
.demo-carousel {
  position: relative;
  width: 100%;
  height: 270px;
  overflow: hidden;
  margin-bottom: 5px;
  transition: all 0.8s;
  cursor: pointer;
  // box-shadow: 0 4px 15px 0 rgb(0 0 0 / 15%);
  border: 1px solid #e5e5e5;
  transition: 0.8s;
  border-radius: 5px;
  background: #fff;
  padding: 10px 15px;
  img {
    transition: all 0.8s;
    width: 100%;
    height: 70%;
    display: block;
  }
  &-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    transition: all 0.5s;
    display: none;
    z-index: 1;
  }
  .carousel-banner {
    padding: 10px 0;
    z-index: 2;
    color: var(--font);
    font-size: 16px;
    font-weight: 400;
    p {
      white-space: initial;
      text-align: initial;
      text-indent: 2em;
      word-break: break-all;
      overflow: hidden;
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      line-height: 1.2;
    }
  }
  &:hover {
    box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
    .carousel-banner {
      p {
        text-decoration: underline;
      }
    }
  }
}
</style>
