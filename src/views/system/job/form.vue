<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增职位' : '编辑职位'" append-to-body center @close="cancel">
    <el-form ref="form" :model="form" size="small" label-width="80px">
      <el-form-item label="职位名称" prop="name">
        <el-input v-model.trim="form.name" />
      </el-form-item>
      <el-form-item label="排序号" prop="rowNo">
        <el-input v-model.number="form.rowNo" type="number" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentId">
        <el-input v-show="false" v-model.trim="form.departmentId" />
        <el-input v-model.trim="departmentName" :disabled="true" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update } from '@/api/job'
export default {
  data() {
    return {
      isAdd: false, uid: '', departmentId: '', departmentName: '',
      dialog: false, loading: false,
      form: { name: '', departmentId: undefined, rowNo: '' }
    }
  },
  created() {

  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.form.departmentId = this.departmentId
      if (this.form.departmentId === null || this.form.departmentId === undefined) {
        this.$message({
          message: '部门不能为空',
          type: 'warning'
        })
      } else {
        this.loading = true
        if (this.isAdd) {
          this.doAdd()
        } else {
          this.doEdit()
        }
      }
    },
    doAdd() {
      create(this.form).then(res => {
        this.resetForm()
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.loading = false
        this.$parent.handleFilter()
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
        this.$parent.handleFilter()
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
