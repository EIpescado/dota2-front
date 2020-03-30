``<template>
  <div class="app-container">
    <el-row :gutter="15" type="flex">
      <!--消息类型-->
      <el-col :xs="0" :sm="12" :md="6" :lg="6" :xl="3">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span class="center-title"><i class="el-icon-message-solid" />消息中心</span>
          </div>
          <ul class="typeList">
            <li :class="(current === 'system' ? 'active ' : '') + 'type-item'" @click="messageClick('system')">系统通知</li>
            <!-- <li :class="(current === 'web' ? 'active ' : '') + 'type-item'" @click="messageClick('web')">我的消息</li> -->
          </ul>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="18" :lg="18" :xl="21">
        <!--系统通知-->
        <el-card v-show="current === 'system'" shadow="never">
          <div slot="header" class="clearfix">
            <span class="left-title">系统通知</span>
          </div>
          <div class="infinite-list-wrapper">
            <ul v-infinite-scroll="systemLoad" :infinite-scroll-disabled="systemDisabled" infinite-scroll-delay="200" class="list">
              <li v-for="row in systemMessageList" :key="row.id" class="card">
                <div>
                  <span class="title">{{ row.title }}</span>
                  <span class="time">{{ row.dateCreated }}</span>
                </div>
                <div class="bottom">{{ row.content }}</div>
              </li>
              <li v-if="systemNomore" class="card">
                <div>
                  <span class="title">没有更多了......</span>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
        <!--我的消息-->
        <!-- <el-card v-show="current === 'web'" shadow="never">
          <div slot="header" class="clearfix">
            <span class="left-title">我的消息</span>
          </div>
          <div>todo</div>
        </el-card> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { systemList } from '@/api/message'

export default {
  name: 'Message',
  data() {
    return {
      current: 'system',
      systemQo: { page: 1, size: 10 }, systemMessageList: [], systemNomore: false, systemDisabled: false
    }
  },
  created() {
  },
  methods: {
    messageClick(messageType) {
      this.current = messageType
      if (messageType === 'notice') {
        this.noticeLoad()
      }
    },
    systemLoad() {
      systemList(this.systemQo).then(res => {
        this.systemMessageList.push(...res.rows)
        this.systemQo.page += 1
        if (res.rows.length === 0 || this.systemQo.page > res.pages) {
          this.systemNomore = true
          this.systemDisabled = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.center-title {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  justify-content: center;
  color: #333;
}
.left-title {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  color: #6b757b;
}
.typeList {
  margin:5px 0;
  .type-item {
    margin: 0;
    padding: 0;
    height: 40px;
    position: relative;
    color: #6b757b;
    display: flex;
    font-weight: 700;
    font-size: 14px;
    align-items: center;
    list-style-type: none;
    cursor: pointer;
  }
  .active, .type-item:hover, .type-item:hover:before {
    color: #4091FF;
  }
}
.message-type {
  padding: 3px 0;
  line-height: 40px;
  text-align: left;
}
.infinite-list-wrapper {
  max-height:580px;
  text-align: left;
  overflow:auto;
  .list {
    padding: 0;
    margin: 0 14px 0 0;
    font-size: 14px;
    .card {
      padding: 24px 16px;
      background-color: #fff;
      margin-bottom: 10px;
      border-radius: 4px;
      line-height: 24px;
      position: relative;
      box-shadow: 2px 2px 4px 2px rgba(121,146,185,.54);
      .title{
        margin: 0;
        padding: 0;
        color:#333;
        font-weight:700;
      }
      .time{
        color: #999;
        line-height: 22px;
        margin: 0 10px;
      }
      .bottom{
        color:#666;
        padding-left:8px;
        word-break: break-word;
      }
    }
  }
}
</style>
