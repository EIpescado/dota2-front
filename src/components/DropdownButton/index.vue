<template>
  <div>
    <template v-if="buttons !== undefined && buttons !== null && buttons.length > 0">
      <el-dropdown @command="clickCallBack">
        <el-button size="mini" type="primary" icon="el-icon-s-operation">操作</el-button>
        <el-dropdown-menu slot="dropdown" split-button>
          <template v-for="bt in buttons">
            <el-dropdown-item :key="bt.id" :command="bt.click" :icon="bt.icon">
              {{ bt.buttonName }}
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </div>
</template>

<script>

export default {
  name: 'DropdownButton',
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      buttons: []
    }
  },
  created() {
    this.getButtons()
  },
  methods: {
    clickCallBack(val) {
      this.$emit('listenCall', val, this.row)
    },
    getButtons() {
      const metaButtons = this.$route.meta.buttons
      this.buttons = (metaButtons !== null && metaButtons !== undefined) ? metaButtons.RIGHT : []
    }
  }
}
</script>

<style>
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
