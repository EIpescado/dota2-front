<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card shadow="hover">
          <template>
            <div slot="header" class="clearfix">
              <span>部门</span>
            </div>
          </template>
          <el-tree
            ref="tree"
            :data="departments"
            :props="defaultProps"
            :expand-on-click-node="false"
            :check-strictly="true"
            highlight-current
            node-key="id"
            style="margin-top:20px;"
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <!--职位-->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card shadow="hover">
          <!--查询-->
          <el-form ref="qo" :inline="true" :model="qo" size="small" label-position="right">
            <el-row :gutter="15">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="职位名称" prop="name">
                  <el-input v-model.trim="qo.name" @keyup.enter.native="handleFilter" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
                <el-button type="primary" size="mini" icon="el-icon-search" round @click="handleFilter">
                  搜索
                </el-button>
                <el-button size="mini" icon="el-icon-refresh" round @click="refreshQo">
                  重置
                </el-button>
              </el-col>
            </el-row>
          </el-form>

          <!-- 顶部按钮 -->
          <TopButton @listenCall="listenCall" />
          <el-table v-loading="showLoading" :data="list" size="small" fit highlight-current-row>
            <el-table-column prop="name" label="职位名称" />
            <el-table-column prop="department" label="部门" />
            <el-table-column prop="dateCreated" label="创建时间" />
            <el-table-column prop="lastUpdated" label="最后修改时间" />
            <el-table-column label="操作" width="100">
              <template slot-scope="{row}">
                <!-- 右侧按钮 -->
                <DropdownButton :row="row" @listenCall="listenCall" />
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="total>0" :total="total" :page.sync="qo.page" :size.sync="qo.size" @pagination="handleFilter" />
        </el-card>
      </el-col>
    </el-row>

    <!--form 组件-->
    <eForm ref="form" />
  </div>
</template>

<script>
import eForm from './form'
import { list, get, deleteJob } from '@/api/job'
import { departmentTree } from '@/api/department'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import DropdownButton from '@/components/DropdownButton'

export default {
  name: 'Job',
  components: { Pagination, eForm, TopButton, DropdownButton },
  data() {
    return {
      departments: [], defaultProps: { children: 'children', label: 'name' },
      list: null,
      total: 0,
      showLoading: false, departmentName: '',
      qo: { page: 1, size: 10, name: '', departmentId: '' }
    }
  },
  created() {
    this.getDepartmentTree()
  },
  methods: {
    handleFilter() {
      this.qo.page = 1
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
    handleCreate() {
      if (this.qo.departmentId) {
        const _this = this.$refs.form
        _this.isAdd = true
        _this.departmentId = this.qo.departmentId
        _this.departmentName = this.departmentName
        _this.dialog = true
      } else {
        this.$message.warning('请选择部门')
      }
    },
    handleUpdate(row) {
      const _this = this.$refs.form
      _this.isAdd = false
      _this.departmentId = this.qo.departmentId
      _this.departmentName = this.departmentName
      _this.uid = row.id
      _this.dialog = true
      get(row.id).then(response => {
        _this.form = response
      }).catch(() => {})
    },
    handleDelete(row) {
      this.$confirm('确认删除此数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteJob(row.id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.handleFilter()
        })
      }).catch(() => {
      })
    },
    listenCall(method, row) {
      this[method](row)
    },
    getDepartmentTree() {
      departmentTree().then(response => {
        this.departments = response
      }).catch(() => {})
    },
    handleNodeClick(data) {
      this.qo.departmentId = data.id
      this.departmentName = data.name
      this.handleFilter()
    }
  }
}
</script>
