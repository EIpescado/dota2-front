<template>
  <el-dialog :visible.sync="loanOrderVisible" :title="'申请' + productName" :close-on-click-modal="false" center width="30%">
    <el-form ref="loanOrderForm" :model="loanOrderForm" size="small" label-width="80px">
      <el-form-item label="贷款期限" prop="period">
        <el-select v-model="loanOrderForm.period" placeholder="请选择">
          <el-option v-for="item in periods" :key="item" :label="item + '个月'" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="还款方式" prop="repaymentMode">
        <el-select v-model="loanOrderForm.repaymentMode" placeholder="请选择">
          <el-option v-for="item in repaymentModes" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请额度" prop="applyAmount">
        <el-input v-model.trim="loanOrderForm.applyAmount" type="number">
          <template slot="append">万</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button :loading="postOrderLoading" type="primary" @click="postOrder">确定</el-button>
      <el-button @click="cancelOrder">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create } from '@/api/loanOrder'
import { getProductPeriodList, getRepaymentModeList } from '@/api/loanProduct'
export default {
  name: 'LoanOrderForm',
  props: {
    productId: {
      type: String,
      required: true
    },
    productName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loanOrderVisible: false, periods: [], repaymentModes: [], postOrderLoading: false,
      loanOrderForm: { productId: '', period: '', repaymentMode: '', applyAmount: '' }
    }
  },
  created() {
  },
  methods: {
    show() {
      this.getProductPeriodList()
      this.getRepaymentModeList()
      this.loanOrderVisible = true
    },
    postOrder() {
      this.postOrderLoading = true
      this.loanOrderForm.productId = this.productId
      create(this.loanOrderForm).then(response => {
        this.$message({
          message: '申请贷款成功,请耐心等待审核!',
          type: 'success'
        })
        this.postOrderLoading = false
        this.loanOrderVisible = false
        // 跳转到订单页
        this.$router.push({ path: '/userCenter/loanOrder' })
      }).catch(() => {
        this.postOrderLoading = false
      })
    },
    cancelOrder() {
      this.$refs.loanOrderForm.resetFields()
      this.loanOrderVisible = false
    },
    getProductPeriodList() {
      getProductPeriodList(this.productId).then(res => {
        this.periods = res
      })
    },
    getRepaymentModeList() {
      getRepaymentModeList(this.productId).then(res => {
        this.repaymentModes = res
      })
    }
  }
}
</script>
