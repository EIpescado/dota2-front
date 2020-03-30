<template>
  <div class="app-container">

    <!--查询-->
    <div class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo" size="small" label-position="right">
        <el-row :gutter="15">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="接口编码" prop="code">
              <el-input v-model.trim="qo.code" @keyup.enter.native="handleFilter" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="模块" prop="module">
              <el-input v-model.trim="qo.module" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="接口描述" prop="description">
              <el-input v-model.trim="qo.description" @keyup.enter.native="handleFilter" />
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
      <el-table v-loading="showLoading" :data="list" size="small" fit highlight-current-row @cell-dblclick="showDetail">
        <el-table-column prop="module" label="模块" />
        <el-table-column prop="code" label="接口地址" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="dateCreated" label="创建时间" />
        <el-table-column prop="lastUpdated" label="修改日期" />
        <el-table-column label="操作" width="100px">
          <template slot-scope="{row}">
            <!-- 右侧按钮 -->
            <DropdownButton :row="row" @listenCall="listenCall" />
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="qo.page" :size.sync="qo.size" @pagination="handleFilter" />
    </div>

  </div>
</template>

<script>
import { list } from '@/api/interfaceDefinition'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import DropdownButton from '@/components/DropdownButton'
export default {
  name: 'InterfaceDefinition',
  components: { Pagination, TopButton, DropdownButton },
  data() {
    return {
      list: null, total: 0, showLoading: true,
      qo: { page: 1, size: 10, code: '', module: '', description: '' }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    handleFilter() {
      this.showLoading = true
      list(this.qo).then(response => {
        this.list = response.rows
        this.total = response.total
        this.showLoading = false
      }).catch(() => {
        this.showLoading = false
      })
    },
    refreshQo() {
      this.$refs.qo.resetFields()
    },
    listenCall(method, row) {
      this[method](row)
    },
    handleCreate() {
      this.$router.push({ path: '/platform/interfaceDefinitionCreate' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/platform/interfaceDefinitionEdit', query: { interfaceId: row.id }})
    },
    showDetail(row, column, cell, event) {
      this.$router.push({ path: '/platform/interfaceDefinitionDetail', query: { interfaceId: row.id }})
    }
  }
}
</script>
