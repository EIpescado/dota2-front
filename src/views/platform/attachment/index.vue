<template>
  <div class="app-container">

    <!--查询-->
    <div class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo" size="small" label-position="right">
        <el-row :gutter="15">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="文件名" prop="fileName">
              <el-input v-model.trim="qo.fileName" @keyup.enter.native="handleFilter" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="备注" prop="remark">
              <el-input v-model.trim="qo.remark" @keyup.enter.native="handleFilter" />
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
        <el-table-column label="文件名称" prop="fileName" />>
        <el-table-column label="文件类型" prop="fileType" />
        <el-table-column label="备注" prop="remark" />>
        <el-table-column label="上传人" prop="uploadMen" />
        <el-table-column label="上传时间" prop="uploadDate" />
        <el-table-column label="文件预览">
          <template slot-scope="{row}">
            <el-image v-if="imageArray.indexOf(row.fileType) !== -1" style="width: 56px; height: 44px" :src="row.fileAddress" :preview-src-list="[row.fileAddress]" fit="contain" />
            <el-link v-else :href="row.fileAddress" type="primary">点击下载</el-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="{row}">
            <!-- 右侧按钮 -->
            <DropdownButton :row="row" @listenCall="listenCall" />
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="qo.page" :size.sync="qo.size" @pagination="getList" />
    </div>

    <el-dialog :visible="showUploadDialog" title="上传文件" center @close="cancelUpload">
      <el-row :gutter="60" type="flex">
        <el-col :span="10">
          备注:<el-input v-model="remark" placeholder="请输入内容" clearable />
        </el-col>
        <el-col :span="10">
          <el-upload action="/api/attachment/upload" :headers="headers" :data="{ remark: remark }" :before-upload="beforeUpload" :on-success="uploadLogoSuccess" :show-file-list="false" :on-progress="uploadProgress">
            <el-button v-loading="uploadLoading" size="small" type="primary">点击上传</el-button>
            <div slot="tip">文件大小不超过5MB</div>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { list } from '@/api/attachment'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import { getToken } from '@/utils/auth'
import { tokenHeaderName } from '@/settings'
import DropdownButton from '@/components/DropdownButton'
export default {
  name: 'Attachment',
  components: { Pagination, TopButton, DropdownButton },
  data() {
    return {
      list: null, total: 0, showLoading: true,
      qo: { page: 1, size: 10, fileName: '', remark: '' },
      imageArray: ['jpg', 'png', 'jpeg'],
      showUploadDialog: false, tokenHeaderName: tokenHeaderName, headers: {}, uploadLoading: false, remark: ''
    }
  },
  created() {
    this.getList()
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
    uploadFile() {
      this.showUploadDialog = true
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('仅可上传图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      if (isJPG && isLt2M) {
        this.headers[this.tokenHeaderName] = getToken()
      }
      return isJPG && isLt2M
    },
    uploadLogoSuccess(response, file, fileList) {
      this.$message.success('上传图片成功')
      this.showUploadDialog = false
      this.uploadLoading = false
      this.remark = ''
      this.getList()
    },
    cancelUpload() {
      this.showUploadDialog = false
    },
    uploadProgress(event, file, fileList) {
      this.uploadLoading = true
    },
    copyFilePath(row) {
      this.$copyText(row.fileAddress).then(() => {
        this.$message.success('复制成功')
      })
    }
  }
}
</script>
