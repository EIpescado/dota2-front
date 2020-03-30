<template>
  <div class="app-container">
    <el-row :gutter="15">
      <!--公告列表-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="6">
        <el-card class="box-card" shadow="never">
          <!--卡片头-->
          <div slot="header" class="clearfix">
            <span>公告列表</span>
            <el-button icon="el-icon-circle-plus-outline" size="mini" style="float: right;" type="primary" @click="clear">
              新公告
            </el-button>
          </div>

          <!--列表-->
          <el-table v-loading="showLoading" :data="list" size="small" highlight-current-row style="width: 100%;" @row-click="handleRowClick">
            <el-table-column label="标题" prop="title" />
            <!-- <el-table-column label="操作">
              <template slot-scope="{row}">
                <DropdownButton :row="row" @listenCall="listenCall" />
              </template>
            </el-table-column> -->
          </el-table>

          <!--分页插件-->
          <pagination v-show="total>0" :total="total" :page.sync="qo.page" :size.sync="qo.size" layout="total, prev, pager, next, jumper" @pagination="getList" />
        </el-card>
      </el-col>

      <!--公告详情 编辑-->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="18">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>{{ currentId ? '编辑' : '新增' }}公告</span>
            <el-button :loading="saveLoading" icon="el-icon-check" size="mini" style="float: right;" type="primary" @click="saveNotice">
              {{ currentId ? '修改' : '创建' }}
            </el-button>
          </div>
          <el-input v-model.trim="fo.title" placeholder="请输入内容" style="text-align:left;margin: 0 0 5px 0">
            <template slot="prepend">标题</template>
          </el-input>
          <div>
            <tinymce ref="editor" v-model="fo.content" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { noticeList, createNotice, updateNotice, noticeDetail } from '@/api/message'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
export default {
  name: 'Notice',
  components: { Pagination, Tinymce },
  data() {
    return {
      fo: { title: '', content: '' },
      list: null, total: 0, showLoading: false,
      qo: { page: 1, size: 10 },
      saveLoading: false, currentId: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.showLoading = true
      noticeList(this.qo).then(res => {
        this.list = res.rows
        this.total = res.total
        this.showLoading = false
      }).catch(() => {
        this.showLoading = false
      })
    },
    handleRowClick(row) {
      noticeDetail(row.id).then(res => {
        this.currentId = row.id
        this.fo.title = res.title
        this.fo.content = res.content
        this.$refs.editor.setContent(res.content)
      })
    },
    saveNotice() {
      this.saveLoading = true
      if (!this.fo.title || !this.fo.content) {
        this.$message({
          message: '请填写内容',
          type: 'warning'
        })
        this.saveLoading = false
        return
      }
      if (this.currentId) {
        updateNotice(this.currentId, this.fo).then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
      } else {
        createNotice(this.fo).then(res => {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
        })
      }
      this.saveLoading = false
      this.getList()
    },
    clear() {
      this.fo.title = ''
      this.currentId = ''
      this.fo.content = ''
      this.$refs.editor.setContent('')
    }
  }
}
</script>

