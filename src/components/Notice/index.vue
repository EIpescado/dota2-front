<template>
  <el-dialog :visible.sync="noticeDialogVisible" center :width="width">
    <div v-html="noticeRow.content" />
  </el-dialog>
</template>

<script>
export default {
  name: 'Notice',
  props: {
    noticeRow: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      noticeDialogVisible: false,
      width: '100%'
    }
  },
  created() {
    this.width = document.body.clientWidth >= 768 ? '40%' : '100%'
  }
}
</script>
