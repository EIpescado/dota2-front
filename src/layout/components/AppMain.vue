<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <div v-if="mainFooterArray && mainFooterArray.length > 0" id="el-main-footer">
      <transition name="slide">
        <p :key="text.id" class="text">{{ text.val }}</p>
      </transition>
    </div>
  </section>
</template>

<script>
import { mainFooterArray } from '@/settings'
export default {
  name: 'AppMain',
  data() {
    return {
      number: 0,
      mainFooterArray: mainFooterArray,
      mainFooterNumber: mainFooterArray && mainFooterArray.length > 0 ? mainFooterArray.length : 0
    }
  },
  computed: {
    text() {
      return {
        id: this.number,
        val: this.mainFooterArray[this.number]
      }
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  mounted() {
    this.startMove()
  },
  methods: {
    startMove() {
      // 滚动不需要停顿则将2000改成动画持续时间
      setTimeout(() => {
        if (this.number === this.mainFooterNumber - 1) {
          this.number = 0
        } else {
          this.number += 1
        }
        this.startMove()
      }, 5000)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.6s linear;
}
.slide-enter{
  transform: translateY(20px);
  opacity: 1;
}
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
