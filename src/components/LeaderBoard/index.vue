<template>
  <div class="leader-board">
    <div class="leader-board-wrapper">
      <div
        class="leader-board-column"
        v-for="n in currentColumn(config.column)"
        :key="n + '_leaderBoard'"
      >
        <div
          class="leader-board-items"
          v-for="(item, index) in displayData(currentColumn(config.column), n)"
          :key="item.id + '_leaderBoard'"
          @click="handleClickItem(item.id)"
        >
          <div :class="['index', { active: ranking(index, n) <= 3 }]">
            {{ ranking(index, n) }}
          </div>
          <div
            class="leader-board-items-text"
            :title="item.title"
            :style="{ '-webkit-line-clamp': config.clamp }"
          >
            <span>{{ item.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeaderBoard',
  data() {
    return {}
  },
  props: {
    data: Array,
    config: {
      type: Object,
      required: false,
      default: () => {
        return {
          clamp: 1,
          column: 2
        }
      }
    },
    resourceId: {
      type: String,
      required: false
    }
  },
  computed: {
    displayData() {
      return (column, n) => {
        const { data, row } = this
        if (column === 1) {
          return data
        }
        const start = (n - 1) * row
        const end = row * n
        return this.data.slice(start, end)
      }
    },
    ranking() {
      return (index, n) => {
        return index + 1 + (n - 1) * this.row
      }
    },
    row() {
      return Math.ceil(this.data.length / this.config.column)
    },
    currentColumn() {
      return column => {
        const { USER_AGENT } = this
        return USER_AGENT === 'mobile' ? 1 : column
      }
    }
  },
  methods: {
    handleClickItem(id) {
      this.$emit('on-click-item', {
        resourceId: this.resourceId,
        id
      })
    }
  }
}
</script>

<style scoped lang="scss">
.leader {
  &-board {
    padding: 8px 0;
    &-wrapper {
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
    }
    &-column {
      flex: 1;
    }
    &-items {
      width: 100%;
      display: flex;
      align-self: center;
      padding: 5px;
      border-bottom: 1px dashed #e8eaec;
      &:last-child {
        border-bottom: none;
      }
      .index {
        font-weight: 400;
        text-align: center;
        width: 20px;
        height: 20px;
        line-height: 20px;
        background: #e8eaec;
        color: var(--font);
        font-size: 12px;
        border-radius: 5px;
        transition: background 0.5s;
        &.active {
          background: var(--color);
          color: #fff;
        }
      }
      &-text {
        margin-left: 8px;
        transition: color 0.5s;
        line-height: 25px;
        flex: 1;
        color: var(--font);
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        span {
          font-size: 14px;
          vertical-align: middle;
          &:hover {
            color: var(--color);
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
