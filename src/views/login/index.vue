<template>
  <div
    class="login"
    :style="{
      backgroundImage: `url(${Background})`
    }"
    v-wechat-title="
      `用户登录${logoOfGetter.titleCn ? ' - ' : '' + logoOfGetter.titleCn}`
    "
  >
    {{ logoOfGetter.titleCn }}
    <Form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h3 class="title">{{ logoOfGetter.titleCn }}</h3>
      <FormItem prop="username">
        <Input
          v-model="loginForm.username"
          type="text"
          placeholder="账号"
          size="large"
          class="input"
        >
          <svg-icon slot="prefix" icon-class="user" class="input-icon" />
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input
          v-model="loginForm.password"
          type="password"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
          size="large"
          class="input"
        >
          <svg-icon slot="prefix" icon-class="password" class="input-icon" />
        </Input>
      </FormItem>
      <FormItem prop="code">
        <div class="code-form">
          <Input
            v-model="loginForm.code"
            placeholder="验证码"
            class="code-input input"
            @keyup.enter.native="handleLogin"
            size="large"
          >
            <svg-icon
              slot="prefix"
              icon-class="validCode"
              class="el-input__icon input-icon"
            />
          </Input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" title="更新验证码" />
          </div>
        </div>
      </FormItem>
      <Checkbox v-model="loginForm.rememberMe" class="checkbox">
        记住我
      </Checkbox>
      <FormItem style="width: 100%">
        <Button
          :loading="isLoading"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
          size="large"
        >
          <span v-if="!isLoading">登 录</span>
          <span v-else>登 录 中...</span>
        </Button>
      </FormItem>
    </Form>
    <!--  底部  -->
    <copyright v-if="copyright" :data="copyright" />
  </div>
</template>

<script>
import Config from '@/settings'
import mixin from '@/mixins/project'

import { getCodeImg } from '@/api/login'

import Cookies from 'js-cookie'

import { encrypt } from '@/utils/rsaEncrypt'
import Background from '@/assets/images/login-background.jpg'
import Copyright from '@/components/Copyright'
import LoaderCircle from '@/components/Loading/LoaderCircle'

export default {
  name: 'Login',
  mixins: [mixin],
  components: {
    Copyright,
    LoaderCircle
  },
  data() {
    return {
      Background,
      codeUrl: '',
      cookiePass: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: true,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      },
      isLoading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    //获取项目组件id
    this.initWidgetConfig()
    // 获取验证码
    this.getCode()
    // 获取用户名密码等Cookie
    this.getCookie()
    // token 过期提示
    this.point()
  },
  methods: {
    async initWidgetConfig() {
      await this.getWidgetConfig()
      const { copyright, logo } = this.widgetIds
      copyright && this.commonWidget('copyright')
      logo && this.commonWidget('logo')
    },
    async getCode() {
      const res = await getCodeImg()
      this.codeUrl = res.img
      this.loginForm.uuid = res.uuid
    },
    getCookie() {
      const username = Cookies.get('username')
      let password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      // 保存cookie里面的加密后的密码
      this.cookiePass = password === undefined ? '' : password
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        username: rememberMe && username ? username : '',
        password,
        rememberMe: rememberMe === undefined ? true : Boolean(rememberMe),
        code: ''
      }
    },
    handleLogin() {
      this.isLoading = true
      this.$refs.loginForm.validate(async valid => {
        if (!valid) {
          this.isLoading = false
          this.$Message.warning('请正确填写')
          return
        }
        const { username, password, rememberMe, code, uuid } = this.loginForm
        const user = {
          username,
          password,
          rememberMe,
          code,
          uuid
        }
        if (user.password !== this.cookiePass) {
          user.password = encrypt(user.password)
        }

        await this.$store.dispatch('Login', user).catch(error => {
          this.isLoading = false
          this.getCode()
        })
        this.isLoading = false
        Cookies.set('username', username)
        Cookies.set('rememberMe', rememberMe, {
          expires: Config.passCookieExpires
        })
        if (rememberMe) {
          Cookies.set('password', user.password, {
            expires: Config.passCookieExpires
          })
        }
        this.$router.push({ path: this.redirect || '/' })
      })
    },
    point() {
      const point = Cookies.get('point') !== undefined
      if (point) {
        this.$Notice.warning({
          title: '提示',
          desc: '当前登录状态已过期，请重新登录！',
          duration: 3
        })
        Cookies.remove('point')
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
  background-position: center bottom;
  background-attachment: fixed;
  background-repeat: no-repeat;
  &-form {
    border-radius: 8px;
    background: #ffffff;
    width: 85%;
    max-width: 385px;
    position: absolute;
    left: 20%;
    top: 50%;
    transform: translateY(-50%);
    padding: 30px 30px 10px 30px;
    .title {
      margin: 0 auto 30px auto;
      text-align: center;
      color: var(--font);
      font-size: 25px;
      letter-spacing: 3px;
      font-weight: 400;
    }
    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
    .input {
      .ivu-input {
        // border-radius: 5px;
      }
    }
    .code-form {
      display: flex;
      justify-content: space-between;
      align-content: center;
      height: 36px;
      .code-input {
        flex: 1;
        .ivu-input-large {
          height: 36px;
        }
      }
      .login-code {
        flex-shrink: 0;
        height: 36px;
        flex: 1;
        display: flex;
        justify-content: flex-end;
        padding-right: 5px;
        img {
          width: 116px;
          height: 100%;
          cursor: pointer;
          vertical-align: middle;
        }
      }
    }
    .checkbox {
      margin: 0 0 20px 0;
      font-size: 15px;
      font-weight: 500;
      color: #525b6e;
    }
  }
  .copyright {
    position: fixed;
    bottom: 10px;
    color: #4168c3;
  }
}

@media screen and ( max-width: 650px ) {
  .login-form {
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
  .code-form {
    justify-content: unset;
  }
  .login {
    background-position: center !important;
  }
}
</style>
