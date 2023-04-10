<template>
  <div class="anchor-item">
    <Anchor
      show-ink
      :affix="false"
      v-if="data && data.length > 0"
    >
      <template v-for="(item, index) in data">
        <AnchorLink
          :key="item.id"
          :title="item.title"
          @click.native.stop="handleCilckLink(item)"
          class="anchor-link-level-1"
        >
          <template v-for="(items, index) in item.children">
            <AnchorLink
              :key="items.id"
              @click.native.stop="handleCilckLink(items)"
              :title="items.title"
              class="anchor-link-level-2"
            />
          </template>
        </AnchorLink>
      </template>
    </Anchor>
    <empty v-else />
  </div>
</template>

<script>
import Empty from '@/components/Error/Empty'

export default {
  name: 'AnchorItem',
  components: { Empty },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    href() {
      return (link) => {
        const { path, query } = this.$route
        const { href } = this.$router.resolve({
          path,
          query,
          hash: link.id,
        })
        return href
      }
    },
  },
  mounted() {},
  methods: {
    handleCilckLink({id}) {
      const containter = document.getElementById(id)
      if(!containter) return
      containter.scrollIntoView({
        behavior: 'smooth'
      })
    }
  },
}
</script>

<style lang="scss">
.anchor-item {
  width: 100%;
  padding: 10px 8px;
}
.ivu-anchor-link {
  a {
    padding: 2px 0;
    font-size: 14px;
  }
}
</style>

<style>
.anchor-link-level-1 > .ivu-anchor-link-title {
  font-size: 14px;
}

.anchor-link-level-2 > .ivu-anchor-link-title {
  font-size: 14px;
}
.ivu-anchor-link-title {
  font-size: 15px;
  color: var(--font) !important;
}

.ivu-anchor-link-active > .ivu-anchor-link-title {
  font-weight: 600;
  color: var(--theme) !important;
}
.ivu-anchor-link {
  transition: background 0.3s;
}
.ivu-affix .ivu-anchor-link {
  background: var(--report-page);
}
</style>
