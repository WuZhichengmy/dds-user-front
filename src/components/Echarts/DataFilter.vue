<template>
  <div>
    <div style="text-align:center">
      <button v-on:click="updateGraph">更新</button>
      <button v-on:click="resetFilter">重置</button>
    </div>
    <ol class="list" v-on:update="onFilterUpdate" style="height:160px;overflow-y:scroll;">
      <li class="list-content" v-for="(item, index) in filteredData" :key="index"
          @click="removeItem(index)"
          @mouseenter="mouseEnterLi"
          @mouseleave="mouseLeaveLi"
      >{{ item.name + " : " + item.value }}</li>
    </ol>
  </div>
</template>

<script>
import {deepCopy} from "view-design/src/utils/assist";

export default {
  name: "DataFilter",
  props: {
    shareItem: Object
  },
  data() {
    return {
      // 初始化数据
      originalData: this.sortFilteredData(deepCopy(this.shareItem.data.series.data)),
      filteredData: this.sortFilteredData(this.shareItem.data.series.data),
    };
  },
  methods: {
    // 处理过滤器更新事件
    onFilterUpdate(filteredData) {
      this.filteredData = filteredData;
    },
    // 重置过滤器
    resetFilter() {
      this.shareItem.data.series.data = this.filteredData = deepCopy(this.originalData);
      this.updateGraph();
    },
    // 移除某一项数据
    removeItem(index) {
      this.filteredData.splice(index, 1);
    },
    updateGraph() {
      this.$parent.graph.dataRefresh();
    },
    sortFilteredData(arr) {
      return arr.sort(function (a,b) {
        return b.value - a.value;
      })
    },
    mouseEnterLi(e) {
      e.target.style.textDecoration = "line-through";
    },
    mouseLeaveLi(e) {
      e.target.style.textDecoration = "none";
    },
  },
};
</script>

<style>
.list {
  margin: 10px;
  list-style-type: decimal;
  padding: 8px;
  background-color: #efefef;
}
.list li {
  margin-bottom: 6px;
  margin-left: 10px;
  list-style-position: inside;
  font-size: large;
  cursor: pointer;
  padding: 4px;
}
.list li:hover {
  background-color: #e7e7e7;
}
button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 60px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 16px 8px;
  cursor: pointer;
}
button:hover {
  background-color: #3e8e41;
  text-decoration-line: line-through;
}
button:active {
  background-color: #3e8e41;
  box-shadow: 0 5px #666;
  transform: translateY(2px);
}
</style>
