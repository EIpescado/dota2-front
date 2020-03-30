const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  token: state => state.user.token,
  id: state => state.user.id,
  username: state => state.user.username,
  nickName: state => state.user.nickName,
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  enabledOptions: state => state.config.enabledOptions,
  sexOptions: state => state.config.sexOptions
}
export default getters
