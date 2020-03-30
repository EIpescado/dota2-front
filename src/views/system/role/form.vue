<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增角色' : '编辑角色'" append-to-body center @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model.trim="form.roleName" />
      </el-form-item>
      <el-form-item label="编码" prop="roleCode">
        <el-input v-model.trim="form.roleCode" :disabled="!isAdd" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model.trim="form.description" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update } from '@/api/role'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    uid: {
      type: String,
      default: ''
    }
  },
  data() {
    const validRoleCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入角色编码'))
      } else if (value.indexOf('ROLE_') === -1) {
        callback(new Error('角色编码请以 ROLE_ 开头'))
      } else if (value.length <= 5) {
        callback(new Error('长度在 6 到 20 个字符'))
      } else {
        callback()
      }
    }
    return {
      dialog: false,
      loading: false,
      form: { roleName: '', roleCode: '', description: '' },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, trigger: ['blur', 'change'], validator: validRoleCode }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit(this.uid)
        } else {
          return false
        }
      })
    },
    doAdd() {
      create(this.form).then(res => {
        this.resetForm()
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.loading = false
        this.$emit('getList')
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit() {
      update(this.uid, this.form).then(res => {
        this.resetForm()
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.loading = false
        this.$emit('getList')
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
    }
  }
}
</script>
