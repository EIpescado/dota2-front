<template>
  <div class="app-container">

    <el-row :gutter="15">
      <!--菜单及按钮树-->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card shadow="hover">
          <!-- 顶部按钮 -->
          <TopButton @listenCall="listenCall" />
          <!--菜单前端过滤-->
          <el-input v-model.trim="filterText" style="margin-top:20px;" placeholder="输入关键字进行过滤">
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
          <el-tree
            ref="tree"
            :data="menus"
            :props="defaultProps"
            :check-strictly="true"
            :expand-on-click-node="false"
            highlight-current
            node-key="id"
            style="margin-top:20px;"
            :filter-node-method="filterNode"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }} - {{ data.rowNo }}</span>
              <span>
                <el-button type="text" size="mini" icon="el-icon-edit" @click="edit(data)">修改{{ data.type === 'BUTTON' ? '按钮' : '菜单' }}</el-button>
                <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteNode(data)">删除</el-button>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>

      <!--表单-->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <!--菜单表单-->
        <el-card v-show="showMenuForm" shadow="hover" style="height:100%;">
          <template>
            <div slot="header" class="clearfix">
              <span>{{ isAddMenu ? '新增' : '修改' }}菜单</span>
            </div>
          </template>
          <el-form ref="menuForm" :model="menuForm" size="small" label-width="100px">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" />
            </el-form-item>
            <el-form-item label="vue名称" prop="vueName">
              <el-input v-model="menuForm.vueName" />
            </el-form-item>
            <el-form-item label="页面路径" prop="path">
              <el-input v-model="menuForm.path" />
            </el-form-item>
            <el-form-item label="组件" prop="component">
              <el-input v-model="menuForm.component" />
            </el-form-item>
            <el-form-item label="排序号" prop="rowNo">
              <el-input v-model.number="menuForm.rowNo" type="number" />
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-popover placement="bottom-start" trigger="click" width="650" @show="$refs.menuIconSelect.reset()">
                <IconPanel ref="menuIconSelect" @selectIcon="selectIcon" />
                <el-input slot="reference" v-model="menuForm.icon" placeholder="点击选择图标" readonly>
                  <i v-if="!menuForm.icon" slot="prefix" class="el-icon-search" />
                  <svg-icon v-else-if="menuForm.icon.indexOf('el-icon-') === -1" slot="prefix" :icon-class="menuForm.icon" style="height: 32px;width: 16px;line-height: 32px;" />
                  <i v-else slot="prefix" :class="menuForm.icon" />
                </el-input>
              </el-popover>
            </el-form-item>
            <el-form-item label="跳转" prop="redirect">
              <el-input v-model="menuForm.redirect" />
            </el-form-item>
            <el-form-item label="是否常驻tab" prop="affix">
              <el-switch v-model="menuForm.affix" />
            </el-form-item>
            <el-form-item label="是否隐藏" prop="hidden">
              <el-switch v-model="menuForm.hidden" />
            </el-form-item>
            <el-form-item label="keep-alive" prop="keepAlive">
              <el-switch v-model="menuForm.keepAlive" />
            </el-form-item>
            <el-form-item label="父菜单" prop="parentId">
              <treeselect v-model="menuForm.parentId" :options="menus" placeholder="父菜单" :normalizer="normalizer" />
            </el-form-item>
            <el-form-item>
              <template>
                <el-button type="primary" size="medium" round @click="menuSubmit">{{ isAddMenu ? '立即创建' : '保存' }}</el-button>
                <el-button size="medium" round @click="menuCancel">取消</el-button>
              </template>
            </el-form-item>
          </el-form>
        </el-card>

        <!--按钮表单-->
        <el-card v-show="showButtonForm" class="box-card" shadow="hover">
          <template>
            <div slot="header" class="clearfix">
              <span>{{ isAddButton ? '新增' : '修改' }}按钮</span>
            </div>
          </template>
          <el-form ref="buttonForm" :model="buttonForm" size="small" label-width="100px">
            <el-form-item label="按钮名称" prop="buttonName">
              <el-input v-model.trim="buttonForm.buttonName" />
            </el-form-item>
            <el-form-item label="排序号" prop="rowNo">
              <el-input v-model.number="buttonForm.rowNo" type="number" />
            </el-form-item>
            <el-form-item label="图标">
              <el-popover placement="bottom-start" trigger="click" width="650" @show="$refs.buttonIconSelect.reset()">
                <IconPanel ref="buttonIconSelect" @selectIcon="selectIcon" />
                <el-input slot="reference" v-model="buttonForm.icon" placeholder="点击选择图标" readonly>
                  <i v-if="!buttonForm.icon" slot="prefix" class="el-icon-search" />
                  <svg-icon v-else-if="buttonForm.icon.indexOf('el-icon-') === -1" slot="prefix" :icon-class="buttonForm.icon" style="height: 32px;width: 16px;line-height: 32px;" />
                  <i v-else slot="prefix" :class="buttonForm.icon" />
                </el-input>
              </el-popover>
            </el-form-item>
            <el-form-item label="位置" prop="position">
              <el-select v-model="buttonForm.position">
                <el-option v-for="item in positionOptions" :key="item.key" :label="item.val" :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="绑定函数名" prop="click">
              <el-input v-model.trim="buttonForm.click" />
            </el-form-item>
            <el-form-item label="所属菜单" prop="menuId">
              <treeselect v-model="buttonForm.menuId" :options="menus" placeholder="所属菜单" :normalizer="normalizer" />
            </el-form-item>
            <el-form-item>
              <template>
                <el-button type="primary" size="medium" round @click="buttonSubmit">{{ isAddMenu ? '立即创建' : '保存' }}</el-button>
                <el-button size="medium" round @click="buttonCancel">取消</el-button>
              </template>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

    </el-row>

  </div>
