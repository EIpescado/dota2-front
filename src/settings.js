module.exports = {
  title: 'DOTA2-front',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  /**
   * 请求头 凭证名称
   */
  tokenHeaderName: 'X-TOKEN',

  /**
   * 主页面页脚文字
   */
  mainFooterArray: [
    '走上人生的旅途吧。前途很远，也很暗。然而不要怕，不怕的人面前才有路       --鲁迅',
    '惟沉默是最高的轻蔑       --鲁迅',
    '当我沉默的时候，我觉得很充实，当我开口说话，就感到了空虚       --鲁迅',
    '面具戴太久，就会长到脸上，再想揭下来，除非伤筋动骨扒皮       --鲁迅'
  ]

}
