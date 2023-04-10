<template>
  <div class="page" :style="{border: config.border}">
    <div
      class="tagsCloud"
      :style="{ height: 420 + 'px', width: 480 + 'px' }"
      ref="Panel"
      @mousemove="listener($event)"
      @mouseenter="clearInterval"
      @mouseleave="setInterval"
    >
      <div
        class="item"
        v-for="(item, index) in tags"
        :key="index"
        :style="[
          { opacity: (400 + item.z) / 600 },
          { 'font-size': 12 * (600 / (400 - item.z)) + 'px' },
          { left: item.x + 'px' },
          { top: item.y + 'px' },
          { zIndex: item.zindexVal },
          { display: 'inline-block' },
          { color: item.rcolor },
        ]"
        :title="'检索 ' + item.name"
        @click="handleClickItem(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'TagsCloud',
  props: {
    data: {
      type: Array,
      required: true,
    },
    config: {
      type: Object | undefined,
      required: false,
      default: () => {
        return {
          width: 480,
          height: 410,
          speed: 1000,
          randomColor: true,
          border: '1px solid #CFD5E4',
          color: [
            '#427dc9',
            '#a69fd5',
            '#4152b9',
            '#34418d',
            '#e59c6f',
            '#629667',
            '#85b7be',
            '#8dc9b0',
            '#f29a9e',
          ],
        }
      },
    },
    resourceId: {
      type: String,
      required: false,
    }
  },
  data() {
    return {
      speedX: Math.PI / this.config.speed,
      speedY: Math.PI / this.config.speed,
      color: [
        '#427dc9',
        '#a69fd5',
        '#4152b9',
        '#34418d',
        '#e59c6f',
        '#629667',
        '#85b7be',
        '#8dc9b0',
        '#f29a9e',
      ],
      interval: null,
      tags: null
    }
  },
  computed: {
    radius() {
      return this.config.width / 3
    },
    CX() {
      //球心x坐标
      return this.config.width / 2
    },
    CY() {
      //球心y坐标
      return this.config.width / 2
    },
    EX() {
      return (
        this.config.width +
        document.body.scrollLeft +
        document.documentElement.scrollLeft
      )
    },
    EY() {
      return (
        this.config.width +
        document.body.scrollTop +
        document.documentElement.scrollTop
      )
    },
  },
  created() {
    this.init()
  },
  mounted() {
    //使球开始旋转
    this.setInterval()
  },
  methods: {
    setInterval() {
      this.interval = setInterval(() => {
        this.rotateX()
        this.rotateY()
      }, 10)
    },
    clearInterval() {
      clearInterval(this.interval)
      this.interval = null
    },
    init() {
      this.tags = this.data.map(item => {
         return {
           resourceId: this.resourceId,
           name: item,
         }
      })
      let winWidth = document.body.clientWidth
      if (this.config.width > winWidth) {
        this.config.width = winWidth
      }
      this.tags.forEach((item, key) => {
        let k = -1 + (2 * (key + 1) - 1) / this.data.length
        let a = Math.acos(k)
        let b = a * Math.sqrt(this.data.length * Math.PI)
        // X,Y,Z
        Vue.set(item, 'x', this.radius * Math.sin(a) * Math.cos(b) + this.CX)
        Vue.set(item, 'y', this.radius * Math.sin(a) * Math.sin(b) + this.CX)
        Vue.set(item, 'z', this.radius * Math.cos(a))
        // 随机色
        if (this.config.randomColor) {
          // Vue.set(item, 'rcolor', 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')');
          Vue.set(item, 'rcolor', this.color[key])
        }
        // Z-index
        let scale = this.config.width / (this.config.width - item.z)
        Vue.set(item, 'zindexVal', parseInt(scale * 100))
      })
    },
    rotateX() {
      var cos = Math.cos(this.speedX)
      var sin = Math.sin(this.speedX)
      // for (let tag of this.data) {
      // 	var y1 = (tag.y - this.CY) * cos - tag.z * sin + this.CY;
      // 	var z1 = tag.z * cos + (tag.y - this.CY) * sin;
      // 	tag.y = y1;
      // 	tag.z = z1;
      // }
      this.tags.forEach((item, key) => {
        var y1 = (item.y - this.CY) * cos - item.z * sin + this.CY
        var z1 = item.z * cos + (item.y - this.CY) * sin
        item.y = y1
        item.z = z1
        let scale = this.config.width / (this.config.width - item.z)
        item.zindexVal = parseInt(scale * 100)
      })
    },
    rotateY() {
      var cos = Math.cos(this.speedY)
      var sin = Math.sin(this.speedY)
      this.tags.forEach((item) => {
        var x1 = (item.x - this.CX) * cos - item.z * sin + this.CX
        var z1 = item.z * cos + (item.x - this.CX) * sin
        item.x = x1
        item.z = z1
        let scale = this.config.width / (this.config.width - item.z)
        item.zindexVal = parseInt(scale * 100)
      })
    },
    listener(event) {
      //响应鼠标移动
      var refX = this.$refs.Panel.offsetLeft
      var refY = this.$refs.Panel.offsetTop
      var x = event.clientX - refX - this.CX
      var y = event.clientY - refY - this.CY
      // this.x + CX - this.ele.offsetWidth/2 +"px";
      this.speedY =
        x * 0.0001 > 0
          ? Math.min(this.radius * 0.00002, x * 0.0001)
          : Math.max(-this.radius * 0.00002, x * 0.0001)
      this.speedX =
        y * 0.0001 > 0
          ? Math.min(this.radius * 0.00002, y * 0.0001)
          : Math.max(-this.radius * 0.00002, y * 0.0001)
    },
    handleClickItem(item) {
      this.$emit('on-click-keyword', {
        resourceId: item.resourceId,
        name: item.name
      })
    },
  },
}
</script>

<style scoped lang="scss">
.page {
  border-top: none;
  background: #F5F7FA;
  text-align: center;
}
.tagsCloud {
  position: relative;
  display: inline-block;
  max-width: 100%;
  height: 400px;
}
.item {
  position: absolute;
  cursor: pointer;
  text-align: center;
  transform: translate(-50%, -50%);
  background-color: transparent;
  outline: none;
  font-weight: 600;
  transition: background 0.5s;
  transition: color 0.2s;
  &:hover {
    color: #fff !important;
    background: var(--theme);
    opacity: 1 !important;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px !important;
  }
}
</style>
