<template>
  <div class="app-container">
    <el-row :gutter="20" type="flex">
      <el-col :span="12">
        <el-card shadow="hover">
          <p>您好,现在是: {{ nowTime }}</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
export default {
  name: 'Dashboard',
  data() {
    return {
      nowTime: ''
    }
  },
  created() {
    this.nowTime = parseTime(new Date(), '{y}年{m}月{d}日')
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
}
</style>
