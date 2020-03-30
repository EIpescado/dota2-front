import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
// import PortalLayout from '@/portalLayout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
    haveLoginCanNotVisit: true   已登录不可访问此页面,直接跳转首页
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  { path: '/', redirect: '/login' },
  // 登录
  { path: '/login', component: () => import('@/views/login'), hidden: true, name: 'Login', meta: { title: '登录', haveLoginCanNotVisit: true }},
  // 注册
  { path: '/register', component: () => import('@/views/register'), hidden: true, name: 'Register', meta: { title: '注册', haveLoginCanNotVisit: true }},
  // 重置密码
  { path: '/retrievePassword', component: () => import('@/views/retrievePassword'), hidden: true, name: 'RetrievePassword', meta: { title: '重置密码', haveLoginCanNotVisit: true }},
  // 404
  { path: '/404', component: () => import('@/views/404'), hidden: true, name: 'Page404', meta: { title: '404' }},
  // 个人中心
  {
    path: '/center', component: Layout, hidden: true,
    children: [
      { path: 'person', component: () => import('@/views/center/person/index'), name: 'Person', meta: { title: '个人中心' }},
      { path: 'message', component: () => import('@/views/center/message/index'), name: 'Message', meta: { title: '消息中心' }}
    ]
  },
  // 管理页首页
  {
    path: '', component: Layout, children: [
      { path: '/home', component: () => import('@/views/dashboard/index'), name: 'Dashboard', meta: { title: '首页', icon: 'dashboard', affix: true }}
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
