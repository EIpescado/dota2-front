<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新配置' : '编辑配置'" center @close="cancel">
    <el-form ref="form" :model="form" size="small" label-width="80px">
      <el-form-item label="配置名称" prop="name">
        <el-input v-model.trim="form.name" />
      </el-form-item>
      <el-form-item label="配置编码" prop="code">
        <el-input v-model.trim="form.code" :disabled="!isAdd" />
      </el-form-item>
      <el-form-item label="配置值" prop="val">
        <el-input v-model.trim="form.val" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update } from '@/api/systemConfig'
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
    return {
      dialog: false,
      loading: false,
      form: { code: '', name: '', val: '' }
    }
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
          message: '创建成功',
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
