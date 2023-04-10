<template>
  <div class="user">
    <div class="user-content drawer" v-if="screenWidth <= 500">
      <Icon type="md-contact" />
      <template v-if="getToken()">
        <span class="f-w">{{ username }}</span>
        <span @click="logout" class="btn">注销</span>
      </template>
      <template v-else>
        <span @click="login" class="btn">登 录</span>
      </template>
    </div>

    <Dropdown transfer trigger="hover" class="user-dropdown" v-else>
      <div class="user-content cursor" @click="!getToken() ? login() : null">
        <Icon type="md-contact" class="v-a-m" />
        <span class="name f-w v-a-m">
          <span v-if="getToken()" title="用户名">{{ username }}</span>
          <span v-else title="去登录">登 录</span>
        </span>
      </div>
      <DropdownMenu slot="list" v-if="getToken()">
        <DropdownItem disabled>
          <div class="dropdown-item-user">用户名: {{ username }}</div>
        </DropdownItem>
        <DropdownItem divided>
          <div @click="logout">
            <Icon type="md-exit" />
            注销
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import screenMixin from '@/mixins/screen'
import Cookies from 'js-cookie'
import { getToken } from '@/utils/auth'

export default {
  name: 'User',
  mixins: [screenMixin],
  props: {
    config: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      username: ''
    }
  },
  mounted() {
    this.username = Cookies.get('username') ? Cookies.get('username') : ''
  },
  methods: {
    getToken,
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        this.$Message.info('登出账号成功')
        location.reload()
      })
    },
    login() {
      this.$router.push({
        path: '/login',
        query: {
          redirect: this.$route.fullPath
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.user {
  &-content {
    &.drawer {
      color: #fff;
      display: flex;
      font-size: 16px;
      align-self: center;
      line-height: unset;
      i {
        line-height: unset;
        font-size: 16px;
      }
      span {
        font-size: 16px;
        margin: 0 5px;
      }
      .btn {
        padding: 0 15px;
        background: #fff;
        color: var(--font);
        font-weight: 600;
        border-radius: 15px;
        cursor: pointer;
        font-size: 15px;
        &:hover {
          color: var(--theme);
        }
      }
    }
    span {
      font-size: 14px;
    }
    .dropdown-item-user {
      max-width: 120px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  &-dropdown {
    .user-content {
      span,
      i {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
      }
      .dropdown-item-user {
      }
    }
  }
}
</style>

<style lang="scss">
// @media screen and (min-width: 501px) {
//   .user-content {
//     &.drawer {
//       display: none !important;
//     }
//   }
//   .user-dropdown {
//     display: flex;
//   }
// }
// @media screen and (max-width: 500px) {
//   .user-content {
//     &.drawer {
//       display: flex !important;
//     }
//   }
//   .user-dropdown {
//     display: none;
//   }
// }
</style>
