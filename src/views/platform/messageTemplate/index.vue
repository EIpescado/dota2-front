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
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="模版类型" prop="type">
              <el-select v-model="qo.type" clearable>
                <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15" type="flex">
          <el-col :xs="0" :sm="12" :md="8" :lg="8" :xl="8" />
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-button type="primary" size="mini" icon="el-icon-search" round @click="handleFilter">
              搜索
            </el-button>
            <el-button size="mini" icon="el-icon-refresh" round @click="refreshQo">
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 顶部按钮 -->
    <TopButton @listenCall="listenCall" />

    <div class="table-container">
      <el-table v-loading="showLoading" :data="list" size="small" fit highlight-current-row>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="模版内容">
                <span>{{ props.row.template }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="编码" />
        <el-table-column prop="type" label="模版类型" />
        <el-table-column prop="whetherNeedFormat" label="需要格式化">
          <template slot-scope="{row}">
            {{ row.whetherNeedFormat ? '是' : '否' }}
          </template>
        </el-table-column>
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
    </div>

    <!--form 组件-->
    <eForm ref="form" :is-add="isAdd" :uid="uid" :types="types" @handleFilter="handleFilter" />
  </div>
</template>

<script>
import eForm from './form'
import { list, get, deleteMessageTemplate } from '@/api/messageTemplate'
import { select } from '@/api/dict'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import DropdownButton from '@/components/DropdownButton'

export default {
  name: 'MessageTemplate',
  components: { Pagination, eForm, TopButton, DropdownButton },
  data() {
    return {
      list: null,
      total: 0,
      showLoading: true,
      qo: { page: 1, size: 10, name: '', type: '', code: '' },
      isAdd: false,
      uid: '',
      types: []
    }
  },
  created() {
    this.handleFilter()
    this.getTypes()
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
        deleteMessageTemplate(row.id).then(res => {
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
    getTypes() {
      select('MESSAGE_TEMPLATE_TYPE').then(res => {
        this.types = res
      })
    }
  }
}
</script>
