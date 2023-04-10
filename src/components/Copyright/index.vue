<template>
  <div class="copyright">
    <span :title="copyrightOfGetter.copyright">
      {{ copyrightOfGetter.copyright }}</span
    >
    <span
      v-if="
        copyrightOfGetter.record.trim() && copyrightOfGetter.domainRecord.trim()
      "
    >
      <span class="underline" :title="copyrightOfGetter.record">{{
        copyrightOfGetter.record
      }}</span>
      <span> | </span>
      <span class="underline" :title="copyrightOfGetter.domainRecord">{{
        copyrightOfGetter.domainRecord
      }}</span>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Copyright',
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters('project', ['copyrightOfGetter'])
  }
}
</script>

<style scoped lang="scss">
.copyright {
  letter-spacing: 1px;
  color: var(--footer-color);
  font-size: 13px;
  display: flex;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  font-family: Arial, serif;
  .underline {
    text-decoration: underline;
    font-size: 12px;
  }
}
</style>
