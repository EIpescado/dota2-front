<template>
  <div class="app-container">
    <div class="interface-button-container">
      <el-button size="mini" type="primary" @click="print"><i class="el-icon-printer" />打印文档</el-button>
    </div>
    <section ref="printDetail">
      <div class="interface-content">
        <el-form ref="form" :model="form" label-width="80px">
          <!--基础信息-->
          <div class="interface-form-line interface-form-line-first">
            <div class="base-info-title">
              <span>基础信息</span>
            </div>
            <div class="interface-form-input base-info">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="模块" prop="module">
                    {{ form.module }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="接口地址" prop="code">
                    {{ form.code }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="接口描述" prop="description">
                    {{ form.description }}
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <!--请求头-->
          <div class="interface-form-line">
            <div class="interface-form-title" style="border-left: 3px solid #ff4530;">
              <span>请求头</span>
            </div>
            <div class="interface-form-input">
              <el-table :data="form.requestHeaders" border style="width: 100%">
                <el-table-column label="请求头名称" prop="code" />
                <el-table-column label="说明" prop="description" />
                <el-table-column label="必填">
                  <template slot-scope="scope">
                    {{ scope.row.required ? '是' : '否' }}
                  </template>
                </el-table-column>
                <el-table-column label="默认值" prop="defaultValue" />
              </el-table>
            </div>
          </div>
          <!--请求参数-->
          <div class="interface-form-line">
            <div class="interface-form-title" style="border-left: 3px solid #5bc0de;">
              <span>请求参数</span>
            </div>
            <div class="interface-form-input">
              <el-table :data="form.requestParams" row-key="id" border default-expand-all style="width: 100%" :tree-props="{children: 'children'}">
                <el-table-column label="参数名称" prop="code" />
                <el-table-column label="参数类型" prop="dataType" />
                <el-table-column label="必填">
                  <template slot-scope="scope">
                    {{ scope.row.required ? '是' : '否' }}
                  </template>
                </el-table-column>
                <el-table-column label="参数说明" prop="description" />
                <el-table-column label="默认值" prop="defaultValue" />
              </el-table>
            </div>
          </div>
          <!--响应参数-->
          <div class="interface-form-line">
            <div class="interface-form-title" style="border-left: 3px solid #f0ad4e;">
              <span>返回参数</span>
            </div>
            <div class="interface-form-input">
              <el-table :data="form.responseParams" row-key="id" border default-expand-all style="width: 100%" :tree-props="{children: 'children'}">
                <el-table-column label="参数名称" prop="code" />
                <el-table-column label="参数说明" prop="description" />
                <el-table-column label="非NULL">
                  <template slot-scope="scope">
                    {{ scope.row.required ? '是' : '否' }}
                  </template>
                </el-table-column>
                <el-table-column label="数据类型" prop="dataType" />
              </el-table>
            </div>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import { get } from '@/api/interfaceDefinition'
export default {
  name: 'InterfaceDefinitionDetail',
  data() {
    return {
      interfaceId: '',
      form: {
        module: '', code: '', description: '',
        requestHeaders: [],
        requestParams: [],
        responseParams: []
      }
    }
  },
  created() {
    this.interfaceId = this.$router.currentRoute.query.interfaceId
    this.getDetail()
  },
  methods: {
    getDetail() {
      get(this.interfaceId).then(res => {
        this.form = res
      }).catch(() => {})
    },
    clearForm() {
      this.form = {
        module: '', code: '', description: '',
        requestHeaders: [],
        requestParams: [],
        responseParams: []
      }
    },
    print() {
      this.$print(this.$refs.printDetail)
    }
  }
}
</script>

<style scoped>
.interface-button-container { margin-bottom: 20px; }
.interface-content{height: calc(100% - 105px); margin-bottom: 25px;}
.interface-form-line{box-shadow: 0 0 5px rgba(0,0,0,0.2);margin-top: 20px;}
.interface-form-line-first{margin-top: 0;}
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
