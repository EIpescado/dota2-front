<template>
  <el-dialog :visible.sync="statusLogDialogVisible" center title="状态日志">
    <el-table v-loading="showStatusLogLoading" :data="statusLogList" size="small" fit highlight-current-row style="width: 100%;">
      <el-table-column label="操作人" prop="operator" />
      <el-table-column label="时间" prop="changeDate" />
      <!-- <el-table-column label="备注" prop="remark" /> -->
      <el-table-column label="状态" prop="status" />
    </el-table>

    <pagination v-show="statusLogTotal>0" :total="statusLogTotal" :page.sync="statusLogQo.page" :size.sync="statusLogQo.size" :layout="'total, prev, pager, next'" @pagination="getStatusLogList" />
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import { statusLogList } from '@/api/statusLog'
export default {
  name: 'StatusLog',
  components: { Pagination },
  props: {
    entityClassName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showStatusLogLoading: false, statusLogList: [], statusLogTotal: 0, entityId: '',
      statusLogQo: { page: 1, size: 10, entityId: '', entityClassName: '' },
      statusLogDialogVisible: false
    }
  },
  methods: {
    getStatusLogList() {
      this.showStatusLogLoading = true
      this.statusLogQo.entityId = this.entityId
      this.statusLogQo.entityClassName = this.entityClassName
      statusLogList(this.statusLogQo).then(response => {
        this.statusLogList = response.rows
        this.statusLogTotal = response.total
        this.showStatusLogLoading = false
      }).catch(() => {
        this.showStatusLogLoading = false
      })
    }
  }
}
</script>
