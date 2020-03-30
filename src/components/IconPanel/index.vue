<template>
  <div class="icon-body">
    <el-input v-model="name" style="position: relative;" clearable placeholder="请输入图标名称" @clear="filterIcons" @input.native="filterIcons">
      <i slot="suffix" class="el-icon-search" />
    </el-input>
    <el-tabs>
      <el-tab-pane label="Icons">
        <div class="icon-list">
          <div v-for="item of svgIconList" :key="item" @click="selectedIcon(item)">
            <svg-icon :icon-class="item" style="height: 30px;width: 16px;" />
            <span>{{ item }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons">
        <div class="icon-list">
          <div v-for="item of elementIconList" :key="item" @click="selectedIcon(item)">
            <i :class="item"> {{ item }}</i>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import svgIcons from './svg-icons'
import elementIcons from './element-icons'

export default {
  name: 'IconPanel',
  data() {
    return {
      svgIcons,
      elementIcons,
      name: '',
      svgIconList: svgIcons,
      elementIconList: svgIcons
    }
  },
  methods: {
    filterIcons() {
      if (this.name) {
        this.svgIconList = this.svgIcons.filter(item => item.includes(this.name))
        this.elementIconList = this.elementIcons.filter(item => item.includes(this.name))
      } else {
        this.svgIconList = svgIcons
        this.elementIconList = elementIcons
      }
    },
    selectedIcon(name) {
      this.$emit('selectIcon', name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.svgIconList = svgIcons
      this.elementIconList = elementIcons
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .icon-body {
    width: 100%;
    padding: 10px;
    .icon-list {
      height: 200px;
      overflow-y: scroll;
      div {
        height: 30px;
        line-height: 30px;
        margin-bottom: -5px;
        cursor: pointer;
        width: 50%;
        float: left;
      }
      span {
        display: inline-block;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }
    }
  }
</style>
