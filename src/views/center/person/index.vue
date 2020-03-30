<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="我的头像" name="myAvatar">
        <el-row>
          <el-avatar v-if="!avatar || avatar === ''" :src="defaultUserLogo" :size="80" />
          <el-avatar v-else :src="avatar" :size="80" />
        </el-row>
        <el-row>
          <el-button type="primary" size="mini" round @click="toggleShow">更换头像</el-button>
        </el-row>
        <my-upload v-model="show" field="avatarFile" img-format="png" url="/api/systemUser/uploadAvatar" :headers="headers" :params="uploadParams" @src-file-set="srcFileSet" @crop-upload-success="cropUploadSuccess" />
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="changePassword">
        <el-row type="flex">
          <el-col :span="6">
            <el-form ref="changePasswordPform" :model="changePasswordPform" :rules="passwordRules" size="mini" label-width="80px">
              <el-form-item label="旧密码" prop="originalPassword">
                <el-input v-model="changePasswordPform.originalPassword" type="password" />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="changePasswordPform.newPassword" type="password" />
              </el-form-item>
              <el-form-item label="新密码" prop="reEnterNewPassword">
                <el-input v-model="changePasswordPform.reEnterNewPassword" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" round @click="changePwd">修改</el-button>
                <el-button size="small" round @click="cancelChangePassword">取消</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- <el-tab-pane label="设置" name="setting">设置,待开发</el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { changePassword } from '@/api/user'
import myUpload from 'vue-image-crop-upload'
import { tokenHeaderName } from '@/settings'
import defaultUserLogo from '@/assets/images/default-user-logo.jpg'
export default {
  name: 'Person',
  components: { myUpload },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码最少6位'))
      } else {
        callback()
      }
    }
    const validateRePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码最少6位'))
      } else {
        if (this.changePasswordPform.newPassword !== this.changePasswordPform.reEnterNewPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
    }
    return {
      activeName: 'myAvatar', defaultUserLogo: defaultUserLogo,
      changePasswordPform: { originalPassword: '', newPassword: '', reEnterNewPassword: '' },
      passwordRules: {
        originalPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        reEnterNewPassword: [{ required: true, trigger: 'blur', validator: validateRePassword }]
      },
      show: false,
      tokenHeaderName: tokenHeaderName,
      headers: {}, uploadParams: { fileName: '' }
    }
  },
  computed: {
    ...mapGetters([
      'sexOptions',
      'user',
      'avatar',
      'token'
    ])
  },
  created() {
    this.headers[this.tokenHeaderName] = this.token
  },
  methods: {
    changePwd() {
      this.$refs.changePasswordPform.validate(valid => {
        if (valid) {
          changePassword(this.changePasswordPform).then(() => {
            this.$message({
              message: '修改成功,请重新登录',
              type: 'success'
            })
            this.$store.dispatch('user/logout')
            this.$router.push('/login')
          })
        } else {
          return false
        }
      })
    },
    cancelChangePassword() {
      this.$refs.changePasswordPform.resetFields()
    },
    toggleShow() {
      this.show = !this.show
    },
    cropUploadSuccess(jsonData, field) {
      this.show = false
      if (jsonData.code === '0') {
        this.$store.dispatch('user/uploadAvatar', jsonData.res)
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      } else {
        this.$message.error(jsonData.message)
      }
    },
    srcFileSet(fileName, fileType, fileSize) {
      this.uploadParams.fileName = fileName
    }
  }
}
</script>
