<template>
  <div class="app-container">
    <!--查询-->
    <div class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo" size="small" label-position="right">
        <el-row :gutter="15">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="用户名" prop="username">
              <el-input v-model.trim="qo.username" placeholder="用户名" @keyup.enter.native="handleFilter" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="qo.status" clearable>
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15" type="flex">
          <el-col :xs="0" :sm="12" :md="8" :lg="8" :xl="8" />
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-button type="primary" size="small" icon="el-icon-search" round @click="handleFilter">
              搜索
            </el-button>
            <el-button size="small" icon="el-icon-refresh" round @click="refreshQo">
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 顶部按钮 -->
    <TopButton @listenCall="listenCall" />

    <!--列表-->
    <div class="table-container">
      <!--数据列表-->
      <el-table ref="mainTable" v-loading="showLoading" :data="list" size="small" fit highlight-current-row @row-click="toggleRowSelection">
        <el-table-column type="selection" />
        <el-table-column label="用户名" prop="username" />
        <el-table-column label="昵称" prop="nickName" />
        <el-table-column label="性别" prop="sex" />
        <el-table-column label="手机" prop="phone" />
        <el-table-column label="邮箱" prop="mail" />
        <el-table-column label="注册日期" prop="registerDate" />
        <el-table-column label="密码最后修改时间" prop="lastPasswordResetDate" />
        <el-table-column label="操作" width="100">
          <template slot-scope="{row}">
            <!-- 右侧按钮 -->
            <DropdownButton :row="row" @listenCall="listenCall" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination v-show="total>0" :total="total" :page.sync="qo.page" :size.sync="qo.size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { list, deleteUser, userStatusSelect } from '@/api/user'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import DropdownButton from '@/components/DropdownButton'
export default {
  name: 'User',
  components: { Pagination, TopButton, DropdownButton },
  data() {
    return {
      list: null, total: 0, showLoading: true, delLoading: false, statusOptions: [],
      qo: { page: 1, size: 10, userName: '', status: '' }
    }
  },
  created() {
    this.getList()
    this.getStatusSelect()
  },
  methods: {
    getList() {
      this.showLoading = true
      list(this.qo).then(response => {
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
    refreshQo() {
      this.$refs.qo.resetFields()
    },
    listenCall(method, row) {
      this[method](row)
    },
    toggleRowSelection(row, event, column) {
      this.$refs.mainTable.toggleRowSelection(row)
    },
    handleDelete(row) {
      this.$confirm('确认禁用此用户?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(res => {
          this.$message({
            message: '已禁用此用户',
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {})
    },
    getStatusSelect() {
      userStatusSelect().then(res => {
        this.statusOptions = res
      })
    }
  }
}
</script>
