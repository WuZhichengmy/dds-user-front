<template>
  <div
    class="containter"
    @mouseenter="showDropdown = true"
    @mouseleave="showDropdown = false"
  >
    <div class="content">
      <div class="name-card">
        <span
          class="color"
          :style="{
            background: linearGradient(currentTheme.theme, currentTheme.color)
          }"
        />
        <span class="name">{{ currentTheme.name }}</span>
      </div>
      <div
        :class="['dropdown', showDropdown ? 'active' : '']"
        @mouseenter.native="showDropdown = true"
        @mouseleave="showDropdown = false"
      >
        <div class="dropdown-list">
          <div
            class="dropdown-list-item"
            v-for="(item, index) in themeList"
            @click="changeTheme(item)"
            :key="index + '_themeList'"
          >
            <span
              class="color"
              :style="{
                background: linearGradient(item.theme, item.color)
              }"
            />
            <span class="color-label">
              {{ item.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { eventBus } from '@/main'

export default {
  name: 'ThemeTool',
  props: {},
  data() {
    return {
      show: false,
      themeList: {
        defalut: {
          name: '默认',
          display: '#427DCC',
          theme: '#427DCC',
          color: '#F37860',
          font: '#333',
          page: '#fff',
          'report-page': '#fff',
          header: '#fff',
          'header-nav': '#515a6e',
          'header-nav-actived': '#427dcc',
          'item-title': '#f37860',
          'logo-cn': '#000',
          'logo-en': '##666666',
          background: '#f5f5f5',
          'text-actived': '#5e7fd6',
          'artical-index-actived': '#427dcc',
          'artical-bg': '#e7f1fa',
          'list-title': '#515a6e',
          'list-actived': '#427dcc',
          'list-font': '#515a6e',
          'list-label': '#515a6e',
          'list-bg': '#f8f8f8',
          'page-header-default': '#F5F5F5',
          'page-header-default-color': '#50596C',
          'page-header-fixed': '#fff',
          'footer-bg': '#2E3E52',
          'footer-color': '#fff',
          category: '#83bff6',
          category2: '#188df0',
          'search-checkbox': '#EA9817'
        },
        // skyBlue: {
        //   name: '藏青',
        //   display: '#2D8CF0',
        //   theme: '#133E6A',
        //   color: '#CACFB9',
        //   font: '#000',
        //   page: '#fff',
        //   'report-page': '#fff',
        //   header: '#fff',
        //   'header-nav': '#515a6e',
        //   'header-nav-actived': '#2D8CF0',
        //   'item-title': '#f37860',
        //   'logo-cn': '#000',
        //   'logo-en': '#515A6E',
        //   background: '#E5E8FB',
        //   'text-actived': '#427DCC',
        //   'artical-index-actived': '#F37860',
        //   'page-header-default': '#F5F5F5',
        //   'page-header-default-color': '#50596C',
        //   'page-header-fixed': '#fff',
        //   'footer-bg': '#B1B5A2',
        //   'footer-color': '#fff',
        //   category: '#2980b9',
        //   category2: '#188df0',
        //   'search-checkbox': '#EA9817'
        // },
        green: {
          name: '墨绿',
          display: '#215643',
          theme: '#215643',
          color: '#AE2536',
          font: '#50596C',
          'report-page': '#fff',
          header: '#fff',
          'header-nav': '#515a6e',
          'header-nav-actived': '#215643',
          'item-title': '#E08F32',
          'logo-cn': '#333',
          'logo-en': '#6B7383',
          background: '#E5E8FB',
          'text-actived': '#B73A46',
          'artical-index-actived': '#BF3D49',
          'artical-bg': '#e7f1fa',
          'list-title': '#215643',
          'list-actived': '#BF3D49',
          'list-font': '#515a6e',
          'list-label': '#515a6e',
          'list-bg': '#f8f8f8',
          'page-header-default': '#DCDEE2',
          'page-header-default-color': '#50596C',
          'page-header-fixed': '#fff',
          'footer-bg': '#50596C',
          'footer-color': '#fff',
          category: '#C12E34',
          category2: '#C12E34',
          'search-checkbox': '#EA9817'
        },
        blue: {
          name: '藏青',
          display: '#005397',
          theme: '#0061a5', //#0061a5 //0061a5
          color: '#E13334',
          font: '#2a2a2a',
          page: '#fff',
          'report-page': '#fff',
          header: '#fff',
          'header-nav': '#000000',
          'header-nav-actived': '#005397',
          'item-title': '#E13334',
          'logo-cn': '#005397',
          'logo-en': '#666666',
          background: '#EAEAEA',
          'text-actived': '#E13334',
          'artical-index-actived': '#E13334',
          'footer-bg': '#005397',
          'footer-color': '#fff',
          category: '#C12E34',
          category2: '#C12E34',
          'search-checkbox': '#EA9817'
        }
      },
      currentTheme: {},
      showDropdown: false
    }
  },
  computed: {
    linearGradient() {
      return (c1, c2) => {
        return `linear-gradient(
        135deg,
        ${c1} 0%,
        ${c1} 50%,
        ${c2} 51%,
        ${c2} 100%
      )`
      }
    }
  },
  mounted() {
    this.initTheme()
  },
  methods: {
    setProperty(obj) {
      let arr = Object.keys(obj)
      if (arr && arr.length > 0) {
        arr.map(item => {
          if (item !== 'name' && item !== 'chart') {
            document.body.style.setProperty('--' + item, obj[item])
          }
        })
      }
    },
    initTheme() {
      const theme = Vue.ls.get('system_theme')
      this.changeTheme(theme ? theme : this.themeList.defalut)
    },
    changeTheme(theme) {
      this.currentTheme = theme
      this.setProperty(theme)
      const { category, category2 } = theme
      eventBus.$emit('on-category-theme-change', {
        category,
        category2
      })
      Vue.ls.set('system_theme', theme)
    }
  }
}
</script>

<style lang="scss" scoped>
.containter {
  height: var(--line-1);
  display: flex;
  align-items: center;
  line-height: initial;
  position: relative;
  // margin: 0 10px;
  .content {
    position: relative;
    border: 1px solid #fff;
    padding: 5px;
    border-radius: 2px;
    cursor: pointer;
    .color {
      width: 13px;
      height: 13px;
      vertical-align: middle;
      border: 1px solid #fff;
    }
    .name-card {
      display: flex;
      align-items: center;
      .name {
        color: #fff;
        font-size: 13px;
        margin-left: 5px;
        vertical-align: middle;
      }
    }
    &:hover {
      .dropdown {
        pointer-events: initial;
        opacity: 1;
        transform: translateY(0);
      }
    }
    .dropdown {
      position: absolute;
      top: 150%;
      left: 0;
      width: 140px;
      transition: 0.6s;
      transform: translateY(10px);
      opacity: 0;
      z-index: 999;
      pointer-events: none;
      &.active {
        pointer-events: initial;
        opacity: 1;
        transform: translateY(0);
      }
      &::after {
        content: '';
        position: absolute;
        top: -7px;
        left: 5px;
        width: 15px;
        height: 15px;
        border: 1px solid #eee;
        transform: rotate(45deg);
        z-index: 4;
        background: #fff;
      }
      &::before {
        content: '';
        position: absolute;
        top: -15px;
        left: 0;
        width: 100%;
        height: 120%;
        z-index: 4;
        opacity: 0;
        background: #fff;
      }
      &-list {
        border: 1px solid #eee;
        position: relative;
        z-index: 6;
        &-item {
          display: flex;
          position: relative;
          align-items: center;
          background: #fff;
          line-height: 40px;
          padding: 0 8px;
          cursor: pointer;
          font-weight: 300;
          &:not(:last-child) {
            border-bottom: 1px solid #dedede;
          }
          .color-label {
            color: #000;
            letter-spacing: 2px;
            margin-left: 4px;
          }
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            z-index: 8;
            transition: width 0.8s;
            transform: translateX(-50%);
            background: #000;
          }
          &:hover {
            &::after {
              width: 80%;
            }
          }
        }
      }
    }
  }
}
</style>

<style>
.theme-tool {
  height: auto;
}
.theme-tool-wrapper {
  position: relative;
  border: 1px solid #d6d6d6;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-content: center;
  background: transparent;
  cursor: pointer;
  line-height: 1;
  height: inherit;
  margin: auto 0;
  padding: var(--theme-padding);
}
.theme-icon {
  width: 16px;
  height: 16px;
  border: 1px solid #fff;
}
.theme-text {
  color: var(--font-color-default);
  margin-left: 6px;
  font-size: 16px;
}
.color-card * {
  display: none;
}
.color-card {
  position: absolute;
  bottom: -175px;
  left: 50%;
  transform: translateX(-50%);
  transition: transform 0.3s;
  background: #fff;
  line-height: 35px;
  z-index: 1000;
}
.color-card-show::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #fff;
}
.color-card-show {
  border: 1px solid #dcdee2;
  padding: 10px;
  transform: translateX(-50%) translateY(-10px);
  width: 120px;
  height: fit-content;
}
.color-card-show span {
  display: inline-block;
}
.color-card-show div {
  display: block;
}
.theme-tool-content {
  position: relative;
}
.theme-tool-content:hover::before {
  width: 60%;
}
.theme-tool-content::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: #50596c;
  transition: width 0.3s;
}
.theme-tool-label {
  color: #515a6e;
  font-size: 16px;
  font-weight: 600;
  vertical-align: middle;
}
.theme-tool-item {
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

@media screen and (max-width: 500px) {
  .main .header-theme-tool {
    display: none;
  }
}
</style>

<style>
body {
  --theme: #427dcc;
  --color: #f37860;
  --font: #515a6e;
  --page: #fff;
  --report-page: #fff;
  --header: #fff;
  --header-nav: #515a6e;
  --header-nav-actived: #427dcc;
  --item-title: #f37860;
  --logo-cn: #427dcc;
  --logo-en: #427dcc;
  --background: #f5f5f5;
  --text-actived: #5e7fd6;
  --artical-index-actived: #427dcc;
  --artical-bg: #e7f1fa;
  /* listItem */
  --list-title: #515a6e;
  --list-actived: #427dcc;
  --list-font: #515a6e;
  --list-label: #515a6e;
  --list-bg: #f8f8f8;
  /* page-header */
  --page-header-default: #f5f5f5;
  --page-header-default-color: #50596c;
  --page-header-fixed: #fff;
  /* footer */
  --footer-bg: #32476b;
  --footer-color: #fff;
}
body {
  background: var(--theme);
}
.header-fixed .theme-text {
  color: var(--header-nav-actived);
}
.theme-tool {
  background: var(--primary);
}
</style>
