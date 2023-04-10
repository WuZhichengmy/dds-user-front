<template>
  <div class="error-item">
    <div class="error-box" :style="{ height: height }">
      <div class="error-box-content">
        <div class="img-box">
          <img :src="errorImg" alt="" style="width: 100%; height: 100%" />
        </div>
        <div class="error-text">
          <slot name="text">
            <p>内容不存在或已被删除</p>
          </slot>
        </div>
        <slot name="button">
          <div class="error-btn">
            <Button
              style="
                width: 250px;
                border-radius: 20px;
                height: 40px;
                color: var(--theme);
                font-weight: 600;
                font-size: 16px;
              "
              @click="$router.push('/')"
              >返回首页</Button
            >
            <!-- <Button
            style="
              width: 250px;
              border-radius: 20px;
              height: 40px;
              color: var(--theme);
              font-weight: 600;
              font-size: 16px;
            "
            v-if="isBtnShow"
            @click="handleReturnBtn"
            >返回{{ currentPageName }}</Button
          > -->
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import errorImg from '@/assets/images/msg.jpg'
export default {
  name: 'ErrorItem',
  props: {
    height: {
      type: String,
      required: false,
      default: 'calc(100vh - 145px)'
    }
  },
  data() {
    return {
      errorImg
    }
  },
  methods: {}
}
</script>

<style scoped>
.error-box {
  position: relative;
  min-height: 500px;
  width: 75%;
  margin: 10px auto;
  background: #fff;
  border-radius: 10px;
}
.error-box-content {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.img-box {
  width: 372px;
  height: 286px;
}
.error-text {
  text-align: center;
  margin-bottom: 10px;
}
.error-text p {
  line-height: 40px;
  font-size: 22px;
  font-weight: 600;
  color: var(--theme);
  letter-spacing: 2px;
}
.error-btn {
  text-align: center;
}
.error-btn >>> .ivu-btn:hover {
  color: #fff !important;
  border-color: var(--theme);
  background: var(--theme);
}
.error-btn >>> .ivu-btn {
  border-color: var(--theme);
  box-shadow: transparent !important;
}
</style>
