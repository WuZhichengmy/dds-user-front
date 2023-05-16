<template>
  <div>
    <div>
      <img class="update-button" v-on:click="updateGraph" src="@/assets/images/update.png" alt="更新" title="更新">
      <img class="update-button" v-on:click="filterValue" src="@/assets/images/filter.png" alt="过滤" title="过滤">
      <img class="update-button" v-on:click="resetFilter" src="@/assets/images/reset.png" alt="重置" title="重置">
    </div>
    <div v-if="showSliderPage" class="floating-list">
      <div class="slider-container">
        <label for="slider1" style="max-width:90px; display: inline-block">关系值下限 : {{ linkValue }}</label>
        <input id="slider1" type="range"
               :min="minLinkValue"
               :max="maxLinkValue"
               v-model="linkValue">
      </div>
      <div class="slider-container">
        <label for="slider2" style="max-width:90px; display: inline-block">结点值下限 : {{ nodeValue }}</label>
        <input id="slider2" type="range"
               :min="minNodeValue"
               :max="maxNodeValue"
               v-model="nodeValue">
      </div>
      <button class="apply-button" v-on:click="applySlider">应用</button>
      <button class="close-button" v-on:click="closeSlider">关闭</button>
    </div>
    <div v-if="showList" class="floating-list">
      <div>
        <input class="input" type="text" v-model="filterKeyword" placeholder="输入关键词进行搜索">
        <button class="search-button" v-on:click="searchList">搜索</button>
      </div>
    <ol class="list" v-on:update="onFilterUpdate">
      <li class="list-content" v-for="(item, index) in filteredData" :key="index"
          @click="removeItem(index)"
          @mouseenter="mouseEnterLi"
          @mouseleave="mouseLeaveLi"
          :class="{ 'highlight': filterKeyword && item.name.includes(filterKeyword) }"
      >{{ item.name + " : " + item.value }}</li>
    </ol>
      <button class="apply-button" v-on:click="applyFloatingList">应用</button>
      <button class="close-button" v-on:click="closeFloatingList">关闭</button>
  </div>
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

      showSliderPage: false,
      minLinkValue:this.getMinElem(this.sortDesc(this.shareItem.data.series.links)),
      maxLinkValue:this.getMaxElem(this.sortDesc(this.shareItem.data.series.links)),
      minNodeValue:this.getMinElem(this.sortDesc(this.shareItem.data.series.data)),
      maxNodeValue:this.getMaxElem(this.sortDesc(this.shareItem.data.series.data)),
      linkValue: this.getMinElem(this.sortDesc(this.shareItem.data.series.links)),
      nodeValue: this.getMinElem(this.sortDesc(this.shareItem.data.series.data)),

      filterKeyword: '',
      showList: false,
      // 初始化数据
      originalData: this.sortDesc(deepCopy(this.shareItem.data.series.data)),
      // filteredData 是与echarts表关联的数据
      filteredData: this.sortDesc(this.shareItem.data.series.data),

      originalLinkData: deepCopy(this.shareItem.data.series.links),
      filteredLinkData: this.shareItem.data.series.links,
    };
  },
  methods: {
    filterValue() {
      this.showSliderPage = true;
    },
    closeSlider() {
      this.showSliderPage = false;
    },
    applySlider() {
      for (let i = this.filteredData.length - 1; i >= 0; i--) {
        if (this.filteredData[i].value < this.nodeValue) {
          this.filteredData.splice(i, 1);
        }
      }
      for (let i = this.filteredLinkData.length - 1; i >= 0; i--) {
        if (this.filteredLinkData[i].value < this.linkValue) {
          this.filteredLinkData.splice(i, 1);
        }
      }
      this.refreshChart();
      this.showSliderPage = false;
    },

    searchList() {
      const keyword = this.filterKeyword.trim()
      const listItems = document.querySelectorAll('.list-content')
      if (keyword) {
        let matchFound = false
        for (let i = 0; i < listItems.length; i++) {
          const item = listItems[i]
          if (item.innerText.includes(keyword)) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            matchFound = true
            break
          }
        }
        if (!matchFound) {
          alert('没有找到匹配项')
        }
      } else {
        alert('请输入关键词')
      }
    },

    applyFloatingList() {
      this.refreshChart();
      this.closeFloatingList();
    },
    refreshChart() {
      this.$parent.graph.dataRefresh();
    },
    closeFloatingList() {
      this.showList = false;
    },
    // 处理过滤器更新事件
    onFilterUpdate(filteredData) {
      this.filteredData = filteredData;
    },
    // 重置过滤器
    resetFilter() {
      this.shareItem.data.series.data = this.filteredData = deepCopy(this.originalData);
      this.shareItem.data.series.links = this.filteredLinkData = deepCopy(this.originalLinkData);
      this.linkValue = this.minLinkValue;
      this.nodeValue = this.minNodeValue;
      this.refreshChart();
    },
    // 移除某一项数据
    removeItem(index) {
      this.filteredData.splice(index, 1);
    },
    updateGraph() {
      this.showList = true;
    },
    sortDesc(arr) {
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
    getMaxElem(arr) {
      return this.sortDesc(arr)[0].value;
    },
    getMinElem(arr) {
      return this.sortDesc(arr)[arr.length - 1].value;
    }
  },
};
</script>

<style>
.list {
  margin: 10px;
  list-style-type: decimal;
  padding: 8px;
  background-color: #efefef;
  height:280px;
  overflow-y:scroll;
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
  padding: 10px 40px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 16px 8px;
  cursor: pointer;
  max-height: 40px;
  max-width: 150px;
  min-height: 40px;
  min-width: 100px;
}
button:hover {
  background-color: #3e8e41;
}
button:active {
  background-color: #3e8e41;
  transform: scale(90%);
}
.floating-list {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid black;
  padding: 10px;
}
.close-button {
  background-color: #ff4c4c;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
}
.close-button:hover {
  background-color: #b02929;
}
.reset-button {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
}
.update-button {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.update-button:hover {
  transform: scale(120%);
}
.highlight {
  background-color: #ffff7e;
}
.input {
  padding: 10px;
  height: 40px;
}
.search-button {
  background-color: #4480ff;
  padding: 10px 50px;
}
.search-button:hover {
  background-color: #2b4f9d;
}
.slider-container {
  padding: 20px;
}
.apply-button {
  background-color: #fc7a44;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
}
.apply-button:hover {
  background-color: #9a492a;
}
</style>
