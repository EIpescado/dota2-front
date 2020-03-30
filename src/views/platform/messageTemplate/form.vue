<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新模版' : '编辑模版'" append-to-body center @close="cancel">
    <el-form ref="form" :model="form" size="small" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="form.name" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model.trim="form.code" />
      </el-form-item>
      <el-form-item label="模版类型" prop="type">
        <el-select v-model="form.type" clearable>
          <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="模版" prop="template">
        <el-input v-model.trim="form.template" type="textarea" />
      </el-form-item>
      <el-form-item label="需要格式化" prop="whetherNeedFormat">
        <el-switch v-model="form.whetherNeedFormat" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update } from '@/api/messageTemplate'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    uid: {
      type: String,
      default: ''
    },
    types: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      form: { name: '', code: '', type: '', template: '', whetherNeedFormat: false }
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
          } else {
            this.doEdit()
          }
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
        this.$emit('handleFilter')
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
        this.$emit('handleFilter')
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

<style scoped>

</style>
