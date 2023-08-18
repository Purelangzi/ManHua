const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  menus: state => state.user.menus,
  isAddRoutes: state => state.user.isAddRoutes,
  isDefaultRoutes: state => state.user.isDefaultRoutes,
  resultMenus: state => state.user.resultMenus
}
export default getters
