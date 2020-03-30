<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <!--菜单搜索-->
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />
      </template>
      <!--消息中心-->
      <MessageCenter class="right-menu-item" />
      <!--头像 个人信息 登出-->
      <el-dropdown class="right-menu-item" size="medium">
        <el-avatar v-if="!avatar || avatar === ''" :src="defaultUserLogo" size="medium" />
        <el-avatar v-else :src="avatar" size="medium" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            {{ nickName }}
          </el-dropdown-item>
          <router-link :to="{ path: '/center/person' }">
            <el-dropdown-item divided>
              <i class="el-icon-user" />
              个人中心
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">
              <i class="el-icon-close" />
              退出
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
``
<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Search from '@/components/HeaderSearch'
import MessageCenter from '@/components/MessageCenter'
import { removeToken } from '@/utils/auth'
import defaultUserLogo from '@/assets/images/default-user-logo.jpg'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Search,
    MessageCenter
  },
  data() {
    return {
      defaultUserLogo: defaultUserLogo
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'nickName'
    ])
  },
  created() {

  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      removeToken()
      await this.$store.dispatch('user/logout')
      await this.$store.dispatch('tagsView/delAllViews')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .055)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    margin-top: 4px;
    margin-bottom: 4px;
    height: 42px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 10px;
      height: 100%;
      // color: #5a5e66;
      vertical-align: text-bottom;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color:transparent;
      filter: alpha(Opacity=100);
      opacity: 1;
      &:hover {
        filter: alpha(Opacity=60);
        opacity: 0.6;
      }
    }
  }
}
</style>
