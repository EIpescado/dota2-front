<template>
  <div class="register-container">
    <!--登录表单-->
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" label-width="0px">
      <h3 class="register-title">注册</h3>
      <el-form-item prop="username">
        <el-input v-model.trim="registerForm.username" placeholder="手机号" />
      </el-form-item>
      <el-form-item prop="validCode">
        <el-row :gutter="5" type="flex">
          <el-col :span="16">
            <el-input v-model="registerForm.validCode" placeholder="请输入6位短信验证码" clearable />
          </el-col>
          <el-col :span="8">
            <el-button type="primary" :disabled="disabledGetCode" class="register-code" @click="getPhoneValidCode">{{ buttonName }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model.trim="registerForm.password" type="password" placeholder="密码(由6~18位大小写字母、数字和下划线组成)" clearable />
      </el-form-item>
      <el-form-item prop="reEnterPassword">
        <el-input v-model.trim="registerForm.reEnterPassword" type="password" placeholder="重复密码" clearable />
      </el-form-item>

      <el-form-item>
        <el-button :loading="registerLoading" :disabled="$isFormReady(registerForm)" size="medium" type="primary" style="width:100%;" @click="handleRegister">
          <span v-if="!registerLoading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
      </el-form-item>

      <el-row :gutter="15" type="flex" class="back-register-row">
        <el-col :span="12" />
        <el-col :span="12" class="register-user">
          <span class="back-to-login">已有账号？马上</span>
          <el-link type="primary" @click="returnLogin">登录</el-link>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>
<script>
import { sendMessageAuthCode } from '@/api/auth'
import { validPhone, validPassword } from '@/utils/validate'
export default {
  name: 'Register',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入有效手机号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('字母开头,6-18位英文,数字,下划线'))
      } else {
        callback()
      }
    }
    const validateValidCode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('请输入6位验证码'))
      } else {
        callback()
      }
    }
    const validateRePassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('前后密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerLoading: false,
      registerForm: { username: '', password: '', reEnterPassword: '', validCode: '' },
      registerRules: {
        username: [{ required: true, trigger: 'blur', validator: validatePhone }],
        validCode: [{ required: true, trigger: 'blur', validator: validateValidCode }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        reEnterPassword: [{ required: true, trigger: 'blur', validator: validateRePassword }]
      },
      buttonName: '获取验证码', disabledGetCode: false, waitTime: 60
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
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.registerLoading = true
          this.$store.dispatch('user/register', this.registerForm).then(() => {
            this.$message({
              message: '恭喜注册成功!正在为您自动登录....',
              type: 'success',
              duration: '2000'
            })
            setTimeout(() => {
              this.$router.push({ path: '/home' })
            }, 2000)
          }).catch(() => {
            this.registerLoading = false
          })
        } else {
          return false
        }
      })
    },
    showForgetPwd() {
      this.$router.push({ path: '/retrievePassword' })
    },
    returnLogin() {
      this.$router.push({ path: '/login' })
    },
    getPhoneValidCode() {
      const currentPhone = this.registerForm.username
      if (validPhone(currentPhone)) {
        sendMessageAuthCode(currentPhone, 'R').then(res => {
          this.$message({
            message: '短信已发送至手机,请注意查看!',
            type: 'success',
            duration: '2000'
          })
          this.disabledGetPhoneValidCode()
        }).catch(() => {
        })
      } else {
        this.$message({
          message: '请输入有效手机号!',
          type: 'warning',
          duration: '2000'
        })
      }
    },
    disabledGetPhoneValidCode() {
      const me = this
      me.disabledGetCode = true
      const interval = window.setInterval(function() {
        me.buttonName = '(' + me.waitTime + '秒)'
        --me.waitTime
        if (me.waitTime < 0) {
          me.buttonName = '重新发送'
          me.waitTime = 60
          me.disabledGetCode = false
          window.clearInterval(interval)
        }
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scope>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-image: url("../assets/images/backgroud.jpg");
  background-size: cover;
}
.register-form {
  border-radius: 6px;
  opacity: 1;
  width: 400px;
  background:rgba(0, 0, 0, 0.4);
  filter:Alpha(opacity=80);
  padding: 25px 25px 5px 25px;
  .register-title { text-align: center; color: #909399; font-size: 20px; font-weight: 500; }
  .register-code {
    width: 100%;
    text-align: center;
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
    .back-to-login {
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
