<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典列表</span>
            <el-button style="float: right;padding: 4px 10px" type="primary" icon="el-icon-plus" @click="showDictForm">新增</el-button>
          </div>
          <!-- 搜索 -->
          <div class="query-container">
            <el-input v-model.trim="dictQo.keyWord" clearable placeholder="输入搜索内容" style="width: 45%;" @keyup.enter.native="filterDict" />
            <el-button type="primary" icon="el-icon-search" @click="filterDict">搜索</el-button>
          </div>
          <!--列表-->
          <el-table v-loading="showDictLoading" :data="dictList" size="small" highlight-current-row style="width: 100%;" @row-click="handleRowClick">
            <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" />
            <el-table-column :show-overflow-tooltip="true" prop="description" label="描述" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editDict(scope.row.id)" @click.stop="deleteVisible = true" />
                <el-popover :ref="scope.row.id" placement="top" width="180">
                  <p>此操作将删除字典与对应的字典详情，确定要删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="delDictLoading" type="primary" size="mini" @click="deleteDict(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click.stop="deleteVisible = true" />
                </el-popover>
              </template>
            </el-table-column>
          </el-table>

          <!--分页插件-->
          <pagination v-show="dictTotal>0" :total="dictTotal" :page.sync="dictQo.page" :size.sync="dictQo.size" @pagination="filterDict" />

          <!--字典表单-->
          <el-dialog :title="currentDictId ? '修改字典' : '新字典'" :visible.sync="dictFormVisible" center @close="clearForm('dictForm')">
            <el-form ref="dictForm" :model="dictForm" size="mini" label-width="50px">
              <el-form-item label="名称" prop="name">
                <el-input v-model.trim="dictForm.name" :disabled="currentDictId ? true : false" />
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input v-model.trim="dictForm.description" />
              </el-form-item>
            </el-form>
            <div slot="footer">
              <el-button :loading="saveDictLoading" type="primary" @click="saveDict">确认</el-button>
              <el-button @click="clearForm('dictForm')">取消</el-button>
            </div>
          </el-dialog>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典值列表</span>
            <el-button style="float: right;padding: 4px 10px" type="primary" icon="el-icon-plus" @click="showDictMemberForm">新增</el-button>
          </div>
          <!-- 搜索 -->
          <div class="query-container">
            <el-input v-model.trim="dictMemberQo.description" clearable placeholder="输入搜索内容" style="width: 45%;" @keyup.enter.native="filterDictMember" />
            <el-button type="primary" icon="el-icon-search" @click="filterDictMember">搜索</el-button>
          </div>
          <!--列表-->
          <el-table v-loading="showDictMemberLoading" :data="dictMemberList" size="small" highlight-current-row style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" prop="description" label="描述" />
            <el-table-column :show-overflow-tooltip="true" prop="val" label="值" />
            <el-table-column :show-overflow-tooltip="true" prop="sort" label="序号" />
            <el-table-column :show-overflow-tooltip="true" prop="lastUpdated" label="修改时间" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editDictMember(scope.row.id)" />
                <el-popover :ref="scope.row.id" placement="top" width="180">
                  <p>确定要删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="delDictMemberLoading" type="primary" size="mini" @click="deleteDictMember(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
                </el-popover>
              </template>
            </el-table-column>
          </el-table>

          <!--分页插件-->
          <pagination v-show="dictMemberTotal>0" :total="dictMemberTotal" :page.sync="dictMemberQo.page" :size.sync="dictMemberQo.size" @pagination="filterDictMember" />

          <!--字典明细表单-->
          <el-dialog :title="currentDictMemberId ? '修改字典明细' : '新字典明细'" :visible.sync="dictMemberFormVisible" center @close="clearForm('dictMemberForm')">
            <el-form ref="dictMemberForm" :model="dictMemberForm" size="mini" label-width="50px">
              <el-form-item label="描述" prop="description">
                <el-input v-model.trim="dictMemberForm.description" />
              </el-form-item>
              <el-form-item label="值" prop="val">
                <el-input v-model.trim="dictMemberForm.val" />
              </el-form-item>
              <el-form-item label="序号" prop="sort">
                <el-input v-model.number="dictMemberForm.sort" type="number" />
              </el-form-item>
            </el-form>
            <div slot="footer">
              <el-button :loading="saveDictMemberLoading" type="primary" @click="saveDictMember">确认</el-button>
              <el-button @click="clearForm('dictMemberForm')">取消</el-button>
            </div>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { listDict, getDict, deleteDict, createDict, updateDict, getDictMember, deleteDictMember, createDictMember, updateDictMember, listDictMember } from '@/api/dict'
