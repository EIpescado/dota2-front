<template>
  <div class="login-container">
    <!--登录表单-->
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" label-width="0px">
      <h3 class="login-title">登录</h3>
      <el-form-item prop="username">
        <el-input ref="username" v-model="loginForm.username" placeholder="帐号" type="text" clearable>
          <svg-icon slot="prefix" icon-class="user" />
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="密码" @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" />
        </el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="validCode">
        <el-row :gutter="5" type="flex">
          <el-col :span="16">
            <el-input v-model="loginForm.validCode" placeholder="验证码" clearable @keyup.enter.native="handleLogin">
              <svg-icon slot="prefix" icon-class="validCode" />
            </el-input>
          </el-col>
          <el-col :span="8">
            <span class="login-code">
              <img :src="codeUrl" @click="getCode">
            </span>
          </el-col>
        </el-row>
      </el-form-item>

      <!--登录按钮-->
      <el-form-item>
        <el-button :loading="loading" :disabled="$isFormReady(loginForm)" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>

      <!--找回密码 and 注册-->
      <el-row :gutter="15" type="flex" class="back-register-row">
        <el-col :span="12" class="forget-pwd">
          <el-link type="info" @click="routeRetrievePassword">忘记密码?</el-link>
        </el-col>
        <el-col :span="12" class="register-user">
          <span class="back-to-register">没有账号？马上</span>
          <el-link type="primary" @click="routeRegister">注册</el-link>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>
<script>
import { validCode } from '@/api/auth'
import { requiredNotEmpty } from '@/utils/validate'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      requiredNotEmpty(rule, value, callback, '请输入用户名')
    }
    const validatePassword = (rule, value, callback) => {
      requiredNotEmpty(rule, value, callback, '请输入密码')
    }
    const validateValidCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('请输入4位验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: { username: '', password: '', validCode: '', uuid: '' },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        validCode: [{ required: true, trigger: 'blur', validator: validateValidCode }]
      },
      disabled: true, loading: false, passwordType: 'password', redirect: undefined, codeUrl: ''
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
  metaInfo: {
    meta: [
      { name: 'viewport', content: '' }
    ]
  },
  created() {
    this.getCode()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: '/home' })
            this.loading = false
          }).catch(() => {
            this.loading = false
            this.getCode()
          })
        } else {
          console.log('login error submit!!')
          return false
        }
      })
    },
    getCode() {
      validCode().then(response => {
        this.codeUrl = 'data:image/gif;base64,' + response.byteImg
        this.loginForm.uuid = response.uuid
      })
    },
    routeRetrievePassword() {
      this.$router.push({ path: '/retrievePassword' })
    },
    routeRegister() {
      this.$router.push({ path: '/register' })
    }
  }
}
</script>
<style lang="scss" scope>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-image: url("../assets/images/backgroud.jpg");
  background-size: cover;
}
.login-form {
  border-radius: 6px;
  opacity: 1;
  width: 400px;
  background:rgba(0, 0, 0, 0.4);
  filter:Alpha(opacity=80);
  padding: 25px 25px 5px 25px;
  .login-title { text-align: center; color: #909399; font-size: 20px; font-weight: 500; }
  .login-code {
    width: 100%;
    img{
      height: 40px;
      cursor: pointer;
      border-radius: 5px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 1px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
}
.back-register-row {
  padding: 0 0 30px 0;
  text-align: center;
  font-size: 14px;
  .forget-pwd {
    text-align: left;
  }
  .register-user {
    text-align: right;
    color: #909399;
    .back-to-register {
      display: inline-flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      flex-direction: row;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: center;
      justify-content: center;
      vertical-align: middle;
      position: relative;
      text-decoration: none;
      outline: none;
      padding: 0;
      font-size: 14px;
      font-weight: 500;
    }
  }
}
</style>
