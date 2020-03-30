<template>
  <el-dialog :visible.sync="auditVisible" title="审核申请" center :width="width">
    <el-form ref="auditForm" :model="auditForm" size="small" label-width="80px">
      <el-form-item label="审核结果" prop="auditResult">
        <el-select v-model="auditForm.auditResult" placeholder="请选择">
          <el-option v-for="item in auditResults" :key="item.key" :label="item.key" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="原因" prop="remark">
        <el-input v-model.trim="auditForm.remark" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button :loading="auditLoading" type="primary" @click="postAudit">确认</el-button>
      <el-button @click="cancelAudit">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { audit } from '@/api/agreement'
import { auditResultSelect } from '@/api/auditRecord'
export default {
  name: 'Audit',
  props: {
    entityId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      auditVisible: false,
      width: '100%',
      auditForm: { entityId: '', auditResult: '', remark: '' },
      auditResults: undefined, auditLoading: false
    }
  },
  created() {
    this.width = document.body.clientWidth >= 768 ? '40%' : '100%'
  },
  methods: {
    show() {
      if (!this.auditResults) {
        this.auditResultSelect()
      }
      this.auditVisible = true
    },
    postAudit() {
      this.auditLoading = true
      this.auditForm.entityId = this.entityId
      audit(this.auditForm).then(response => {
        this.$message({
          message: '审核完成',
          type: 'success'
        })
        this.auditLoading = false
        this.cancelAudit()
        this.auditVisible = false
        this.$parent.getList()
      }).catch(() => {
        this.auditLoading = false
      })
    },
    auditResultSelect() {
      auditResultSelect().then(res => {
        this.auditResults = res
      })
    },
    cancelAudit() {
      this.$refs.auditForm.resetFields()
      this.auditVisible = false
    }
  }
}
</script>
