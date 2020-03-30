<template>
  <el-dialog :visible.sync="auditDialogVisible" title="审核记录" center :width="width">
    <el-table v-loading="showAuditRecordLoading" :data="auditRecordList" size="small" fit highlight-current-row style="width: 100%;">
      <el-table-column label="审核类型" prop="type" />>
      <el-table-column label="审核结果" prop="auditResult" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="审核人" prop="auditor" />
      <el-table-column label="审核时间" prop="auditTime" />
    </el-table>

    <pagination v-show="auditRecordTotal>0" :total="auditRecordTotal" :page.sync="auditRecordQo.page" :size.sync="auditRecordQo.size" :layout="'total, prev, pager, next'" @pagination="getAuditList" />
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import { list } from '@/api/auditRecord'
export default {
  name: 'AuditRecord',
  components: { Pagination },
  props: {
    entityClassName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showAuditRecordLoading: false, auditRecordList: [], auditRecordTotal: 0,
      auditRecordQo: { page: 1, size: 5, entityId: '', entityClassName: '' },
      auditDialogVisible: false,
      width: '100%'
    }
  },
  created() {
    this.width = document.body.clientWidth >= 768 ? '60%' : '100%'
  },
  methods: {
    getAuditList(entityId) {
      this.showAuditRecordLoading = true
      this.auditRecordQo.entityId = entityId
      this.auditRecordQo.entityClassName = this.entityClassName
      list(this.auditRecordQo).then(response => {
        this.auditRecordList = response.rows
        this.auditRecordTotal = response.total
        this.showAuditRecordLoading = false
      }).catch(() => {
        this.showAuditRecordLoading = false
      })
    }
  }
}
</script>
