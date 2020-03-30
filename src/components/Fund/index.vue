<template>
  <el-dialog :visible="dialog" :title="type === 'release' ? '放款记录' : '还款记录'" center append-to-body @close="cancel">
    <el-table v-loading="fundLoading" :data="records" size="small" :summary-method="getSummaries" show-summary fit highlight-current-row class="fundTable">
      <el-table-column :label="type === 'release' ? '放款时间' : '还款时间'" prop="actualDate" />
      <el-table-column label="金额(元)" prop="amount" />
      <el-table-column label="录入" prop="recordUser" />
      <el-table-column label="最后修改" prop="lastModifyUser" />
      <el-table-column label="记录时间" prop="lastUpdated" />
    </el-table>
  </el-dialog>
</template>

<script>
import { releaseFundList, retryFundList } from '@/api/fund'
export default {
  name: 'FundDetail',
  data() {
    return {
      dialog: false, type: '', loanOrderId: '', records: [], fundLoading: false
    }
  },
  created() {
  },
  methods: {
    show() {
      this.listRecords()
      this.dialog = true
    },
    listRecords() {
      this.fundLoading = true
      if (this.type === 'release') {
        releaseFundList(this.loanOrderId).then(res => {
          this.records = res
        })
      } else {
        retryFundList(this.loanOrderId).then(res => {
          this.records = res
        })
      }
      this.fundLoading = false
    },
    cancel() {
      this.dialog = false
      this.records = []
    },
    getSummaries(param) {
      const { data } = param
      const sums = []
      sums.push(this.type === 'release' ? '总放款' : '总还款')
      const values = data.map(item => Number(item.amount))
      if (!values.every(value => isNaN(value))) {
        const totalValue = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)
        sums.push(totalValue + ' 元')
      } else {
        sums.push('N/A')
      }
      return sums
    }
  }
}
</script>
<style lang="scss" scoped>
.fundTable {
  width: 100%; overflow-y:auto; max-height:500px;
}
</style>
