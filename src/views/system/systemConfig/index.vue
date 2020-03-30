<template>
  <div class="app-container">
    <!--查询-->
    <div class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo" size="small" label-position="right">
        <el-row :gutter="15">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="名称" prop="name">
              <el-input v-model.trim="qo.name" @keyup.enter.native="handleFilter" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="编码" prop="code">
              <el-input v-model.trim="qo.code" @keyup.enter.native="handleFilter" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15" type="flex">
          <el-col :xs="0" :sm="12" :md="8" :lg="8" :xl="8" />
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-button type="primary" size="mini" icon="el-icon-search" round @click="handleFilter">搜索</el-button>
            <el-button size="mini" icon="el-icon-refresh" round @click="refreshQo">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 顶部按钮 -->
    <TopButton @listenCall="listenCall" />

    <div class="table-container">
      <!--列表-->
      <el-table :key="tableKey" v-loading="showLoading" :data="list" size="small" fit highlight-current-row>
        <el-table-column label="名称" prop="name" />
        <el-table-column label="编码" prop="code" />
        <el-table-column label="值" prop="val" />
        <el-table-column label="创建日期" prop="dateCreated" />
        <el-table-column label="最后修改日期" prop="lastUpdated" />
        <el-table-column label="操作" width="100px">
          <template slot-scope="{row}">
            <!-- 右侧按钮 -->
            <DropdownButton :row="row" @listenCall="listenCall" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination v-show="total>0" :total="total" :page.sync="qo.page" :size.sync="qo.size" @pagination="getList" />
    </div>
    <!--新增和编辑弹窗表单-->
    <eForm ref="form" :is-add="isAdd" :uid="uid" @getList="getList" />

  </div>
</template>

<script>
import { systemConfigList, get } from '@/api/systemConfig'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import DropdownButton from '@/components/DropdownButton'
import eForm from './form'

export default {
  name: 'SystemConfig',
  components: { Pagination, TopButton, DropdownButton, eForm },
  data() {
    return {
      tableKey: 0, list: null, total: 0, showLoading: true,
      qo: { page: 1, size: 10, name: '', code: '' },
      isAdd: false, uid: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.showLoading = true
      systemConfigList(this.qo).then(response => {
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
      }).catch(() => {
      })
    }
  }
}
</script>
