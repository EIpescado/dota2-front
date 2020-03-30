<template>
  <el-dialog :visible.sync="departmentUserDialogVisible" center :width="width">
    <el-form ref="departmentUserQo" :inline="true" :model="departmentUserQo" size="small" label-position="right">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="名称" prop="nickName">
            <el-input v-model.trim="departmentUserQo.nickName" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-button type="primary" size="mini" icon="el-icon-search" round @click="getDepartmentUserList">
            搜索
          </el-button>
          <el-button size="mini" icon="el-icon-refresh" round @click="refreshQo">
            重置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table v-loading="departmentUserShowLoading" :data="departmentUserList" size="small" fit highlight-current-row style="width: 100%;" @current-change="handleCurrentChange">
      <el-table-column label="昵称" prop="nickName" />
      <el-table-column label="部门 / 职位">
        <template slot-scope="scope">
          <span>{{ scope.row.department }} / {{ scope.row.job }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex" />
      <el-table-column label="手机" prop="phone" />
      <el-table-column label="邮箱" prop="mail" />
    </el-table>
    <pagination v-show="departmentUserTotal>0" :total="departmentUserTotal" :page.sync="departmentUserQo.page" :size.sync="departmentUserQo.size" :layout="'total, prev, pager, next'" @pagination="getDepartmentUserList" />
    <div slot="footer" class="dialog-footer">
      <el-button :loading="allotLoading" type="primary" @click="allot">确认分配</el-button>
      <el-button @click="cancelAllot">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import { list } from '@/api/user'
import { allot } from '@/api/platform'
export default {
  name: 'DepartmentUser',
  components: { Pagination },
  props: {
    departmentId: {
      type: String,
      required: true
    },
    ids: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      departmentUserShowLoading: false, departmentUserList: [], departmentUserTotal: 0,
      departmentUserQo: { page: 1, size: 5, departmentId: '', nickName: '' },
      departmentUserDialogVisible: false,
      allotForm: { internalUserId: '', platformUserIds: [] }, currentRow: undefined, allotLoading: false,
      width: '100%'
    }
  },
  created() {
    this.width = document.body.clientWidth >= 768 ? '60%' : '100%'
  },
  methods: {
    show() {
      this.departmentUserDialogVisible = true
      this.getDepartmentUserList()
    },
    getDepartmentUserList() {
      this.departmentUserShowLoading = true
      this.departmentUserQo.departmentId = this.departmentId
      list(this.departmentUserQo).then(response => {
        this.departmentUserList = response.rows
        this.departmentUserTotal = response.total
        this.departmentUserShowLoading = false
      }).catch(() => {
        this.departmentUserShowLoading = false
      })
    },
    refreshQo() {
      this.$refs.departmentUserQo.resetFields()
      this.departmentUserDialogVisible = false
    },
    cancelAllot() {
      this.$refs.departmentUserQo.resetFields()
      this.departmentUserDialogVisible = false
    },
    handleCurrentChange(row) {
      this.currentRow = row
    },
    allot() {
      this.allotLoading = true
      if (this.currentRow) {
        this.allotForm.internalUserId = this.currentRow.id
        this.allotForm.platformUserIds = this.ids
        allot(this.allotForm).then(res => {
          this.allotLoading = false
          this.$message({
            message: '分配成功',
            type: 'success'
          })
          this.departmentUserDialogVisible = false
          this.$parent.getList()
        }).catch(() => {
          this.allotLoading = false
        })
      } else {
        this.$message({
          message: '请选择分配的人员',
          type: 'warning'
        })
        this.allotLoading = false
      }
    }
  }
}
</script>
