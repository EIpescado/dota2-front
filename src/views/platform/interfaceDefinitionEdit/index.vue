<template>
  <div class="app-container">
    <div class="interface-button-container">
      <el-button size="mini" type="primary" @click="edit"><i class="el-icon-circle-plus-outline" />立即修改</el-button>
      <el-button size="mini" type="primary" @click="cancel"><i class="el-icon-remove" />取消</el-button>
    </div>
    <div class="interface-content">
      <el-form ref="form" :model="form" label-width="80px">
        <!--基础信息-->
        <div class="interface-form-line">
          <div class="base-info-title">
            <span>基础信息</span>
          </div>
          <div class="interface-form-input base-info">
            <el-row>
              <el-col :span="12">
                <el-form-item label="模块" prop="module">
                  <el-select v-model="form.module">
                    <el-option v-for="item in moduleList" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="接口地址" prop="code">
                  <el-input v-model="form.code" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="接口描述" prop="description">
                  <el-input v-model="form.description" placeholder="请输入描述信息" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--请求头-->
        <div class="interface-form-line">
          <div class="interface-form-title" style="border-left: 3px solid #ff4530;">
            <span>请求头</span>
            <div class="interface-form-title-right">
              <el-button type="primary" plain size="small" @click="addRequestHead">添加一行</el-button>
            </div>
          </div>
          <div class="interface-form-input">
            <el-table :data="form.requestHeaders" border style="width: 100%">
              <el-table-column label="请求头名称">
                <template slot-scope="scope">
                  <div class="interface-input-name">
                    <el-form-item :prop="'requestHeaders.' + scope.$index + '.code'">
                      <el-input v-model="scope.row.code" size="small" placeholder="参数名必填" />
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="说明">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.description" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="必填">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.required" size="small">
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="默认值">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.defaultValue" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button size="small" type="danger" @click="deleteRequestHeader(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!--请求参数-->
        <div class="interface-form-line">
          <div class="interface-form-title" style="border-left: 3px solid #5bc0de;">
            <span>请求参数</span>
            <div class="interface-form-title-right">
              <el-button type="primary" plain size="small" @click="addRequestParam('')">添加一行</el-button>
            </div>
          </div>
          <div class="interface-form-input">
            <el-table :data="form.requestParams" row-key="id" border default-expand-all style="width: 100%" :tree-props="{children: 'children'}">
              <el-table-column label="名称">
                <template slot-scope="scope">
                  <div class="interface-input-name">
                    <el-form-item>
                      <el-input v-model="scope.row.code" size="small" placeholder="参数名必填" />
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="参数说明">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.description" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="必填">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.required" size="small">
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="数据类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.dataType" size="small">
                    <el-option v-for="item in dataTypeList" :key="item.value" :label="item.key" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="默认值">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.defaultValue" size="small" placeholder="默认值" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="small" type="primary" @click="addRequestParam(scope.$index, scope.row)">添加子参数</el-button>
                  <el-button size="small" type="danger" @click="deleteRequestParam(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!--响应参数-->
        <div class="interface-form-line">
          <div class="interface-form-title" style="border-left: 3px solid #f0ad4e;">
            <span>返回参数</span>
            <div class="interface-form-title-right">
              <el-button type="primary" plain size="small" @click="addResponseParam('')">添加一行</el-button>
            </div>
          </div>
          <div class="interface-form-input">
            <el-table :data="form.responseParams" row-key="id" border default-expand-all style="width: 100%" :tree-props="{children: 'children'}">
              <el-table-column label="名称">
                <template slot-scope="scope">
                  <div class="interface-input-name">
                    <el-form-item>
                      <el-input v-model="scope.row.code" size="small" />
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="参数说明">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.description" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="非NULL">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.required" size="small">
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="数据类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.dataType" size="small">
                    <el-option v-for="item in dataTypeList" :key="item.value" :label="item.key" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="small" type="primary" @click="addResponseParam(scope.$index, scope.row)">添加子参数</el-button>
                  <el-button size="small" type="danger" @click="deleteResponseParam(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { update, get } from '@/api/interfaceDefinition'
import { select } from '@/api/dict'
export default {
  name: 'InterfaceDefinitionEdit',
  data() {
    return {
      interfaceId: '', moduleList: [], dataTypeList: [],
      requestParamIndex: 0, responseParamIndex: 0,
      form: {
        module: '', code: '', description: '',
        requestHeaders: [],
        requestParams: [],
        responseParams: []
      }
    }
  },
  created() {
    this.getDataTypeList()
    this.getModuleList()
    this.interfaceId = this.$router.currentRoute.query.interfaceId
    this.getDetail()
  },
  methods: {
    edit() {
      update(this.interfaceId, this.form).then(res => {
        this.$message.success('修改成功')
        this.cancel()
      }).catch(() => {})
    },
    getDetail() {
      get(this.interfaceId).then(res => {
        this.form = res
      })
    },
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route).then(() => {
        this.clearForm()
        this.$router.push({ path: '/platform/interfaceDefinition' })
      })
    },
    clearForm() {
      this.form = {
        module: '', code: '', description: '',
        requestHeaders: [],
        requestParams: [],
        responseParams: []
      }
    },
    addRequestHead() {
      this.form.requestHeaders.push({
        defaultValue: '',
        description: '',
        code: '',
        required: true
      })
    },
    deleteRequestHeader(index, row) {
      this.form.requestHeaders.splice(index, 1)
    },
    addRequestParam(index, row) {
      this.requestParamIndex++
      const newRowData = {
        id: this.requestParamIndex, code: '', description: '', required: true, dataType: '', defaultValue: '', children: [], loop: 1
      }
      if (index !== '') {
        newRowData.loop = row.loop + 1
        row.children.push(newRowData)
      } else {
        newRowData.loop = 1
        this.form.requestParams.push(newRowData)
      }
    },
    deleteRequestParam(index, row) {
      if (row.loop && row.loop === 1) {
        this.form.requestParams.splice(index, 1)
      } else {
        // 递归删除...
        this.deleteRP(this.form.requestParams, row.id)
      }
    },
    addResponseParam(index, row) {
      this.responseParamIndex++
      const newRowData = {
        id: this.responseParamIndex, code: '', description: '', dataType: '', children: [], loop: 1
      }
      if (index !== '') {
        newRowData.loop = row.loop + 1
        row.children.push(newRowData)
      } else {
        newRowData.loop = 1
        this.form.responseParams.push(newRowData)
      }
    },
    deleteResponseParam(index, row) {
      if (row.loop && row.loop === 1) {
        this.form.responseParams.splice(index, 1)
      } else {
        // 递归删除...
        this.deleteRP(this.form.responseParams, row.id)
      }
    },
    deleteRP(data, id) {
      if (data && data.length !== 0) {
        data.forEach((item, index) => {
          if (item.id === id) {
            data.splice(index, 1)
            return
          } else {
            this.deleteRP(item.children, id)
          }
        })
      }
    },
    getDataTypeList() {
      select('PARAM_TYPE').then(res => {
        this.dataTypeList = res
      })
    },
    getModuleList() {
      select('MODULE').then(res => {
        this.moduleList = res
      })
    }
  }
}
</script>

<style scoped>
.interface-content{height: calc(100% - 105px);overflow-y: auto; margin-bottom: 25px;}
.interface-form-line{box-shadow: 0 0 5px rgba(0,0,0,0.2);margin-top: 20px;}
.base-info { padding: 10px 10px 0 10px; border-right: 1px solid #dfe6ec; border-left: 1px solid #dfe6ec;}
.base-info-title { line-height: 40px;border-left: 3px solid #4e61d4; border-bottom: 1px solid #dfe6ec; border-right: 1px solid #dfe6ec; padding-left: 20px; }
.interface-form-title{line-height: 40px;padding-left: 20px; border-right: 1px solid #dfe6ec;}
.interface-form-title span{font-size: 16px;}
.interface-form-title i{font-size: 12px;color: #999;}
.interface-form-title-right{float: right;padding-right: 10px;}
.interface-form-input .el-select{width: 100%;}
.interface-form-input >>> .el-table__empty-block{display: none;}
.interface-input-name .el-form-item{margin-bottom: 0;}
.interface-input-name >>> .el-form-item__content{margin-left: 0 !important;}
.interface-input-name .el-input{ width:100%;height:100%;}
</style>
