import { login, register } from '@/api/auth'
import { getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  id: '',
  username: '',
  nickName: '',
  roles: [],
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NICK_NAME: (state, nickName) => {
    state.nickName = nickName
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  }
}

const actions = {
  // user login
  login({ commit }, loginForm) {
    return new Promise((resolve, reject) => {
      login(loginForm).then(response => {
        commit('SET_TOKEN', response)
        setToken(response)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        if (!res) {
          reject('Verification failed, please Login again.')
        }

        const { roles, nickName, avatar, id, username } = res

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ID', id)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles)
        commit('SET_NICK_NAME', nickName)
        commit('SET_USERNAME', username)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_ID', '')
      commit('SET_AVATAR', '')
      commit('SET_ROLES', [])
      commit('SET_NICK_NAME', '')
      commit('SET_USERNAME', '')
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // refresh token
  refreshToken({ commit }, token) {
    return new Promise(resolve => {
      setToken(token)
      commit('SET_TOKEN', token)
      resolve()
    })
  },

  // uploadAvatar
  uploadAvatar({ commit }, avatar) {
    return new Promise(resolve => {
      commit('SET_AVATAR', avatar)
      resolve()
    })
  },

  // 注册
  register({ commit }, registerForm) {
    return new Promise((resolve, reject) => {
      register(registerForm).then(res => {
        commit('SET_TOKEN', res)
        setToken(res)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
