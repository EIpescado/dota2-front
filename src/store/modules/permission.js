import { tree } from '@/api/menu'
import { constantRoutes } from '@/router'
import Layout from '@/layout'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      tree().then(response => {
        const accessedRoutes = filterAsyncRoutes(response[0].children)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

// 动态路由
export function filterAsyncRoutes(routes) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      path: route.path,
      component: route.component === 'Layout' ? Layout : loadView(route.component),
      hidden: route.hidden,
      meta: {
        title: route.name,
        icon: route.icon,
        id: route.id,
        buttons: route.buttons,
        affix: route.affix,
        keepAlive: route.keepAlive
      }
    }
    if (route.vueName) {
      tmp.name = route.vueName
    }
    if (route.redirect) {
      tmp.redirect = route.redirect
    }
    if (route.children) {
      tmp.children = filterAsyncRoutes(route.children)
    }
    res.push(tmp)
  })
  res.push({ path: '*', redirect: '/404', hidden: true })
  return res
}

export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}/index`)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