export default {
  name: 'Dict',
  components: { Pagination },
  data() {
    return {
      showDictLoading: false, dictList: [], dictQo: { keyWord: '', page: 1, size: 10 }, dictTotal: 0, delDictLoading: false,
      showDictMemberLoading: false, dictMemberList: [], dictMemberQo: { description: '', dictName: '', page: 1, size: 10 }, dictMemberTotal: 0, delDictMemberLoading: false,
      dictFormVisible: false, currentDictId: undefined, dictForm: { name: '', description: '' }, saveDictLoading: false,
      dictMemberFormVisible: false, currentDictMemberId: undefined, dictMemberForm: { val: '', description: '', sort: '', dictName: '' }, saveDictMemberLoading: false
    }
  },
  created() {
    this.filterDict()
  },
  methods: {
    filterDict() {
      listDict(this.dictQo).then(response => {
        this.dictList = response.rows
        this.dictTotal = response.total
        this.showDictLoading = false
      }).catch(() => {
        this.showDictLoading = false
      })
    },
    showDictForm() {
      this.currentDictId = undefined
      this.dictFormVisible = true
    },
    saveDict() {
      this.saveDictLoading = true
      if (this.currentDictId) {
        // 修改
        updateDict(this.currentDictId, this.dictForm).then(res => {
          this.$message({
            message: '修改字典成功',
            type: 'success'
          })
          this.saveDictLoading = false
          this.dictFormVisible = false
          this.filterDict()
        }).catch(() => {
          this.saveDictLoading = false
        })
      } else {
        // 新增
        createDict(this.dictForm).then(res => {
          this.$message({
            message: '新增字典成功',
            type: 'success'
          })
          this.saveDictLoading = false
          this.dictFormVisible = false
          this.filterDict()
        }).catch(() => {
          this.saveDictLoading = false
        })
      }
    },
    clearForm(ref) {
      this.$refs[ref].resetFields()
      this.dictMemberFormVisible = false
      this.dictFormVisible = false
    },
    editDict(id) {
      this.dictFormVisible = true
      getDict(id).then(res => {
        this.currentDictId = id
        this.dictForm = res
      })
    },
    deleteDict(id) {
      this.delDictLoading = true
      deleteDict(id).then(res => {
        this.$message({
          message: '删除字典成功',
          type: 'success'
        })
        this.delDictLoading = false
        this.filterDict()
        this.filterDictMember()
      }).catch(() => {
        this.delDictLoading = false
      })
    },
    handleRowClick(row) {
      this.dictMemberQo.dictName = row.name
      this.filterDictMember()
    },
    filterDictMember() {
      listDictMember(this.dictMemberQo).then(response => {
        this.dictMemberList = response.rows
        this.dictMemberTotal = response.total
        this.showDictMemberLoading = false
      }).catch(() => {
        this.showDictMemberLoading = false
      })
    },
    deleteDictMember(id) {
      this.delDictMemberLoading = true
      deleteDictMember(id).then(res => {
        this.$message({
          message: '删除字典明细成功',
          type: 'success'
        })
        this.delDictMemberLoading = false
        this.filterDictMember()
      }).catch(() => {
        this.delDictMemberLoading = false
      })
    },
    showDictMemberForm() {
      if (this.dictMemberQo.dictName !== '') {
        this.currentDictMemberId = undefined
        this.dictMemberFormVisible = true
      } else {
        this.$message({
          message: '请先选择字典',
          type: 'warning'
        })
      }
    },
    saveDictMember() {
      this.saveDictMemberLoading = true
      if (this.currentDictMemberId) {
        // 修改
        updateDictMember(this.currentDictMemberId, this.dictMemberForm).then(res => {
          this.$message({
            message: '修改字典明细成功',
            type: 'success'
          })
          this.saveDictMemberLoading = false
          this.dictMemberFormVisible = false
          this.filterDictMember()
        }).catch(() => {
          this.saveDictMemberLoading = false
        })
      } else {
        // 新增
        this.dictMemberForm.dictName = this.dictMemberQo.dictName
        createDictMember(this.dictMemberForm).then(res => {
          this.$message({
            message: '新增字典成功',
            type: 'success'
          })
          this.saveDictMemberLoading = false
          this.dictMemberFormVisible = false
          this.filterDictMember()
        }).catch(() => {
          this.saveDictMemberLoading = false
        })
      }
    },
    editDictMember(id) {
      this.dictMemberFormVisible = true
      getDictMember(id).then(res => {
        this.currentDictMemberId = id
        this.dictMemberForm = res
      })
    }
  }
}
</script>
