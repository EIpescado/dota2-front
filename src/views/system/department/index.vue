<template>
  <div class="app-container">

    <el-row :gutter="15">
      <!--部门树-->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card shadow="hover">
          <!-- 顶部按钮 -->
          <TopButton @listenCall="listenCall" />
          <el-input v-model.trim="filterText" style="margin-top:20px;" placeholder="输入关键字进行过滤">
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
          <el-tree
            ref="tree"
            :data="departments"
            :props="defaultProps"
            :expand-on-click-node="false"
            :check-strictly="true"
            highlight-current
            node-key="id"
            style="margin-top:20px;"
            :filter-node-method="filterNode"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }} - {{ data.rowNo }}</span>
              <span>
                <el-button type="text" size="mini" icon="el-icon-edit" @click="edit(data)">修改</el-button>
                <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteNode(data)">删除</el-button>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>

      <!--表单-->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <!--部门表单-->
        <el-card v-show="showDepartmentForm" shadow="hover">
          <template>
            <div slot="header" class="clearfix">
              <span>{{ isAddDepartment ? '新增' : '修改' }}部门</span>
            </div>
          </template>
          <el-form ref="departmentForm" :model="departmentForm" size="small" label-width="75px">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model.trim="departmentForm.name" />
            </el-form-item>
            <el-form-item label="排序号" prop="rowNo">
              <el-input v-model.number="departmentForm.rowNo" type="number" />
            </el-form-item>
            <el-form-item label="上级部门" prop="parentId">
              <treeselect v-model="departmentForm.parentId" :options="departments" placeholder="上级部门" :normalizer="normalizer" />
            </el-form-item>
            <el-form-item>
              <template>
                <el-button type="primary" round @click="departmentSubmit">{{ isAddDepartment ? '立即创建' : '保存' }}</el-button>
              </template>
              <el-button round @click="departmentCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

    </el-row>

  </div>
</template>

<script>
import { get, create, update, deleteDepartment, departmentTree } from '@/api/department'
import TopButton from '@/components/TopButton'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Department',
  components: { Treeselect, TopButton },
  data() {
    return {
      departments: [],
      filterText: '',
      showDepartmentForm: false, departmentForm: { name: '', rowNo: '', parentId: undefined },
      isAddDepartment: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getDepartmentTree()
  },
  methods: {
    getDepartmentTree() {
      departmentTree().then(response => {
        this.departments = response
      }).catch(() => {})
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children !== undefined && node.children !== null && node.children.length > 0 ? node.children : undefined
      }
    },
    edit(data) {
      this.showDepartmentForm = true
      this.isAddDepartment = false
      get(data.id).then(response => {
        this.departmentForm = response
      }).catch(() => {})
    },
    departmentSubmit() {
      if (this.isAddDepartment) {
        create(this.departmentForm).then(response => {
          this.$message({
            message: '新增部门成功',
            type: 'success'
          })
          this.showDepartmentForm = false
          this.getDepartmentTree()
        }).catch(() => {})
      } else {
        const id = this.$refs.tree.getCurrentNode().id
        update(id, this.departmentForm).then(response => {
          this.$message({
            message: '修改部门成功',
            type: 'success'
          })
          this.showDepartmentForm = false
          this.getDepartmentTree()
        }).catch(() => {})
      }
    },
    departmentCancel() {
      this.showDepartmentForm = false
      this.clearForm()
    },
    clearForm() {
      this.departmentForm = { name: '', parentId: undefined }
    },
    deleteNode(data) {
      const tips = '确认删除部门:' + data.name + '?'
      this.$confirm(tips, '提示', {
        type: 'warning'
      }).then(() => {
        deleteDepartment(data.id).then(response => {
          this.$message({
            message: '删除部门成功',
            type: 'success'
          })
          this.getDepartmentTree()
        }).catch(() => {})
      }).catch(() => {
      })
    },
    addDepartment() {
      const node = this.$refs.tree.getCurrentNode()
      if (!node) {
        this.$message({
          message: '请选择上级部门',
          type: 'warning'
        })
      } else {
        this.clearForm()
        this.departmentForm.parentId = node.id
        this.isAddDepartment = true
        this.showDepartmentForm = true
      }
    },
    listenCall(method, row) {
      this[method](row)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .menu-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
