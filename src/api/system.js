import {get,post} from '@/utils/request'

// 获取账号列表
export const getAccountList = (params) => get('/api/system/account',params)
// 新增账号
export const addAccount = (data) => post('/api/system/addAccount',data)
// 修改账号
export const editAccount = (data) => post('/api/system/editAccount',data)
// 删除账号
export const deleteAccount = (data) => post('/api/system/deleteAccount',data)



// 获取角色列表
export const getRoleList = (params) => get('/api/system/role',params)
// 新增角色
export const addRole= (data) => post('/api/system/addRole',data)
// 修改角色
export const editRole = (data) => post('/api/system/editRole',data)
// 删除角色
export const deleteRole = (data) => post('/api/system/deleteRole',data)
