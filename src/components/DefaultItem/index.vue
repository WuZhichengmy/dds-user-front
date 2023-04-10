<template>
  <div class="default-item">
    <div class="default-info">
      <p>
        欢迎使用 <span @click="$router.push('/')">{{ logoOfGetter.titleCn }}</span>
      </p>
      <p>
        您可以通过系统给您提供的各种检索以及辅助分析工具，对查新点的新颖性进行查证。
      </p>
    </div>
    <div class="default-item-header">
      <span>检索说明</span>
    </div>

    <div class="default-rules">
      <div class="default-rules-header"></div>
      <p class="default-rules-items">1. 请至少选择一种资源类型进行检索</p>
      <p class="default-rules-items">
        2. 基本检索: 将检索词与资源类型的所有字段进行匹配。
      </p>
      <p class="default-rules-items">
        3.
        高级检索：支持多组检索词组合生成报告，使用
        <span>"AND"(与)</span>、
        <span>"OR"(或)</span>、
        <span>"NOT"(非)</span>
        逻辑运算符对检索词的关系进行表述。
      </p>
      <!-- <p class="default-rules-items">
        4. 支持多组检索词组合生成报告，使用“AND”（与）、“OR”（或）、“NOT”（非）逻辑运算符对检索词的关系进行表述。
      </p> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DefaultItem',
  props: {
    config: {
      type: Object,
      required: false,
    },
    data: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      info: {},
    }
  },
  computed: {
    ...mapGetters('project', ['logoOfGetter']),
  },
}
</script>

<style lang="scss" scoped>
.default {
  &-item {
    color: var(--font);
    .default-info {
      background: #fff;
      padding: 15px 25px;
      border-bottom: 1px solid #cccccc;
      font-size: 14px;
      line-height: 1.5;
      span {
        color: var(--theme);
        font-weight: 600;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    &-header {
      padding: 0 25px;
      line-height: 45px;
      // border-bottom: 1px solid #f2f2f2;
      background: #fff;
      span {
        display: inline-block;
        font-size: 16px;
        font-weight: 400;
        color: var(--theme);
        position: relative;
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 50%;
          height: 3px;
          background: var(--color);
          transform: translateX(-50%);
        }
      }
    }
    .default-rules {
      padding: 15px 30px;
      background: #f4f4f4;
      &-header {
      }
      &-items {
        font-size: 14px;
        line-height: 1.8;
        span {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
