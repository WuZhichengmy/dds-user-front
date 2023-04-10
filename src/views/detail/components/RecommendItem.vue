<template>
  <div class="recommend-item">
    <div class="list-wrapper">
      <div
        class="list-content"
        v-for="(item, index) in data"
        :key="index + '_recommendItem'"
      >
        <div
          class="list-content-default line-clamp-2"
          @click="clickItem(item)"
        >
          <div class="list-index">
            <Icon type="md-square" class="list-icon" style="color: #e2e2e2" />
          </div>
          <div class="list-text">
            <div class="list-text-title">
              {{ item.title }}
            </div>
          </div>
        </div>
        <!-- <div
          class="list-content-default line-clamp"
        >
          <div class="list-index">
            <Icon
              type="md-square"
              class="list-icon"
              style="color: var(--artical-index-actived)"
            />
          </div>
          <div class="list-text">
            <div class="list-text-title">
              {{ item.title }}
            </div>
            <div class="list-content-footer">
              <span class="list-content-footer-right" style="float: right">{{
                item.date ? item.date : ''
              }}</span>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecommendItem',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showIndex: 0,
    }
  },
  methods: {
    clickItem(data) {
      this.$emit('on-click', data)
    }
  },
}
</script>

<style scoped>
.list-wrapper {
  padding: 10px 12px;
  height: fit-content;
  font-size: 14px;
}
.list-content {
  padding: 4px 0;
  border-bottom: 1px dotted #dcdee2;
}
.list-content-default {
  display: flex;
  padding: 2px 0;
  line-height: 1.5;
  border-bottom: 1px dotted #dedede;

}
.list-content:hover .list-text-title {
  color: var(--text-actived);
}
.list-index {
  width: 15px;
  margin-right: 5px;
}
.list-icon {
  font-size: 12px;
  color: #e2e2e2;
  transition: color 0.5s;
}
.list-text {
  flex: 1;
}
.list-text-title {
  color: var(--font);
  width: 100%;
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  transition: .8s;

}
.line-clamp .list-text-title {
  color: var(--text-actived);
  font-weight: 600;
}
.line-clamp-2 .list-text-title {
  -webkit-line-clamp: 2;
}
.line-clamp .list-text-title {
  -webkit-line-clamp: 0;
}

.list-content-footer {
  width: 100%;
  height: 30px;
  line-height: 35px;
  color: #515a6e;
  font-weight: 500;
}
.slide-updown-enter-active {
  transition: all 0.6s ease;
}
.slide-updown-leave-active {
  /* transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0); */
  transition: all 0s;
}
.slide-updown-enter {
  height: 0;
  /* transform: translateX(10px); */
  /* opacity: 0; */
}
.slide-updown-leave-to {
  height: 0;

  /* transform: translateY(-10px); */
  /* opacity: 0; */
}
</style>
