<template>
  <div class="simple-search" v-if="show">
    <Input
      v-model="keyword"
      size="large"
      class="input"
      @on-enter="handleSearchBtnClick"
    >
      <Select v-model="selection" slot="prepend" style="min-width: 100px">
        <Option value="all">全部</Option>
        <Option :value="item.id" v-for="item in resources" :key="item.id">
          {{ item.name }}
        </Option>
      </Select>
      <Button
        slot="append"
        icon="ios-search"
        title="检索"
        @click="handleSearchBtnClick"
      />
    </Input>
    <div class="label" @click="handleSearchBtnClick(1)">高级检索</div>
  </div>
</template>

<script>
import mixin from '../mixins/index'
import projectMixin from '@/mixins/project'

export default {
  mixins: [mixin, projectMixin],
  data() {
    return {
      selection: 'all',
      keyword: '',
      resourceIds: [],
      show: false,
      whiteList: ['Detail', 'List']
    }
  },
  computed: {},
  watch: {
    $route: {
      handler(n) {
        this.show = this.whiteList.includes(n.name) ? true : false
        this.selection = 'all'
        this.keyword = ''
        this.resourceIds = []
      },
      immediate: true
    }
  },
  methods: {
    handleSearchBtnClick(type) {
      const { selection, resources } = this
      this.resourceIds = !selection
        ? []
        : selection === 'all'
        ? resources.map(item => item.id)
        : [selection]
      const mode = type === 1 ? 'advanced' : 'base'
      this.$router.push({
        name: 'Search',
        params: { mode },
        query: { searchId: this.setQuery() }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.simple-search {
  flex: 1;
  max-width: 600px;
  display: flex;
  align-items: center;
  margin: 0 15px;
  .input {
    color: var(--font);
  }
  .label {
    color: var(--font);
    width: 5em;
    font-size: 14px;
    margin-left: 5px;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
