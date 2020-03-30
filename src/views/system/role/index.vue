<template>
  <div class="app-container">

    <!--查询-->
    <div class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo" size="small" label-position="right">
        <el-row :gutter="15">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="角色名" prop="roleName">
              <el-input v-model.trim="qo.roleName" @keyup.enter.native="handleFilter" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="角色编码" prop="roleCode">
              <el-input v-model.trim="qo.roleCode" @keyup.enter.native="handleFilter" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="描述" prop="description">
              <el-input v-model.trim="qo.description" @keyup.enter.native="handleFilter" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15" type="flex">
          <el-col :xs="0" :sm="12" :md="8" :lg="8" :xl="8" />
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-button type="primary" size="mini" icon="el-icon-search" round @click="handleFilter">
              查询
            </el-button>
            <el-button size="mini" icon="el-icon-refresh" round @click="refreshQo">
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-row :gutter="15" style="margin-top:10px;">
      <!--角色列表-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
        <el-card class="box-card" shadow="never">
          <!--卡片头-->
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
            <div id="opt" style="float: right">
              <!-- <el-radio-group v-model="opt" size="mini">
                <el-radio-button label="菜单及按钮分配" />
                <el-radio-button label="权限分配" />
              </el-radio-group> -->
            </div>
          </div>
          <!-- 顶部按钮 -->
          <TopButton @listenCall="listenCall" />
          <div class="table-container">
            <!--列表-->
            <el-table v-loading="showLoading" :data="list" size="small" fit highlight-current-row @row-click="handleRowClick">
              <el-table-column label="角色名" prop="roleName" />
              <el-table-column label="角色编码" prop="roleCode" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="创建日期" prop="dateCreated" />
              <el-table-column label="操作" width="100">
                <template slot-scope="{row}">
                  <!-- 右侧按钮 -->
                  <DropdownButton :row="row" @listenCall="listenCall" />
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!--分页插件-->
          <pagination v-show="total>0" :total="total" :page.sync="qo.page" :size.sync="qo.size" @pagination="getList" />
        </el-card>
      </el-col>

      <!--菜单及按钮权限-->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card v-show="opt === '菜单及按钮分配'" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单及按钮" placement="top">
              <span class="role-span">菜单及按钮分配</span>
            </el-tooltip>
            <el-button :disabled="!showButton" :loading="menuLoading" icon="el-icon-check" size="mini" style="float: right; padding: 6px 9px" type="primary" @click="saveMenu">
              保存
            </el-button>
          </div>
          <el-tree
            ref="menu"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            accordion
            show-checkbox
            :check-strictly="treeSetTrue"
            node-key="id"
          />
        </el-card>
        <el-card v-show="opt === '权限分配'" class="box-card" shadow="never" />
      </el-col>
    </el-row>

    <!--form 组件-->
    <eForm ref="form" :is-add="isAdd" :uid="uid" @getList="getList" />
  </div>
</template>

<script>
import eForm from './form'
import { roleList, deleteRole, get, singleRoleMenuAndButton, bindComponent } from '@/api/role'
import { fullTree } from '@/api/menu'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import DropdownButton from '@/components/DropdownButton'

export default {
  name: 'Role',
  components: { Pagination, eForm, TopButton, DropdownButton },
  data() {
    return {
      list: null, total: 0, showLoading: false,
      qo: { page: 1, size: 10, roleName: '', roleCode: '', description: '' },
      isAdd: false, uid: null,
      opt: '菜单及按钮分配',
      menuLoading: false, showButton: false, treeSetTrue: true,
      menus: [], menuIds: [], currentRoleId: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getList()
    this.getFullTree()
  },
  methods: {
    getList() {
      this.showLoading = true
      roleList(this.qo).then(response => {
        this.list = response.rows
        this.total = response.total
        this.showLoading = false
      }).catch(() => {
        this.showLoading = false
      })
    },
    handleFilter() {
      this.qo.page = 1
      this.getList()
    },
    handleCreate() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    handleUpdate(row) {
      this.isAdd = false
      const _this = this.$refs.form
      this.uid = row.id
      _this.dialog = true
      get(row.id).then(response => {
        _this.form = response
      }).catch(() => {})
    },
    handleDelete(row) {
      this.$confirm('确认删除此数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteRole(row.id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {})
    },
    listenCall(method, row) {
      this[method](row)
    },
    saveMenu() {
      // this.menuLoading = true
      // 得到已选中的 key 值
      const nodes = this.$refs.menu.getCheckedNodes()
      const params = []
      nodes.forEach(function(data, index) {
        params.push({
          id: data.id,
          type: data.type
        })
      })
      bindComponent(this.currentRoleId, params).then(res => {
        this.$message({
          message: '绑定成功',
          type: 'success'
        })
        this.menuLoading = false
      }).catch(err => {
        this.menuLoading = false
        console.log(err)
      })
    },
    getFullTree() {
      fullTree().then(response => {
        this.menus = response
      }).catch(() => {})
    },
    handleRowClick(row, column, event) {
      this.currentRoleId = row.id
      // 清空选中
      this.$refs.menu.setCheckedKeys([])
      // 点击后显示按钮
      this.showButton = true
      singleRoleMenuAndButton(row.id).then(response => {
        this.menuIds = response
      }).catch(() => {})
    },
    refreshQo() {
      this.$refs.qo.resetFields()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>
