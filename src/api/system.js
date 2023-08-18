import axios from '@/utils/request'

// 获取账号列表
export const getAccountList = (params) => axios.get('/api/system/account', params)
// 新增账号
export const addAccount = (data) => axios.post('/api/system/addAccount', data)
// 修改账号
export const editAccount = (data) => axios.post('/api/system/editAccount', data)
// 删除账号
export const deleteAccount = (data) => axios.post('/api/system/deleteAccount', data)

// 获取角色列表
export const getRoleList = (params) => axios.get('/api/system/role', params)
// 新增角色
export const addRole = (data) => axios.post('/api/system/addRole', data)
// 修改角色
export const editRole = (data) => axios.post('/api/system/editRole', data)
// 删除角色
export const deleteRole = (data) => axios.post('/api/system/deleteRole', data)
