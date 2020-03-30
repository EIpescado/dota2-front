<template>
  <!--找回密码表单-->
  <div class="rp-container">
    <div class="rp-form">
      <h3 class="rp-title">找回密码</h3>
      <el-steps :active="active" align-center class="rp-steps">
        <el-step title="填写帐号" class="rp-step" />
        <el-step title="短信验证" class="rp-step" />
        <el-step title="设置新密码" class="rp-step" />
        <el-step title="完成" class="rp-step" />
      </el-steps>
      <!--第一步-->
      <el-form v-show="active == 1" ref="step1Form" :model="step1Form" :rules="step1Rules" label-width="0px">
        <el-form-item prop="phone">
          <el-input v-model.trim="step1Form.phone" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="validCode">
          <el-row type="flex" :gutter="6">
            <el-col :span="16">
              <el-input v-model="step1Form.validCode" placeholder="验证码" style="width:100%;" clearable />
            </el-col>
            <el-col :span="8">
              <span class="valid-code">
                <img :src="codeUrl" @click="getCode">
              </span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button :loading="step1Loading" :disabled="$isFormReady(step1Form)" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleStep1">下一步</el-button>
        </el-form-item>
      </el-form>
      <!--第二步-->
      <el-form v-show="active == 2" ref="step2Form" :model="step2Form" :rules="step2Rules" label-width="0px">
        <el-form-item prop="phoneValidCode">
          <el-row :gutter="5" type="flex">
            <el-col :span="16">
              <el-input v-model="step2Form.phoneValidCode" clearable placeholder="请输入6位短信验证码" />
            </el-col>
            <el-col :span="8">
              <el-button type="primary" style="width:100%;" :disabled="disabledGetCode" @click="getPhoneValidCode">{{ buttonName }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button :loading="step2Loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleStep2">下一步</el-button>
        </el-form-item>
      </el-form>
      <!--第三步-->
      <el-form v-show="active == 3" ref="step3Form" :model="step3Form" :rules="step3Rules">
        <el-form-item prop="password">
          <el-input v-model.trim="step3Form.password" type="password" clearable placeholder="新密码(由6~18位大小写字母、数字和下划线组成)" />
        </el-form-item>
        <el-form-item prop="reEnterPassword">
          <el-input v-model.trim="step3Form.reEnterPassword" type="password" clearable placeholder="重复密码" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="step3Loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleStep3">确认修改</el-button>
        </el-form-item>
      </el-form>
      <!--完成-->
      <el-row v-show="active == 4" class="back-login-row-step4">
        <el-col :span="12" :offset="6">
          <span class="back-to-login-step4">重置成功,返回
            <el-link type="primary" class="login-link" @click="returnLogin">登录</el-link>
          </span>
        </el-col>
      </el-row>

      <el-row v-show="active !== 4" :gutter="15" type="flex" class="back-login-row">
        <span class="back-to-login">返回</span>
        <el-link type="primary" @click="returnLogin"> 登 录</el-link>
      </el-row>
    </div>
  </div>
</template>
<script>
import { validPassword, validPhone } from '@/utils/validate'
import { validCode, retrievePasswordStep1, retrievePasswordStep2, retrievePasswordStep3, sendMessageAuthCode } from '@/api/auth'
export default {
  name: 'RetrievePassword',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('字母开头,6-18位英文,数字,下划线'))
      } else {
        callback()
      }
    }
    const validatePhoneValidCode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('请输入6位验证码'))
      } else {
        callback()
      }
    }
    const validateRePassword = (rule, value, callback) => {
      if (value !== this.step3Form.password) {
        callback(new Error('前后密码不一致'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入有效手机号'))
      } else {
        callback()
      }
    }
    const validateValidCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('请输入4位验证码'))
      } else {
        callback()
      }
    }
    return {
      active: 1, codeUrl: '',
      step1Loading: false, step1Form: { phone: '', validCode: '', uuid: '' },
      step1Rules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        validCode: [{ required: true, trigger: 'blur', validator: validateValidCode }]
      },
      step2Loading: false, step2Form: { phone: '', phoneValidCode: '' }, disabledGetCode: false, waitTime: 60, buttonName: '获取验证码',
      step2Rules: {
        phoneValidCode: [{ required: true, trigger: 'blur', validator: validatePhoneValidCode }]
      },
      step3Loading: false, step3Form: { phone: '', phoneValidCode: '', password: '', reEnterPassword: '' },
      step3Rules: {
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        reEnterPassword: [{ required: true, trigger: 'blur', validator: validateRePassword }]
      }
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
    getCode() {
      validCode().then(response => {
        this.codeUrl = 'data:image/gif;base64,' + response.byteImg
        this.step1Form.uuid = response.uuid
      })
    },
    handleStep1() {
      this.$refs.step1Form.validate(valid => {
        if (valid) {
          this.step1Loading = true
          retrievePasswordStep1(this.step1Form).then(res => {
            this.active = 2
            this.step1Loading = false
          }).catch(() => {
            this.step1Loading = false
            this.getCode()
          })
        } else {
          return false
        }
      })
    },
    handleStep2() {
      this.$refs.step2Form.validate(valid => {
        if (valid) {
          this.step2Loading = true
          this.step2Form.phone = this.step1Form.phone
          retrievePasswordStep2(this.step2Form).then(res => {
            this.active = 3
            this.step2Loading = false
          }).catch(() => {
            this.step2Loading = false
          })
        } else {
          return false
        }
      })
    },
    handleStep3() {
      this.$refs.step3Form.validate(valid => {
        if (valid) {
          this.step3Loading = true
          this.step3Form.phone = this.step1Form.phone
          this.step3Form.phoneValidCode = this.step2Form.phoneValidCode
          retrievePasswordStep3(this.step3Form).then(res => {
            this.active = 4
            this.$message({
              message: '重置成功!',
              type: 'success',
              duration: '2000'
            })
            this.step3Loading = false
          }).catch(() => {
            this.step3Loading = false
          })
        } else {
          return false
        }
      })
    },
    getPhoneValidCode() {
      if (validPhone(this.step1Form.phone)) {
        sendMessageAuthCode(this.step1Form.phone, 'RP').then(res => {
          this.$message({
            message: '短信已发送至手机,请注意查看!',
            type: 'success',
            duration: '2000'
          })
          this.disabledGetPhoneValidCode()
        }).catch(() => {
          this.disabledGetPhoneValidCode()
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
    },
    returnLogin() {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
<style lang="scss" scope>
.rp-container{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-image: url("../assets/images/backgroud.jpg");
  background-size: cover;
}
.rp-form {
  border-radius: 6px;
  opacity: 1;
  width: 400px;
  // height: 400px;
  background:rgba(0, 0, 0, 0.4);
  filter:Alpha(opacity=80);
  padding: 25px 25px 5px 25px;
  .rp-title { text-align: center; color: #909399; font-size: 20px; font-weight: 500; }
  .rp-steps {
    padding: 20px 0;
    .rp-step { width: 90px; }
  }
  .valid-code { img { height: 40px; cursor: pointer; border-radius: 5px; }}
  .back-login-row-step4{
    padding: 0 0 30px 0;
    text-align: center;
    .back-to-login-step4 {
      color: #909399;
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
      padding-top: 80px;
      font-size: 20px;
      font-weight: 500;
    }
    .login-link {
      font-size: 20px;
      margin-left: 5px;
    }
  }
  .back-login-row {
    float: right;
    padding: 0 10px 30px 0;
    text-align: center;
    font-size: 14px;
    .back-to-login {
      color: #909399;
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