</template>

<script>
import { get, create, update, deleteMenu, fullTree } from '@/api/menu'
import { getButton, createButton, updateButton, deleteButton } from '@/api/button'
import TopButton from '@/components/TopButton'
import Treeselect from '@riophae/vue-treeselect'
import IconPanel from '@/components/IconPanel'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Menu',
  components: { Treeselect, TopButton, IconPanel },
  data() {
    return {
      menus: [],
      filterText: '',
      showMenuForm: false, menuForm: { menuName: '', path: '', component: '', rowNo: null, icon: '', redirect: '', parentId: undefined, affix: false, vueName: '', hidden: false, keepAlive: true },
      showButtonForm: false, buttonForm: { buttonName: '', menuId: undefined, rowNo: null, icon: '', position: '', click: '' },
      isAddMenu: false, isAddButton: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      positionOptions: [
        { key: 'TOP', val: '顶部按钮' },
        { key: 'RIGHT', val: '单列按钮' }
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getFullTree()
  },
  methods: {
    getFullTree() {
      fullTree().then(response => {
        this.menus = response
      }).catch(() => {})
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children !== undefined && node.children !== null && node.children.length > 0 ? node.children : undefined,
        isDisabled: node.type === 'BUTTON'
      }
    },
    edit(data) {
      if (data.type === 'MENU') {
        this.showMenuForm = true
        this.showButtonForm = false
        this.isAddMenu = false
        get(data.id).then(response => {
          this.menuForm = response
        }).catch(() => {})
      } else {
        this.showButtonForm = true
        this.showMenuForm = false
        this.isAddButton = false
        getButton(data.id).then(response => {
          this.buttonForm = response
        }).catch(() => {})
      }
    },
    menuSubmit() {
      if (this.isAddMenu) {
        create(this.menuForm).then(response => {
          this.$message({
            message: '新增菜单成功',
            type: 'success'
          })
          this.showMenuForm = false
          this.getFullTree()
        }).catch(() => {})
      } else {
        const id = this.$refs.tree.getCurrentNode().id
        update(id, this.menuForm).then(response => {
          this.$message({
            message: '修改菜单成功',
            type: 'success'
          })
          this.showMenuForm = false
          this.getFullTree()
        }).catch(() => {})
      }
    },
    buttonSubmit() {
      if (this.isAddButton) {
        createButton(this.buttonForm).then(response => {
          this.$message({
            message: '新增按钮成功',
            type: 'success'
          })
          this.showButtonForm = false
          this.getFullTree()
        }).catch(() => {})
      } else {
        const id = this.$refs.tree.getCurrentNode().id
        updateButton(id, this.buttonForm).then(response => {
          this.$message({
            message: '修改按钮成功',
            type: 'success'
          })
          this.showButtonForm = false
          this.getFullTree()
        }).catch(() => {})
      }
    },
    menuCancel() {
      this.showMenuForm = false
      this.clearForm()
    },
    buttonCancel() {
      this.showButtonForm = false
      this.clearForm()
    },
    clearForm() {
      this.$refs.menuForm.resetFields()
      this.$refs.buttonForm.resetFields()
    },
    deleteNode(data) {
      const tips = '确认删除' + (data.type === 'MENU' ? '菜单' : '按钮') + ':' + data.name + '?'
      this.$confirm(tips, '提示', {
        type: 'warning'
      }).then(() => {
        if (data.type === 'MENU') {
          deleteMenu(data.id).then(response => {
            this.$message({
              message: '删除菜单成功',
              type: 'success'
            })
            this.getFullTree()
          }).catch(() => {})
        } else {
          deleteButton(data.id).then(response => {
            this.$message({
              message: '删除按钮成功',
              type: 'success'
            })
            this.getFullTree()
          }).catch(() => {})
        }
      }).catch(() => {
      })
    },
    addMenu() {
      this.add(true)
    },
    addButton() {
      this.add(false)
    },
    add(isMenu) {
      const node = this.$refs.tree.getCurrentNode()
      if (!node) {
        this.$message({
          message: '请选择父节点',
          type: 'warning'
        })
      } else {
        this.clearForm()
        if (node.type === 'BUTTON') {
          this.isAddMenu = false
          this.menuCancel()
          this.isAddButton = false
          this.buttonCancel()
          this.$message({
            message: '按钮下无法建立子节点',
            type: 'warning'
          })
        } else {
          if (isMenu) {
            this.isAddMenu = true
            this.menuForm.parentId = node.id
            this.showMenuForm = true
            this.showButtonForm = false
          } else {
            this.isAddButton = true
            this.buttonForm.menuId = node.id
            this.showButtonForm = true
            this.showMenuForm = false
          }
        }
      }
    },
    listenCall(method, row) {
      this[method](row)
    },
    selectIcon(name) {
      if (this.showMenuForm) {
        this.menuForm.icon = name
      } else {
        this.buttonForm.icon = name
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .menu-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
