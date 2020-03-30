<template>
  <div class="app-container">

    <!-- 顶部按钮 -->
    <TopButton @listenCall="listenCall" />

    <el-row :gutter="15">
      <!--权限树-->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>权限树</span>
          </div>
          <el-input v-model="filterText" placeholder="输入关键字进行过滤">
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
          <el-tree
            ref="tree"
            :data="permissions"
            :default-checked-keys="permissionIds"
            :props="defaultProps"
            :expand-on-click-node="treeSetFalse"
            :check-strictly="treeSetTrue"
            highlight-current
            node-key="id"
            class="filter-tree"
            :filter-node-method="filterNode"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <el-button type="text" size="mini" icon="el-icon-edit" @click="edit(data)" />
                <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteNode(data)" />
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>

      <!--表单-->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <!--权限表单-->
        <el-card v-show="showPermissionForm" class="box-card" shadow="hover">
          <template>
            <div slot="header" class="clearfix">
              <span>{{ isAddPermission ? '新增' : '修改' }}权限</span>
            </div>
          </template>
          <el-form ref="permissionForm" :model="permissionForm" size="small" label-width="75px">
            <el-form-item label="权限名称" prop="name">
              <el-input v-model="permissionForm.permissionName" />
            </el-form-item>
            <el-form-item label="权限编码" prop="name">
              <el-input v-model="permissionForm.permissionCode" />
            </el-form-item>
            <el-form-item label="上级权限" prop="parentId">
              <treeselect v-model="permissionForm.parentId" :options="permissions" placeholder="上级权限" :normalizer="normalizer" />
            </el-form-item>
            <el-form-item>
              <template>
                <el-button type="primary" round @click="permissionSubmit">{{ isAddPermission ? '立即创建' : '保存' }}</el-button>
              </template>
              <el-button round @click="permissionCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

    </el-row>

  </div>
</template>

<script>
import { get, create, update, deletePermission, permissionFullTree } from '@/api/permission'
import TopButton from '@/components/TopButton'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Permission',
  components: { Treeselect, TopButton },
  data() {
    return {
      permissions: [], permissionIds: [],
      filterText: '',
      showPermissionForm: false, permissionForm: { permissionName: '', permissionCode: '', parentId: undefined },
      isAddPermission: false,
      treeSetFalse: false,
      treeSetTrue: true,
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
    this.permissionFullTree()
  },
  methods: {
    permissionFullTree() {
      permissionFullTree().then(response => {
        this.permissions = response
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
      this.showPermissionForm = true
      this.isAddPermission = false
      get(data.id).then(response => {
        this.permissionForm = response
      }).catch(() => {})
    },
    permissionSubmit() {
      if (this.isAddPermission) {
        create(this.permissionForm).then(response => {
          this.$message({
            message: '新增权限成功',
            type: 'success'
          })
          this.showPermissionForm = false
          this.permissionFullTree()
        }).catch(() => {})
      } else {
        const id = this.$refs.tree.getCurrentNode().id
        update(id, this.permissionForm).then(response => {
          this.$message({
            message: '修改权限成功',
            type: 'success'
          })
          this.showPermissionForm = false
          this.permissionFullTree()
        }).catch(() => {})
      }
    },
    permissionCancel() {
      this.showPermissionForm = false
      this.clearForm()
    },
    clearForm() {
      this.permissionForm = { name: '', parentId: undefined }
    },
    deleteNode(data) {
      const tips = '确认删除权限:' + data.name + '?'
      this.$confirm(tips, '提示', {
        type: 'warning'
      }).then(() => {
        deletePermission(data.id).then(response => {
          this.$message({
            message: '删除权限成功',
            type: 'success'
          })
          this.permissionFullTree()
        }).catch(() => {})
      }).catch(() => {
      })
    },
    addPermission() {
      const node = this.$refs.tree.getCurrentNode()
      if (!node) {
        this.$message({
          message: '请选择上级权限',
          type: 'warning'
        })
      } else {
        this.clearForm()
        this.permissionForm.parentId = node.id
        this.isAddPermission = true
        this.showPermissionForm = true
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
