<template>
  <div>
    <div>
      <graph-chart :theme="theme"
      :share-item="item"
      :config="item.config ? JSON.parse(item.config) : {}" ref="graph"></graph-chart>
    </div>
    <div class="filter-container">
      <data-filter :share-item="item" ref="filter"></data-filter>
    </div><br>
  </div>
</template>

<script>
import GraphChart from "./GraphChart";
import DataFilter from "./DataFilter";

export default {
  name: "GraphEditor",
  components: {
    GraphChart,
    DataFilter,
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    theme: String,
  },
  data() {
    return {
      shareItem: this.item,
    }
  },
  mounted() {
    this.graph = this.$refs.graph;
    this.filter = this.$refs.filter;
  },
  methods: {
  }
}
</script>

<style scoped>
.filter-container {
  float: right;
}
</style>
