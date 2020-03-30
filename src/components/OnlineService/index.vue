<template>
  <div class="main-im">
    <div v-show="showOpenIm" class="open-im" @click="showIm">&nbsp;</div>
    <div v-show="showImMain" class="im_main">
      <div class="close-im" @click="closeIm"><a href="javascript:void(0);" title="点击关闭">&nbsp;</a></div>
      <a :href="'http://wpa.qq.com/msgrd?v=3&uin=' + qqNumber + '&site=qq&menu=yes'" target="_blank" class="im-qq qq-a" title="在线QQ客服">
        <div class="qq-container" />
        <div class="qq-hover-c"><img class="img-qq" src="http://image.ylongtz.com/2019/11/22/Fr28VpRLyzxdOroK-cwufA_YU-nV.png"></div>
        <span> QQ在线咨询</span>
      </a>
      <div class="im-tel">
        <div>咨询热线</div>
        <div class="tel-num">{{ hotline }}</div>
        <div>服务热线</div>
        <div class="tel-num">{{ hotline }}</div>
      </div>
      <div class="im-footer" style="position:relative">
        <div class="weixing-container" @mouseenter="switchWeChat(true)" @mouseleave="switchWeChat(false)">
          <div v-show="showWeChat" class="weixing-show">
            <div class="weixing-txt">微信小程序</div>
            <img class="weixing-ma" :src="qrCode">
            <div class="weixing-sanjiao" />
            <div class="weixing-sanjiao-big" />
          </div>
        </div>
        <div class="go-top" @click="goTop"><a href="javascript:;" title="返回顶部" /></div>
        <div style="clear:both" />
      </div>
    </div>
  </div>
</template>

<script>
import { currentOnlineServiceInfo } from '@/api/enterprisePortalInfo'
export default {
  name: 'OnlineService',
  data() {
    return {
      showImMain: false, showOpenIm: true, showWeChat: false, qrCode: '',
      hotline: '', qqNumber: ''
    }
  },
  created() {
  },
  methods: {
    showIm() {
      if (!this.hotline) {
        currentOnlineServiceInfo().then(res => {
          this.hotline = res.hotLine
          this.qqNumber = res.qq
          this.qrCode = res.qrCode
        })
      }
      this.showOpenIm = false
      this.showImMain = true
    },
    closeIm() {
      this.showImMain = false
      this.showOpenIm = true
    },
    goTop() {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    switchWeChat(val) {
      this.showWeChat = val
    }
  }
}
</script>
<style lang="scss" scoped>
*{margin:0;padding:0;list-style-type:none;}
a,img{border:0;}
a{text-decoration:none;}
a:hover{text-decoration:underline;}
body{font:12px/180% Arial, Helvetica, sans-serif, "新宋体";color:#333333;}

/* 主要css样式*/
.main-im{position:fixed;right:10px;bottom:0px;z-index:100;width:110px;height:272px;}
.main-im .qq-a{display:block;width:106px;height:116px;font-size:14px;color:#0484cd;text-align:center;position:relative;}
.main-im .qq-a span{bottom:5px;position:absolute;width:90px;left:10px;}
.main-im .qq-hover-c{width:70px;height:70px;border-radius:35px;position:absolute;left:18px;top:10px;overflow:hidden;z-index:9;}
.main-im .qq-container{z-index:99;position:absolute;width:109px;height:118px;border-top-left-radius:10px;border-top-right-radius:10px;border-bottom:1px solid #dddddd;background:url(http://image.ylongtz.com/2019/11/22/FnmzDHgSaCd7sinl9w82gFlkDfBc.png) no-repeat center 8px;}
.main-im .img-qq{max-width:60px;display:block;position:absolute;left:6px;top:3px;-moz-transition:all 0.5s;-webkit-transition:all 0.5s;-o-transition:all 0.5s;transition:all 0.5s;}
.main-im .im-qq:hover .img-qq{max-width:70px;left:1px;top:8px;position:absolute;}
.main-im .im_main{background:#F9FAFB;border:1px solid #dddddd;border-radius:10px;background:#F9FAFB;}
.main-im .im_main .im-tel{color:#000000;text-align:center;width:109px;height:105px;border-bottom:1px solid #dddddd;}
.main-im .im_main .im-tel div{font-weight:bold;font-size:12px;margin-top:6px;}
.main-im .im_main .im-tel .tel-num{font-family:Arial;font-weight:bold;color:#e66d15;font-size: 14px;}
.main-im .im_main .im-tel:hover{background:#fafafa;}
.main-im .im_main .weixing-container{width:55px;height:47px;border-right:1px solid #dddddd;background:#f5f5f5;border-bottom-left-radius:10px;background:url(http://image.ylongtz.com/2019/11/22/FnyM096BdCRF2t6pHZkqTf9fBzgV.png) no-repeat center center;float:left;}
.main-im .im_main .weixing-show{width:112px;height:172px;background:#ffffff;border-radius:10px;border:1px solid #dddddd;position:absolute;left:-125px;top:-126px;}
.main-im .im_main .weixing-show .weixing-sanjiao{width:0;height:0;border-style:solid;border-color:transparent transparent transparent #ffffff;border-width:6px;left:112px;top:134px;position:absolute;z-index:2;}
.main-im .im_main .weixing-show .weixing-sanjiao-big{width:0;height:0;border-style:solid;border-color:transparent transparent transparent #dddddd;border-width:8px;left:112px;top:132px;position:absolute;}
.main-im .im_main .weixing-show .weixing-ma{width:104px;height:103px;padding-left:5px;padding-top:5px;}
.main-im .im_main .weixing-show .weixing-txt{position:absolute;top:110px;left:7px;width:100px;margin:0 auto;text-align:center;}
.main-im .im_main .go-top{width:50px;height:47px;background:#f5f5f5;border-bottom-right-radius:10px;background:url(http://image.ylongtz.com/2019/11/22/FofDYSQuXJcfB_p68IFISwMhr-wi.png) no-repeat center center;float:right;}
.main-im .im_main .go-top a{display:block;width:52px;height:47px;}
.main-im .close-im{position:absolute;right:10px;top:-12px;z-index:100;width:24px;height:24px;}
.main-im .close-im a{display:block;width:24px;height:24px;background:url(http://image.ylongtz.com/2019/11/22/FlpnNl3x9_UtVFYXWxYa5CXggeh1.png) no-repeat left top;}
.main-im .close-im a:hover{text-decoration:none;}
.main-im .open-im{cursor:pointer;margin-left:68px;width:40px;height:133px;background:url(http://image.ylongtz.com/2019/11/22/FhsV2T1mWF0Tnjz9IzpmIB12jXcY.png) no-repeat left top;}
</style>
