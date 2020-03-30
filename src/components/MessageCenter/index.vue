<template>
  <el-dropdown size="medium">
    <span>
      <el-badge slot="reference" is-dot :hidden="!unReadFlag" class="bag">
        <i class="el-icon-message-solid" />
      </el-badge>
    </span>
    <el-dropdown-menu slot="dropdown">
      <template>
        <router-link :to="{ path: '/center/message' }">
          <el-dropdown-item>
            <el-row>
              <span class="messageType">系统通知</span>
              <span :class="system > 0 ? 'item' : 'empty-item'">
                {{ system > 99 ? '99+' : system }}
              </span>
            </el-row>
          </el-dropdown-item>
        </router-link>
        <!-- <el-dropdown-item>
          <el-row>
            <span class="messageType">我的消息</span>
            <span :class="web > 0 ? 'item' : 'empty-item'">
              {{ web > 99 ? '99+' : web }}
            </span>
          </el-row>
        </el-dropdown-item> -->
        <!-- <el-dropdown-item>
          <el-row>
            <span class="messageType">公告</span>
            <span :class="notice > 0 ? 'item' : 'empty-item'">
              {{ notice > 99 ? '99+' : notice }}
            </span>
          </el-row>
        </el-dropdown-item> -->
      </template>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { unReadSummarize } from '@/api/message'
export default {
  name: 'MessageCenter',
  data() {
    return {
      unReadFlag: false,
      system: 0,
      web: 0,
      notice: 0
    }
  },
  created() {
    this.getUnReadMessage()
  },
  methods: {
    getUnReadMessage() {
      unReadSummarize().then(res => {
        this.system = res.system
        this.web = res.web
        this.notice = res.notice
        this.unReadFlag = res.unReadFlag
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .bag {
    margin-top: 10px;
    font-size: 18px;
  }
  .item {
    border-radius: 100%;
    background-color: #4091FF;
    border-radius: 10px;
    color: #FFFFFF;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
  }
  .empty-item {
    display: inline-block;
    padding: 0 6px;
  }
</style>
