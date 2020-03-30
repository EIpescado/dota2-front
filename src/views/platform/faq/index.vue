<template>
  <div class="app-container">

    <!--查询-->
    <div class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo" size="small" label-position="right">
        <el-row :gutter="15">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="问题" prop="question">
              <el-input v-model.trim="qo.question" @keyup.enter.native="handleFilter" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="答案" prop="answer">
              <el-input v-model.trim="qo.answer" @keyup.enter.native="handleFilter" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="类型" prop="type">
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
            <el-form label-position="left" inline>
              <el-form-item label="答案">
                <span>{{ props.row.answer }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="sort" />
        <el-table-column label="问题" prop="question" />
        <el-table-column label="类型" prop="type" />
        <el-table-column label="创建时间" prop="dateCreated" />
        <el-table-column label="修改时间" prop="lastUpdated" />
        <el-table-column label="操作" width="100">
          <template slot-scope="{row}">
            <!-- 右侧按钮 -->
            <DropdownButton :row="row" @listenCall="listenCall" />
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="qo.page" :size.sync="qo.size" @pagination="getList" />
    </div>

    <!--FAQ表单-->
    <el-dialog :title="currentId ? '修改FAQ' : '新FAQ'" :visible.sync="formVisible" center @close="refreshForm">
      <el-form ref="form" :model="form" size="mini" label-width="50px">
        <el-form-item label="问题" prop="question">
          <el-input v-model.trim="form.question" />
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model.trim="form.answer" type="textarea" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" clearable>
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input v-model.number="form.sort" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button :loading="saveLoading" type="primary" @click="save">确认</el-button>
        <el-button @click="refreshForm">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, get, deleteFAQ, create, update } from '@/api/faq'
import { select } from '@/api/dict'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import DropdownButton from '@/components/DropdownButton'

export default {
  name: 'FAQ',
  components: { Pagination, TopButton, DropdownButton },
  data() {
    return {
      list: null, total: 0, showLoading: true, delLoading: false, types: [],
      qo: { page: 1, size: 10, type: '', question: '', answer: '' },
      formVisible: false, currentId: undefined, form: { question: '', answer: '', type: '', sort: '' }, saveLoading: false
    }
  },
  created() {
    this.getList()
    this.faqTypeSelect()
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
    refreshForm() {
      this.$refs.form.resetFields()
      this.formVisible = false
    },
    handleCreate() {
      this.currentId = undefined
      this.formVisible = true
    },
    handleUpdate(row) {
      this.currentId = row.id
      this.formVisible = true
      get(row.id).then(res => {
        this.form = res
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除此数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteFAQ(row.id).then(res => {
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
    save() {
      this.saveLoading = true
      if (this.currentId) {
        update(this.currentId, this.form).then(res => {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.saveLoading = false
          this.formVisible = false
          this.getList()
        }).catch(() => {
          this.saveLoading = false
        })
      } else {
        create(this.form).then(res => {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.saveLoading = false
          this.formVisible = false
          this.getList()
        }).catch(() => {
          this.saveLoading = false
        })
      }
    },
    faqTypeSelect() {
      select('FAQ_TYPE').then(res => {
        this.types = res
      })
    }
  }
}
</script>
