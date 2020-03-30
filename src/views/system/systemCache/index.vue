<template>
  <div class="app-container">
    <!--查询-->
    <div class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo" size="small" label-position="right">
        <el-row :gutter="15">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="key" prop="key">
              <el-input v-model.trim="qo.key" @keyup.enter.native="handleFilter" />
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

    <!--列表-->
    <div class="table-container">
      <!--列表-->
      <el-table v-loading="showLoading" :data="list" size="small" fit highlight-current-row>
        <el-table-column label="键" prop="key" />
        <el-table-column label="值">
          <template slot-scope="scope">
            <span style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              {{ scope.row.value }}
            </span>
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
import { systemCacheList, deleteCache, flushDb } from '@/api/systemCache'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import DropdownButton from '@/components/DropdownButton'

export default {
  name: 'SystemCache',
  components: { Pagination, TopButton, DropdownButton },
  data() {
    return {
      list: null, total: 0, showLoading: true,
      qo: { page: 1, size: 10, key: '' }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.showLoading = true
      systemCacheList(this.qo).then(response => {
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
    handleDelete(row) {
      this.$confirm('确认删除此缓存, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteCache({ key: row.key }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {})
    },
    copyCache(row) {
      this.$copyText(row.value).then(() => {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      })
    },
    flushDb() {
      this.$confirm('确认清空缓存?', '提示', {
        type: 'warning'
      }).then(() => {
        flushDb().then(res => {
          this.$message({
            message: '已全部清空',
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {})
    }
  }
}
</script>
